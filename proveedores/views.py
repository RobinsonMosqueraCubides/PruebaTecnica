from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view
from rest_framework.permissions import IsAdminUser
from .models import Proveedor
from .serializers import ProveedorSerializer
import requests

class ProveedorViewSet(viewsets.ModelViewSet):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer

    @action(detail=True, methods=['put'], permission_classes=[IsAdminUser])
    def validar(self, request, pk=None):
        proveedor = self.get_object()
        estado = request.data.get('estado', 'Pendiente')
        if estado in ['Aprobado', 'Rechazado']:
            proveedor.estado = estado
            proveedor.save()
            return Response({'status': 'Proveedor validado'})
        return Response({'error': 'Estado inválido'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def obtener_token_jwt(request):
    url = 'https://analyticsdev.app.marval.com.co/api/jwtjde/loginjwt'
    payload = {
        'Login': 'prueba',
        'Pswd': '4d89b2a6498c0f4170ef9aa1de125a27.1dd564de6063cf1e0ec171ad7d030595730b0704a17fae8b066e44f67633ea876e8dfda41176672341b4f42aa044e4a2'
    }

    try:
        response = requests.post(url, data=payload)
        response.raise_for_status()  # Esto lanzará un error para códigos de estado 4xx/5xx
        token = response.json().get('token')
        if token:
            return Response({'token': token})
        else:
            return Response({'error': 'No se recibió token'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except requests.exceptions.RequestException as e:
        return Response({'error': 'No se pudo obtener el token', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def obtener_proyectos_externos(request):
    token = request.headers.get('Authorization')
    if not token:
        return Response({'error': 'Token faltante'}, status=status.HTTP_400_BAD_REQUEST)

    url = 'https://analyticsdev.app.marval.com.co/api/jwtjde/getAllProyectos'
    headers = {'Authorization': f'Bearer {token}'}

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Esto lanzará un error para códigos de estado 4xx/5xx
        return Response(response.json())
    except requests.exceptions.RequestException as e:
        return Response({'error': 'No autorizado o error en la API externa', 'details': str(e)}, status=response.status_code)
