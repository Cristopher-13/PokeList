export interface Game {
  id: number;
  nombre: string;
  descripcion?: string;
  plataforma: string;
  estado: 'sin iniciar' | 'jugando' | 'completado' | 'abandonado';
  genero: 'rpg' | 'accion' | 'aventura' | 'estrategia' | 'deportes' | 'otros';
  imagen?: string;
  imagen_url?: string;
  fecha_lanzamiento?: string;
  horas_jugadas: number;
  calificacion?: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
  estado_display?: string;
  genero_display?: string;
  estado_color?: string;
  calificacion_estrellas?: number;
}

export interface GameFormData {
  nombre: string;
  descripcion: string;
  plataforma: string;
  estado: Game['estado'];
  genero: Game['genero'];
  imagen?: File;
  fecha_lanzamiento: string;
  horas_jugadas: number;
  calificacion?: number;
}

export interface GameFilters {
  estado?: string;
  genero?: string;
  plataforma?: string;
  calificacion_min?: number;
  horas_min?: number;
  search?: string;
}

export interface GameStats {
  total_juegos: number;
  juegos_completados: number;
  juegos_jugando: number;
  juegos_sin_iniciar: number;
  juegos_abandonados: number;
  total_horas_jugadas: number;
  calificacion_promedio: number;
}

