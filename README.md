a fully functional ecommerce platform. 
you can customize your website based on this template

## Tech Stack

### Backend (Django REST Framework)
- Django REST Framework (DRF): For building high-performance RESTful APIs.
- JWT Authentication: Secure user login system using djangorestframework-simplejwt.
- Permissions Control: Custom permission classes to ensure users can only access their own data.
- SQLite: Lightweight database for development.

### Frontend (React.js)
- Vite: Modern build tool for a faster development experience.
- React Router Dom: Handling Single Page Application (SPA) navigation.
- Axios: Managing asynchronous API requests and interceptors.
- Hooks & State: Utilizing useState, useEffect, and useLocation for state and lifecycle management.
- Flexbox: Custom CSS layout for responsive design.

## Core Features

1. Product System
   - Dynamic product listing fetched from the backend database.
   - Detailed product view pages.

2. Shopping Cart
   - LocalStorage-based cart management.
   - Add/Remove items and adjust quantities.

3. Authentication System
   - User registration and login.
   - Dynamic navigation bar that updates based on login status.
   - JWT token management for secure API access.

4. Order Management
   - Checkout process linked to the database.
   - User Profile section to view personal order history.

5. Security & UI Experience
   - Distraction-free mode: Automatically hides the navigation bar on Login and Checkout pages.
   - Backend API permission checks (IsAuthenticated).

## Installation and Setup

 1. Backend Setup
Navigate to the backend directory and activate the virtual environment:

```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
