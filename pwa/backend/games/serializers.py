from rest_framework import serializers
from .models import Game
from django.core.validators import MinValueValidator, MaxValueValidator

class GameSerializer(serializers.ModelSerializer):
    estado_display = serializers.CharField(source='get_estado_display', read_only=True)
    genero_display = serializers.CharField(source='get_genero_display', read_only=True)
    estado_color = serializers.CharField(source='get_estado_display_color', read_only=True)
    calificacion_estrellas = serializers.IntegerField(source='get_calificacion_estrellas', read_only=True)
    imagen_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Game
        fields = [
            'id', 'nombre', 'descripcion', 'plataforma', 'estado', 'estado_display',
            'genero', 'genero_display', 'imagen', 'imagen_url', 'fecha_lanzamiento',
            'horas_jugadas', 'calificacion', 'calificacion_estrellas',
            'fecha_creacion', 'fecha_actualizacion', 'estado_color'
        ]
        read_only_fields = ['id', 'fecha_creacion', 'fecha_actualizacion']
    
    def get_imagen_url(self, obj):
        """Retorna la URL completa de la imagen si existe"""
        if obj.imagen and hasattr(obj.imagen, 'url'):
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.imagen.url)
            return obj.imagen.url
        return None
    
    def validate_nombre(self, value):
        """Validación personalizada para el nombre del juego"""
        if len(value.strip()) < 2:
            raise serializers.ValidationError("El nombre del juego debe tener al menos 2 caracteres.")
        return value.strip()
    
    def validate_plataforma(self, value):
        """Validación para la plataforma"""
        if len(value.strip()) < 2:
            raise serializers.ValidationError("La plataforma debe tener al menos 2 caracteres.")
        return value.strip()
    
    def validate_horas_jugadas(self, value):
        """Validación para las horas jugadas"""
        if value > 9999:
            raise serializers.ValidationError("Las horas jugadas no pueden exceder 9999.")
        return value
    
    def validate(self, data):
        """Validación a nivel de objeto"""
        # Si el estado es 'completado', las horas jugadas deben ser mayor a 0
        if data.get('estado') == 'completado' and data.get('horas_jugadas', 0) == 0:
            raise serializers.ValidationError(
                "Un juego completado debe tener al menos 1 hora jugada."
            )
        
        # Si hay calificación, debe estar entre 1 y 10
        if 'calificacion' in data and data['calificacion'] is not None:
            if not 1 <= data['calificacion'] <= 10:
                raise serializers.ValidationError("La calificación debe estar entre 1 y 10.")
        
        return data

class GameListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listar juegos"""
    estado_display = serializers.CharField(source='get_estado_display', read_only=True)
    genero_display = serializers.CharField(source='get_genero_display', read_only=True)
    estado_color = serializers.CharField(source='get_estado_display_color', read_only=True)
    imagen_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Game
        fields = [
            'id', 'nombre', 'plataforma', 'estado', 'estado_display',
            'genero', 'genero_display', 'imagen_url', 'calificacion',
            'fecha_creacion', 'estado_color'
        ]
    
    def get_imagen_url(self, obj):
        """Retorna la URL completa de la imagen si existe"""
        if obj.imagen and hasattr(obj.imagen, 'url'):
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.imagen.url)
            return obj.imagen.url
        return None
