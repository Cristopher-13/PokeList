import axios from 'axios';
import { Game, GameFormData, GameFilters, GameStats } from '../types/Game';

const API_URL = 'http://localhost:8000/api/games/';

// Configuración de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    throw error;
  }
);

// Funciones básicas CRUD
export const getGames = (filters?: GameFilters) => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });
  }
  return api.get<Game[]>(`?${params.toString()}`);
};

export const getGame = (id: number) => api.get<Game>(`${id}/`);

export const createGame = (data: FormData) => {
  return api.post<Game>('', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateGame = (id: number, data: FormData) => {
  return api.put<Game>(`${id}/`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteGame = (id: number) => api.delete(`${id}/`);

// Funciones adicionales
export const getGameStats = () => api.get<GameStats>('estadisticas/');
export const getPlatforms = () => api.get<string[]>('plataformas/');
export const getGenres = () => api.get<string[]>('generos/');

// Función helper para crear FormData
export const createGameFormData = (gameData: GameFormData): FormData => {
  const formData = new FormData();
  
  formData.append('nombre', gameData.nombre);
  formData.append('descripcion', gameData.descripcion || '');
  formData.append('plataforma', gameData.plataforma);
  formData.append('estado', gameData.estado);
  formData.append('genero', gameData.genero);
  formData.append('horas_jugadas', gameData.horas_jugadas.toString());
  
  if (gameData.fecha_lanzamiento) {
    formData.append('fecha_lanzamiento', gameData.fecha_lanzamiento);
  }
  
  if (gameData.calificacion) {
    formData.append('calificacion', gameData.calificacion.toString());
  }
  
  if (gameData.imagen) {
    formData.append('imagen', gameData.imagen);
  }
  
  return formData;
};
