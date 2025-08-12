from django.shortcuts import render
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from django.db import models
from .models import Game
from .serializers import GameSerializer, GameListSerializer

class GamePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    pagination_class = GamePagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['estado', 'genero', 'plataforma']
    search_fields = ['nombre', 'descripcion', 'plataforma']
    ordering_fields = ['nombre', 'fecha_creacion', 'calificacion', 'horas_jugadas']
    ordering = ['-fecha_creacion']

    def get_serializer_class(self):
        """Usa serializer diferente para listar vs detalle"""
        if self.action == 'list':
            return GameListSerializer
        return GameSerializer

    def get_queryset(self):
        """Filtros adicionales personalizados"""
        queryset = Game.objects.all()
        
        # Filtro por estado
        estado = self.request.query_params.get('estado', None)
        if estado:
            queryset = queryset.filter(estado=estado)
        
        # Filtro por género
        genero = self.request.query_params.get('genero', None)
        if genero:
            queryset = queryset.filter(genero=genero)
        
        # Filtro por plataforma
        plataforma = self.request.query_params.get('plataforma', None)
        if plataforma:
            queryset = queryset.filter(plataforma__icontains=plataforma)
        
        # Filtro por calificación mínima
        calificacion_min = self.request.query_params.get('calificacion_min', None)
        if calificacion_min:
            try:
                queryset = queryset.filter(calificacion__gte=int(calificacion_min))
            except ValueError:
                pass
        
        # Filtro por horas jugadas mínimas
        horas_min = self.request.query_params.get('horas_min', None)
        if horas_min:
            try:
                queryset = queryset.filter(horas_jugadas__gte=int(horas_min))
            except ValueError:
                pass
        
        return queryset

    def create(self, request, *args, **kwargs):
        """Crear un nuevo juego con validación mejorada"""
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(
                {
                    'message': 'Juego creado exitosamente',
                    'data': serializer.data
                },
                status=status.HTTP_201_CREATED,
                headers=headers
            )
        except Exception as e:
            return Response(
                {
                    'error': 'Error al crear el juego',
                    'detail': str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )

    def update(self, request, *args, **kwargs):
        """Actualizar un juego con validación mejorada"""
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(
                {
                    'message': 'Juego actualizado exitosamente',
                    'data': serializer.data
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {
                    'error': 'Error al actualizar el juego',
                    'detail': str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )

    def destroy(self, request, *args, **kwargs):
        """Eliminar un juego con confirmación"""
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response(
                {
                    'message': 'Juego eliminado exitosamente'
                },
                status=status.HTTP_204_NO_CONTENT
            )
        except Exception as e:
            return Response(
                {
                    'error': 'Error al eliminar el juego',
                    'detail': str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """Endpoint para obtener estadísticas generales"""
        total_juegos = Game.objects.count()
        juegos_completados = Game.objects.filter(estado='completado').count()
        juegos_jugando = Game.objects.filter(estado='jugando').count()
        juegos_sin_iniciar = Game.objects.filter(estado='sin iniciar').count()
        juegos_abandonados = Game.objects.filter(estado='abandonado').count()
        
        # Calcular horas totales jugadas
        total_horas = Game.objects.aggregate(
            total=models.Sum('horas_jugadas')
        )['total'] or 0
        
        # Calcular calificación promedio
        calificacion_promedio = Game.objects.filter(
            calificacion__isnull=False
        ).aggregate(
            promedio=models.Avg('calificacion')
        )['promedio'] or 0
        
        return Response({
            'total_juegos': total_juegos,
            'juegos_completados': juegos_completados,
            'juegos_jugando': juegos_jugando,
            'juegos_sin_iniciar': juegos_sin_iniciar,
            'juegos_abandonados': juegos_abandonados,
            'total_horas_jugadas': total_horas,
            'calificacion_promedio': round(calificacion_promedio, 1)
        })

    @action(detail=False, methods=['get'])
    def plataformas(self, request):
        """Endpoint para obtener lista de plataformas únicas"""
        plataformas = Game.objects.values_list('plataforma', flat=True).distinct()
        return Response(list(plataformas))

    @action(detail=False, methods=['get'])
    def generos(self, request):
        """Endpoint para obtener lista de géneros únicos"""
        generos = Game.objects.values_list('genero', flat=True).distinct()
        return Response(list(generos))

