# Django to React Migration - Project Management System

This project has been migrated from Django templates to a modern React frontend with Django REST Framework backend.

## Project Structure

```
├── carpentary/                 # Django backend
├── apps/                      # Django apps (projects, registration)
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── contexts/         # React contexts
│   │   └── config/           # Configuration
└── dependencies/              # Python dependencies
```

## Setup Instructions

### Backend Setup (Django)

1. **Install Python dependencies:**
   ```bash
   cd dependencies
   pip install -r requirements.txt
   ```

2. **Run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

3. **Create superuser:**
   ```bash
   python manage.py createsuperuser
   ```

4. **Start Django server:**
   ```bash
   python manage.py runserver
   ```
   The API will be available at `http://localhost:8000/api/`

### Frontend Setup (React)

1. **Install Node.js dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start React development server:**
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/profile/` - Get user profile

### Projects
- `GET /api/projects/` - List all projects
- `POST /api/projects/` - Create new project
- `GET /api/projects/{id}/` - Get project details
- `PUT /api/projects/{id}/` - Update project
- `DELETE /api/projects/{id}/` - Delete project

## Features

### Frontend (React + Material-UI)
- ✅ RTL (Right-to-Left) support for Persian UI
- ✅ Responsive design with Material-UI components
- ✅ Authentication (Login/Register)
- ✅ Project CRUD operations
- ✅ File upload for project images
- ✅ JSON data handling for project tables
- ✅ Protected routes
- ✅ Error handling and loading states

### Backend (Django REST Framework)
- ✅ RESTful API endpoints
- ✅ User authentication and authorization
- ✅ File upload support
- ✅ CORS configuration for frontend
- ✅ JSON serialization
- ✅ Pagination support

## Technology Stack

### Backend
- Django 4.2.25
- Django REST Framework 3.14.0
- SQLite database
- Pillow for image handling

### Frontend
- React 18
- Vite (build tool)
- Material-UI (MUI) for components
- React Router for navigation
- Axios for API calls
- Emotion for styling

## Development

### Running Both Servers

1. **Terminal 1 - Django Backend:**
   ```bash
   cd dependencies
   python manage.py runserver
   ```

2. **Terminal 2 - React Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

### Environment Variables

Create a `.env.local` file in the frontend directory:
```
VITE_API_URL=http://localhost:8000
```

## Migration Notes

The original Django templates have been converted to React components:

- `login.html` → `LoginPage.jsx`
- `register.html` → `RegisterPage.jsx`
- `project_list.html` → `ProjectListPage.jsx`
- `project_detail.html` → `ProjectDetailPage.jsx`
- `project_form.html` → `ProjectFormPage.jsx`
- `project_confirm_delete.html` → Delete functionality in `ProjectDetailPage.jsx`

All styling has been converted from custom CSS to Material-UI components with RTL support.
