from rest_framework import serializers
from .models import Proveedor


class ProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedor
        fields = ['id', 'NIT', 'nombre', 'apellido', 'cedula', 'tipo_proveedor', 'tipo_persona', 'beneficiarios', 'datos_bancarios', 'estado']
