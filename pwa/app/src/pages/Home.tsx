import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/games/');
      if (response.ok) {
        const data = await response.json();
        setGames(data.results || data);
        setError(null);
      } else {
        setError('Error al cargar los juegos');
      }
    } catch (err) {
      console.error('Error loading games:', err);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '24px', color: 'blue' }}>Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '24px', color: 'red' }}>{error}</div>
        <button 
          onClick={() => window.location.reload()}
          style={{ marginTop: '10px', padding: '10px', backgroundColor: 'orange', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ color: '#007bff', fontSize: '2.5rem' }}>Mi Colección de Juegos</h1>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>Gestiona tu biblioteca personal de videojuegos</p>
        <button 
          onClick={() => navigate('/add')}
          style={{ 
            backgroundColor: '#28a745', 
            color: 'white', 
            padding: '12px 24px', 
            border: 'none', 
            borderRadius: '8px', 
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Agregar Juego
        </button>
      </div>

      {games.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div style={{ fontSize: '4rem', color: '#ccc' }}>🎮</div>
          <h3 style={{ color: '#666' }}>No hay juegos en tu colección</h3>
          <p style={{ color: '#999' }}>Comienza agregando tu primer juego</p>
          <button 
            onClick={() => navigate('/add')}
            style={{ 
              backgroundColor: '#007bff', 
              color: 'white', 
              padding: '12px 24px', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Agregar Primer Juego
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {games.map((game: any) => (
            <div key={game.id} style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              <div style={{ 
                height: '200px', 
                backgroundColor: '#f8f9fa',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {game.imagen_url ? (
                  <img 
                    src={game.imagen_url} 
                    alt={game.nombre}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center'
                    }}
                  />
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: '#ccc',
                    fontSize: '3rem'
                  }}>
                    🎮
                  </div>
                )}
                
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: game.estado === 'completado' ? '#28a745' : 
                               game.estado === 'jugando' ? '#007bff' : 
                               game.estado === 'abandonado' ? '#dc3545' : '#6c757d',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  textTransform: 'capitalize'
                }}>
                  {game.estado}
                </div>
              </div>

              <div style={{ padding: '20px' }}>
                <h3 style={{ marginTop: 0, color: '#333', fontSize: '1.3rem', marginBottom: '10px' }}>
                  {game.nombre}
                </h3>
                
                {game.genero && (
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{
                      backgroundColor: '#17a2b8',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      textTransform: 'uppercase'
                    }}>
                      {game.genero}
                    </span>
                  </div>
                )}

                <p style={{ margin: '8px 0', fontSize: '14px' }}>
                  <strong>Plataforma:</strong> {game.plataforma}
                </p>

                {game.descripcion && (
                  <p style={{ 
                    margin: '8px 0', 
                    fontSize: '13px', 
                    color: '#666',
                    lineHeight: '1.4',
                    maxHeight: '60px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {game.descripcion}
                  </p>
                )}

                {game.horas_jugadas > 0 && (
                  <p style={{ margin: '8px 0', fontSize: '14px' }}>
                    <strong>Horas:</strong> {game.horas_jugadas}h
                  </p>
                )}

                {game.calificacion && (
                  <div style={{ margin: '8px 0' }}>
                    <strong>Calificación:</strong> 
                    <span style={{ marginLeft: '5px', color: '#ffc107', fontWeight: 'bold' }}>
                      {game.calificacion}/10
                    </span>
                  </div>
                )}

                {game.fecha_lanzamiento && (
                  <p style={{ margin: '8px 0', fontSize: '13px', color: '#666' }}>
                    <strong>Lanzamiento:</strong> {new Date(game.fecha_lanzamiento).toLocaleDateString('es-ES')}
                  </p>
                )}
                
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => navigate(`/edit/${game.id}`)}
                    style={{ 
                      backgroundColor: '#007bff', 
                      color: 'white', 
                      padding: '8px 16px', 
                      border: 'none', 
                      borderRadius: '4px',
                      cursor: 'pointer',
                      flex: 1,
                      fontSize: '14px'
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar "${game.nombre}"?`)) {
                        fetch(`http://localhost:8000/api/games/${game.id}/`, { method: 'DELETE' })
                          .then(() => {
                            alert('Juego eliminado');
                            loadGames();
                          })
                          .catch(() => alert('Error al eliminar'));
                      }
                    }}
                    style={{ 
                      backgroundColor: '#dc3545', 
                      color: 'white', 
                      padding: '8px 16px', 
                      border: 'none', 
                      borderRadius: '4px',
                      cursor: 'pointer',
                      flex: 1,
                      fontSize: '14px'
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
