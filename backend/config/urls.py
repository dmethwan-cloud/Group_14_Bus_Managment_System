"""
Smart Bus E-Ticketing System — Root URL Configuration
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # Authentication endpoints
    path('api/auth/', include('apps.users.urls')),

    # Placeholder module endpoints (teammates will implement)
    path('api/buses/', include('apps.buses.urls')),
    path('api/routes/', include('apps.routes.urls')),
    path('api/bookings/', include('apps.bookings.urls')),
    path('api/tickets/', include('apps.tickets.urls')),
    path('api/payments/', include('apps.payments.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
