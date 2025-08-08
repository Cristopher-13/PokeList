import axios from 'axios';

const API_URL = 'http://localhost:8000/api/games/';

export const getGames = () => axios.get(API_URL);
export const getGame = (id: number) => axios.get(`${API_URL}${id}/`);
export const createGame = (data: any) => axios.post(API_URL, data);
export const updateGame = (id: number, data: any) => axios.put(`${API_URL}${id}/`, data);
export const deleteGame = (id: number) => axios.delete(`${API_URL}${id}/`);
