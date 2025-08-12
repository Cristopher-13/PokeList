import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { GameStats as GameStatsType } from '../types/Game';

interface GameStatsProps {
  stats: GameStatsType;
}

const GameStats: React.FC<GameStatsProps> = ({ stats }) => {
  const getProgressPercentage = (completed: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  const formatHours = (hours: number) => {
    if (hours === 0) return '0h';
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    if (remainingHours === 0) return `${days}d`;
    return `${days}d ${remainingHours}h`;
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'success';
    if (rating >= 6) return 'warning';
    return 'danger';
  };

  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">
          <i className="bi bi-graph-up me-2"></i>
          Estadísticas de la Colección
        </h5>
      </Card.Header>
      <Card.Body>
        <Row className="g-3">
          {/* Total de juegos */}
          <Col xs={6} sm={3}>
            <div className="text-center">
              <div className="display-6 text-primary fw-bold">
                {stats.total_juegos}
              </div>
              <div className="text-muted small">Total de Juegos</div>
            </div>
          </Col>

          {/* Juegos completados */}
          <Col xs={6} sm={3}>
            <div className="text-center">
              <div className="display-6 text-success fw-bold">
                {stats.juegos_completados}
              </div>
              <div className="text-muted small">
                Completados
                <br />
                <small className="text-success">
                  {getProgressPercentage(stats.juegos_completados, stats.total_juegos)}%
                </small>
              </div>
            </div>
          </Col>

          {/* Juegos en progreso */}
          <Col xs={6} sm={3}>
            <div className="text-center">
              <div className="display-6 text-primary fw-bold">
                {stats.juegos_jugando}
              </div>
              <div className="text-muted small">
                En Progreso
                <br />
                <small className="text-primary">
                  {getProgressPercentage(stats.juegos_jugando, stats.total_juegos)}%
                </small>
              </div>
            </div>
          </Col>

          {/* Juegos sin iniciar */}
          <Col xs={6} sm={3}>
            <div className="text-center">
              <div className="display-6 text-secondary fw-bold">
                {stats.juegos_sin_iniciar}
              </div>
              <div className="text-muted small">
                Sin Iniciar
                <br />
                <small className="text-secondary">
                  {getProgressPercentage(stats.juegos_sin_iniciar, stats.total_juegos)}%
                </small>
              </div>
            </div>
          </Col>
        </Row>

        <hr />

        <Row className="g-3">
          {/* Total de horas jugadas */}
          <Col xs={12} sm={6}>
            <Card className="border-0 bg-light">
              <Card.Body className="text-center py-3">
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <i className="bi bi-clock-history text-primary me-2" style={{ fontSize: '1.5rem' }}></i>
                  <div>
                    <div className="h4 text-primary mb-0 fw-bold">
                      {formatHours(stats.total_horas_jugadas)}
                    </div>
                    <div className="text-muted small">Total de Horas Jugadas</div>
                  </div>
                </div>
                {stats.total_juegos > 0 && (
                  <div className="text-muted small">
                    Promedio: {Math.round(stats.total_horas_jugadas / stats.total_juegos)}h por juego
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Calificación promedio */}
          <Col xs={12} sm={6}>
            <Card className="border-0 bg-light">
              <Card.Body className="text-center py-3">
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <i className="bi bi-star-fill text-warning me-2" style={{ fontSize: '1.5rem' }}></i>
                  <div>
                    <div className={`h4 mb-0 fw-bold text-${getRatingColor(stats.calificacion_promedio)}`}>
                      {stats.calificacion_promedio.toFixed(1)}
                    </div>
                    <div className="text-muted small">Calificación Promedio</div>
                  </div>
                </div>
                <div className="text-muted small">
                  {stats.calificacion_promedio >= 8 && '¡Excelente colección!'}
                  {stats.calificacion_promedio >= 6 && stats.calificacion_promedio < 8 && 'Buena colección'}
                  {stats.calificacion_promedio < 6 && 'Colección en desarrollo'}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Estado de juegos abandonados */}
        {stats.juegos_abandonados > 0 && (
          <div className="mt-3 pt-3 border-top">
            <div className="text-center">
              <Badge bg="danger" className="fs-6 px-3 py-2">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {stats.juegos_abandonados} Juego{stats.juegos_abandonados !== 1 ? 's' : ''} Abandonado{stats.juegos_abandonados !== 1 ? 's' : ''}
              </Badge>
              <div className="text-muted small mt-2">
                Considera retomar estos juegos o eliminarlos de tu colección
              </div>
            </div>
          </div>
        )}

        {/* Resumen general */}
        <div className="mt-3 pt-3 border-top text-center">
          <div className="row g-2">
            <div className="col-6">
              <Badge bg="outline-primary" className="w-100 py-2">
                <i className="bi bi-check-circle me-1"></i>
                Completado: {getProgressPercentage(stats.juegos_completados, stats.total_juegos)}%
              </Badge>
            </div>
            <div className="col-6">
              <Badge bg="outline-success" className="w-100 py-2">
                <i className="bi bi-play-circle me-1"></i>
                Activo: {getProgressPercentage(stats.juegos_jugando + stats.juegos_completados, stats.total_juegos)}%
              </Badge>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default GameStats;

