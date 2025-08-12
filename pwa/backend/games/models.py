from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone

class Game(models.Model):
    ESTADO_CHOICES = [
        ('sin iniciar', 'Sin Iniciar'),
        ('jugando', 'Jugando'),
        ('completado', 'Completado'),
        ('abandonado', 'Abandonado'),
    ]
    
    GENERO_CHOICES = [
        ('rpg', 'RPG'),
        ('accion', 'Acción'),
        ('aventura', 'Aventura'),
        ('estrategia', 'Estrategia'),
        ('deportes', 'Deportes'),
        ('otros', 'Otros'),
    ]

    nombre = models.CharField(max_length=100, verbose_name="Nombre del Juego")
    descripcion = models.TextField(blank=True, null=True, verbose_name="Descripción")
    plataforma = models.CharField(max_length=50, verbose_name="Plataforma")
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='sin iniciar', verbose_name="Estado")
    genero = models.CharField(max_length=20, choices=GENERO_CHOICES, default='rpg', verbose_name="Género")
    imagen = models.ImageField(upload_to='games/', blank=True, null=True, verbose_name="Imagen del Juego")
    fecha_lanzamiento = models.DateField(blank=True, null=True, verbose_name="Fecha de Lanzamiento")
    horas_jugadas = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0)], verbose_name="Horas Jugadas")
    calificacion = models.PositiveIntegerField(
        choices=[(i, i) for i in range(1, 11)], 
        blank=True, 
        null=True,
        validators=[MinValueValidator(1), MaxValueValidator(10)],
        verbose_name="Calificación (1-10)"
    )
    fecha_creacion = models.DateTimeField(default=timezone.now, verbose_name="Fecha de Creación")
    fecha_actualizacion = models.DateTimeField(auto_now=True, verbose_name="Última Actualización")

    class Meta:
        verbose_name = "Juego"
        verbose_name_plural = "Juegos"
        ordering = ['-fecha_creacion']

    def __str__(self):
        return self.nombre
    
    def get_estado_display_color(self):
        """Retorna el color CSS para el estado del juego"""
        colors = {
            'sin iniciar': 'secondary',
            'jugando': 'primary',
            'completado': 'success',
            'abandonado': 'danger'
        }
        return colors.get(self.estado, 'secondary')
    
    def get_calificacion_estrellas(self):
        """Retorna la calificación en estrellas para mostrar en el frontend"""
        if not self.calificacion:
            return 0
        return self.calificacion