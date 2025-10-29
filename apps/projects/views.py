from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.urls import reverse
from .models import Project
from .serializers import ProjectSerializer, BinPackingInputSerializer, BinPackingOutputSerializer
from .forms import ProjectForm
import base64
import io
import threading

# Force headless backend before importing pyplot
import matplotlib
matplotlib.use("Agg")     # <- crucial on servers
import matplotlib.pyplot as plt
plt.ioff()  # Turn interactive off
from copy import copy

# Optional: simple lock so concurrent requests don't step on pyplot state
_PLOT_LOCK = threading.Lock()


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Project.objects.filter(user=self.request.user).order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_projects(self, request):
        """Get current user's projects"""
        projects = self.get_queryset()
        serializer = self.get_serializer(projects, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def bin_pack(self, request):
        """Perform 2D bin packing optimization using external library"""
        try:
            # Import bin packing library
            from BinPacker import BinPacker
            from Configuration import Configuration
            
            # Validate input
            input_serializer = BinPackingInputSerializer(data=request.data)
            if not input_serializer.is_valid():
                return Response(input_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            validated = input_serializer.validated_data
            W = int(validated['container_width'])
            H = int(validated['container_height'])
            rects = [(int(r['width']), int(r['height'])) for r in validated['rectangles']]
            
            # Enable plotting so util.* actually draws
            C = Configuration(
                size=(W, H),
                unpacked_rects=copy(rects),
                enable_plotting=True,  # <-- was False
            )
            packer = BinPacker(C)
            C = packer.PackConfiguration(C)
            
            # Quick sanity checks (add temporarily)
            print("packed:", len(getattr(C, "packed_rects", [])), "W,H:", W, H)
            
            # --- Generate visualization data for frontend SVG rendering ---
            def serialize_concave_corners(corners):
                """Serialize concave corners similar to save_points from util.py"""
                return [
                    {
                        "x": corner[0][0],
                        "y": corner[0][1],
                        "type": corner[1].name if hasattr(corner[1], "name") else str(corner[1])
                    }
                    for corner in corners
                ]
            
            # Extract visualization data
            visualization_data = {
                'container': {'width': W, 'height': H},
                'packed_rects': [{
                    'x': r.origin[0],
                    'y': r.origin[1],
                    'width': r.width,
                    'height': r.height,
                    'rotated': getattr(r, 'rotated', False),
                } for r in getattr(C, 'packed_rects', [])],
                'unpacked_rects': [{'width': w, 'height': h} for w, h in getattr(C, 'unpacked_rects', [])],
                'concave_corners': serialize_concave_corners(getattr(C, 'concave_corners', [])),
                'all_input_rects': [{'width': w, 'height': h} for w, h in rects]
            }
            
            # Extract packed rectangles
            packed_rectangles = [{
                'x': r.origin[0],
                'y': r.origin[1],
                'width': r.width,
                'height': r.height,
                'rotated': getattr(r, 'rotated', False),
            } for r in getattr(C, 'packed_rects', [])]
            
            return Response({
                'success': C.is_successful(),
                'density': C.density(),
                'packed_rectangles': packed_rectangles,
                'visualization': visualization_data,
                'message': 'چیدمان با موفقیت تکمیل شد' if C.is_successful()
                           else f'چیدمان ناقص است. {len(C.unpacked_rects)} قطعه قابل چیدمان نبود.',
            }, status=status.HTTP_200_OK)
                
        except ImportError as e:
            return Response(
                {'error': f'کتابخانه بهینه‌سازی چیدمان در دسترس نیست: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            return Response(
                {'error': f'بهینه‌سازی چیدمان ناموفق بود: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# Function-based views for template rendering
@login_required
def project_list(request):
    """List all projects for the current user"""
    projects = Project.objects.filter(user=request.user).order_by('-created_at')
    return render(request, 'projects/project_list.html', {'projects': projects})


@login_required
def project_detail(request, pk):
    """Display project details"""
    project = get_object_or_404(Project, pk=pk, user=request.user)
    return render(request, 'projects/project_detail.html', {'project': project})


@login_required
def project_create(request):
    """Create a new project"""
    if request.method == 'POST':
        form = ProjectForm(request.POST)
        if form.is_valid():
            project = form.save(commit=False)
            project.user = request.user
            project.save()
            messages.success(request, 'پروژه با موفقیت ایجاد شد!')
            return redirect('projects:project_detail', pk=project.pk)
    else:
        form = ProjectForm()
    return render(request, 'projects/project_form.html', {'form': form, 'title': 'ایجاد پروژه جدید'})


@login_required
def project_edit(request, pk):
    """Edit an existing project"""
    project = get_object_or_404(Project, pk=pk, user=request.user)
    if request.method == 'POST':
        form = ProjectForm(request.POST, instance=project)
        if form.is_valid():
            form.save()
            messages.success(request, 'پروژه با موفقیت ویرایش شد!')
            return redirect('projects:project_detail', pk=project.pk)
    else:
        form = ProjectForm(instance=project)
    return render(request, 'projects/project_form.html', {'form': form, 'title': 'ویرایش پروژه'})


@login_required
def project_delete(request, pk):
    """Delete a project"""
    project = get_object_or_404(Project, pk=pk, user=request.user)
    if request.method == 'POST':
        project.delete()
        messages.success(request, 'پروژه با موفقیت حذف شد!')
        return redirect('projects:project_list')
    return render(request, 'projects/project_confirm_delete.html', {'project': project})
