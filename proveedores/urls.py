from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProveedorViewSet, obtener_token_jwt, obtener_proyectos_externos

router = DefaultRouter()  
router.register(r'proveedores', ProveedorViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('obtener_token_jwt/', obtener_token_jwt, name='obtener_token_jwt'),
    path('obtener_proyectos_externos/', obtener_proyectos_externos, name='obtener_proyectos_externos'),
]
