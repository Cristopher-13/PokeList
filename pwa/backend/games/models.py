from django.db import models

class Game(models.Model):
    ESTADO_CHOICES = [
        ('sin iniciar', 'Sin Iniciar'),
        ('jugando', 'Jugando'),
        ('completado', 'Completado'),
    ]

    nombre = models.CharField(max_length=100)
    plataforma = models.CharField(max_length=50)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='sin iniciar')

    def __str__(self):
        return self.nombre