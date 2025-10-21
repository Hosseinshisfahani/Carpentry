from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.urls import reverse
from .models import Project
from .serializers import ProjectSerializer
from .forms import ProjectForm


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
