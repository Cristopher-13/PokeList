from django.contrib import admin
from .models import Game

@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = [
        'nombre', 'plataforma', 'estado', 'genero', 'calificacion', 
        'horas_jugadas', 'fecha_creacion'
    ]
    list_filter = [
        'estado', 'genero', 'plataforma', 'fecha_creacion', 'fecha_lanzamiento'
    ]
    search_fields = ['nombre', 'descripcion', 'plataforma']
    list_editable = ['estado', 'calificacion', 'horas_jugadas']
    readonly_fields = ['fecha_creacion', 'fecha_actualizacion']
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('nombre', 'descripcion', 'genero', 'plataforma')
        }),
        ('Estado del Juego', {
            'fields': ('estado', 'horas_jugadas', 'calificacion')
        }),
        ('Multimedia', {
            'fields': ('imagen', 'fecha_lanzamiento'),
            'classes': ('collapse',)
        }),
        ('Metadatos', {
            'fields': ('fecha_creacion', 'fecha_actualizacion'),
            'classes': ('collapse',)
        }),
    )
    
    list_per_page = 20
    date_hierarchy = 'fecha_creacion'
    
    def get_queryset(self, request):
        """Optimizar consultas con select_related y prefetch_related"""
        return super().get_queryset(request).select_related()
    
    def get_list_display(self, request):
        """Personalizar campos mostrados según el usuario"""
        if request.user.is_superuser:
            return self.list_display
        return ['nombre', 'plataforma', 'estado', 'genero', 'calificacion']
    
    def save_model(self, request, obj, form, change):
        """Validaciones adicionales al guardar"""
        if obj.estado == 'completado' and obj.horas_jugadas == 0:
            obj.horas_jugadas = 1  # Mínimo 1 hora para juegos completados
        
        if obj.calificacion and not (1 <= obj.calificacion <= 10):
            obj.calificacion = None  # Resetear calificación inválida
        
        super().save_model(request, obj, form, change)
    
    actions = ['marcar_como_completado', 'marcar_como_jugando', 'resetear_calificacion']
    
    def marcar_como_completado(self, request, queryset):
        """Acción para marcar juegos como completados"""
        updated = queryset.update(estado='completado')
        self.message_user(
            request, 
            f'{updated} juego(s) marcado(s) como completado(s)'
        )
    marcar_como_completado.short_description = "Marcar como completado"
    
    def marcar_como_jugando(self, request, queryset):
        """Acción para marcar juegos como en progreso"""
        updated = queryset.update(estado='jugando')
        self.message_user(
            request, 
            f'{updated} juego(s) marcado(s) como jugando'
        )
    marcar_como_jugando.short_description = "Marcar como jugando"
    
    def resetear_calificacion(self, request, queryset):
        """Acción para resetear calificaciones"""
        updated = queryset.update(calificacion=None)
        self.message_user(
            request, 
            f'{updated} calificación(es) reseteada(s)'
        )
    resetear_calificacion.short_description = "Resetear calificaciones"
