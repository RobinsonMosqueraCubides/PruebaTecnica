from django.db import models
from django.db import models

class Proveedor(models.Model):
    NIT = models.CharField(max_length=15, unique=True)
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    cedula = models.CharField(max_length=20, unique=True)
    tipo_proveedor = models.CharField(max_length=50, choices=[('Nacional', 'Nacional'), ('Internacional', 'Internacional')])
    tipo_persona = models.CharField(max_length=50, choices=[('Natural', 'Natural'), ('Jurídica', 'Jurídica')])
    beneficiarios = models.JSONField()  # Lista de nombres y cédulas
    datos_bancarios = models.JSONField()  # Diccionario con banco, número de cuenta y tipo de cuenta
    estado = models.CharField(max_length=50, default='Pendiente de Validación')  # Estado: Pendiente, Aprobado, Rechazado

    def __str__(self):
        return f'{self.nombre} {self.apellido} - {self.NIT}'
