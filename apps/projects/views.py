from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.urls import reverse
from django.db.models import Count, Q, Exists, OuterRef
from .models import Project, BinPackingReport
from .serializers import ProjectSerializer, BinPackingInputSerializer, BinPackingOutputSerializer, BinPackingReportSerializer
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
    
    @action(detail=True, methods=['post'])
    def save_report(self, request, pk=None):
        """Save a bin packing report for a project"""
        project = self.get_object()
        
        # Ensure user owns the project
        if project.user != request.user:
            return Response(
                {'error': 'You do not have permission to save reports for this project'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get report data from request
        report_data = {
            'project': project.id,
            'name': request.data.get('name', f'گزارش {BinPackingReport.objects.filter(project=project).count() + 1}'),
            'container_width': request.data.get('container_width'),
            'container_height': request.data.get('container_height'),
            'rectangles': request.data.get('rectangles', []),
            'packed_rectangles': request.data.get('packed_rectangles', []),
            'visualization': request.data.get('visualization', {}),
            'density': request.data.get('density', 0),
            'success': request.data.get('success', False),
            'message': request.data.get('message', ''),
        }
        
        serializer = BinPackingReportSerializer(data=report_data, context={'request': request})
        if serializer.is_valid():
            report = serializer.save()
            return Response(BinPackingReportSerializer(report, context={'request': request}).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def reports(self, request, pk=None):
        """Get all bin packing reports for a project"""
        project = self.get_object()
        
        # Ensure user owns the project
        if project.user != request.user:
            return Response(
                {'error': 'You do not have permission to view reports for this project'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        reports = BinPackingReport.objects.filter(project=project).order_by('-created_at')
        serializer = BinPackingReportSerializer(reports, many=True, context={'request': request})
        return Response(serializer.data)


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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_statistics(request):
    """Get dashboard statistics for the current user"""
    user = request.user
    
    # Get all projects for the user
    all_projects = Project.objects.filter(user=user)
    total_projects = all_projects.count()
    
    # Projects with at least one successful report are considered "completed"
    completed_projects = all_projects.filter(
        bin_packing_reports__success=True
    ).distinct().count()
    
    # Projects without any successful reports are considered "pending"
    # This includes projects with no reports or only failed reports
    projects_with_success = all_projects.filter(
        bin_packing_reports__success=True
    ).values_list('id', flat=True)
    pending_projects = all_projects.exclude(id__in=projects_with_success).count()
    
    return Response({
        'active_projects': total_projects,
        'completed': completed_projects,
        'pending': pending_projects,
    }, status=status.HTTP_200_OK)
