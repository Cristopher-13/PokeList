import React from 'react';
import { Card, Badge, Button, Row, Col } from 'react-bootstrap';
import { Game } from '../types/Game';

interface GameCardProps {
  game: Game;
  onEdit: () => void;
  onDelete: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onEdit, onDelete }) => {
  const renderStars = (rating: number) => {
    return (
      <div className="d-flex align-items-center gap-1">
        {[...Array(10)].map((_, i) => (
          <i
            key={i}
            className={`bi ${i < rating ? 'bi-star-fill text-warning' : 'bi-star text-muted'}`}
            style={{ fontSize: '0.8rem' }}
          />
        ))}
        <span className="ms-1 text-muted small">({rating}/10)</span>
      </div>
    );
  };

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'sin iniciar': return 'secondary';
      case 'jugando': return 'primary';
      case 'completado': return 'success';
      case 'abandonado': return 'danger';
      default: return 'secondary';
    }
  };

  const getGeneroBadgeVariant = (genero: string) => {
    switch (genero) {
      case 'rpg': return 'info';
      case 'accion': return 'warning';
      case 'aventura': return 'success';
      case 'estrategia': return 'primary';
      case 'deportes': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <Card className="h-100 shadow-sm border-0">
      {/* Imagen del juego */}
      <div className="position-relative">
        {game.imagen_url ? (
          <Card.Img
            variant="top"
            src={game.imagen_url}
            alt={game.nombre}
            style={{ height: '200px', objectFit: 'cover' }}
          />
        ) : (
          <div
            className="bg-light d-flex align-items-center justify-content-center"
            style={{ height: '200px' }}
          >
            <i className="bi bi-controller text-muted" style={{ fontSize: '3rem' }} />
          </div>
        )}
        
        {/* Badge de estado en la esquina superior derecha */}
        <Badge
          bg={getEstadoBadgeVariant(game.estado)}
          className="position-absolute top-0 end-0 m-2"
        >
          {game.estado_display || game.estado}
        </Badge>
      </div>

      <Card.Body className="d-flex flex-column">
        {/* Título y género */}
        <div className="mb-2">
          <Card.Title className="h6 mb-1 text-truncate" title={game.nombre}>
            {game.nombre}
          </Card.Title>
          <Badge bg={getGeneroBadgeVariant(game.genero)} className="small">
            {game.genero_display || game.genero}
          </Badge>
        </div>

        {/* Plataforma */}
        <div className="mb-2">
          <small className="text-muted">
            <i className="bi bi-cpu me-1"></i>
            {game.plataforma}
          </small>
        </div>

        {/* Descripción */}
        {game.descripcion && (
          <Card.Text className="small text-muted mb-2" style={{ fontSize: '0.8rem' }}>
            {game.descripcion.length > 80 
              ? `${game.descripcion.substring(0, 80)}...` 
              : game.descripcion
            }
          </Card.Text>
        )}

        {/* Horas jugadas */}
        <div className="mb-2">
          <small className="text-muted">
            <i className="bi bi-clock me-1"></i>
            {game.horas_jugadas} hora{game.horas_jugadas !== 1 ? 's' : ''} jugada{game.horas_jugadas !== 1 ? 's' : ''}
          </small>
        </div>

        {/* Calificación */}
        {game.calificacion && (
          <div className="mb-3">
            {renderStars(game.calificacion)}
          </div>
        )}

        {/* Fecha de lanzamiento */}
        {game.fecha_lanzamiento && (
          <div className="mb-3">
            <small className="text-muted">
              <i className="bi bi-calendar me-1"></i>
              {new Date(game.fecha_lanzamiento).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </small>
          </div>
        )}

        {/* Fecha de creación */}
        <div className="mb-3">
          <small className="text-muted">
            <i className="bi bi-plus-circle me-1"></i>
            Agregado el {new Date(game.fecha_creacion).toLocaleDateString('es-ES')}
          </small>
        </div>

        {/* Botones de acción */}
        <div className="mt-auto">
          <Row className="g-2">
            <Col>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={onEdit}
                className="w-100"
              >
                <i className="bi bi-pencil me-1"></i>
                Editar
              </Button>
            </Col>
            <Col>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={onDelete}
                className="w-100"
              >
                <i className="bi bi-trash me-1"></i>
                Eliminar
              </Button>
            </Col>
          </Row>
        </div>
      </Card.Body>
    </Card>
  );
};

export default GameCard;
