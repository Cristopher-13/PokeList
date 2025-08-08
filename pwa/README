# Pokémon Games Tracker

Este proyecto es una aplicación CRUD que permite registrar, visualizar, editar y eliminar videojuegos de Pokémon. Está compuesto por un backend hecho en Django REST Framework y un frontend desarrollado con Ionic React + Vite.

## Requisitos previos

- Docker y Docker Compose instalados en tu sistema.
- Node.js y npm
- Python 3.11+ y pip 

## Estructura del proyecto

```
pwa/
├── app/             # Frontend (Ionic React + Vite)
├── backend/         # Backend (Django REST Framework)
├── docker-compose.yaml
```

---

## Levantar el proyecto 

### 1. Backend (Django REST)

Desde la raíz del proyecto:

```bash
docker compose up backend
```

Esto levantará el backend en:

```
http://localhost:8000/api/
```

La API principal está en:

```
http://localhost:8000/api/games/
```

### 2. Frontend (Ionic React)

Desde otra terminal, entra a la carpeta del frontend:

```bash
cd app
rm -rf node_modules package-lock.json
npm install
npm run dev
```

Esto iniciará la aplicación en:

```
http://localhost:5173/
```

El frontend consume la API del backend desde `http://localhost:8000/api/games/`. Asegúrate de que ambas partes estén funcionando simultáneamente.

---

## Opción 2: Levantar el backend y frontend sin Docker (modo local)

### 1. Backend (Django REST)

Desde la carpeta `backend/`:

```bash
python -m venv venv
source venv/bin/activate    # En Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Esto levantará el backend en:

```
http://localhost:8000/api/
```

### 2. Frontend (Ionic React)

Desde la carpeta `app/`:

```bash
npm install
npm run dev
```

---

## Endpoints de la API

| Método | Endpoint                  | Descripción                |
|--------|---------------------------|----------------------------|
| GET    | /api/games/               | Obtener todos los juegos  |
| POST   | /api/games/               | Crear nuevo juego         |
| GET    | /api/games/{id}/          | Obtener juego por ID      |
| PUT    | /api/games/{id}/          | Actualizar juego por ID   |
| DELETE | /api/games/{id}/          | Eliminar juego por ID     |

---

## Notas importantes

- Asegúrate de que el backend esté ejecutándose antes de iniciar el frontend.
- En el archivo `api.ts` del frontend, la constante `API_URL` debe ser:

```ts
const API_URL = 'http://localhost:8000/api/games/';
```

- Si tienes algún problema con dependencias en el frontend, elimina `node_modules` y `package-lock.json`, luego ejecuta `npm install`.

---
