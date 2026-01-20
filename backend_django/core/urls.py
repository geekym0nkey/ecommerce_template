# core/urls.py
from django.contrib import admin
from django.urls import path, include
#from rest_framework.routers import DefaultRouter #this is in products/urls now
from products.views import ProductViewSet

# --- Import configuration files ---
from django.conf import settings 
from django.conf.urls.static import static 
# --------------------
 

urlpatterns = [
    # Admin interface URL
    path('admin/', admin.site.urls),
    path('api/', include('products.urls')),

]

# === Media File Configuration (Development Environment ONLY) ===
if settings.DEBUG:
    # Allows the development server to serve files from the /media/ directory
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
# ================================================================
