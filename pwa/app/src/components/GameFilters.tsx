import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Button, Row, Col, Card } from 'react-bootstrap';
import { getPlatforms, getGenres } from '../api/games';
import { GameFilters as GameFiltersType } from '../types/Game';

interface GameFiltersProps {
  onFiltersChange: (filters: GameFiltersType) => void;
}

const GameFilters: React.FC<GameFiltersProps> = ({ onFiltersChange }) => {
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState<GameFiltersType>({
    search: '',
    estado: '',
    genero: '',
    plataforma: '',
    calificacion_min: undefined,
    horas_min: undefined
  });

  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    try {
      setLoading(true);
      const [platformsRes, genresRes] = await Promise.all([
        getPlatforms(),
        getGenres()
      ]);
      setPlatforms(platformsRes.data);
      setGenres(genresRes.data);
    } catch (err) {
      console.error('Error loading filter options:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof GameFiltersType, value: string | number | undefined) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters: GameFiltersType = {
      search: '',
      estado: '',
      genero: '',
      plataforma: '',
      calificacion_min: undefined,
      horas_min: undefined
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== undefined && value !== 0
  );

  if (loading) {
    return (
      <Card className="mb-4">
        <Card.Body className="text-center py-3">
          <div className="spinner-border spinner-border-sm text-primary me-2" />
          Cargando filtros...
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <Card.Header className="bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0">
            <i className="bi bi-funnel me-2"></i>
            Filtros de Búsqueda
          </h6>
          {hasActiveFilters && (
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleClearFilters}
            >
              <i className="bi bi-x-circle me-1"></i>
              Limpiar Filtros
            </Button>
          )}
        </div>
      </Card.Header>
      <Card.Body>
        <Row className="g-3">
          {/* Búsqueda */}
          <Col xs={12} md={6}>
            <Form.Group>
              <Form.Label>Buscar</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Buscar por nombre, descripción o plataforma..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </InputGroup>
            </Form.Group>
          </Col>

          {/* Estado */}
          <Col xs={12} sm={6} md={3}>
            <Form.Group>
              <Form.Label>Estado</Form.Label>
              <Form.Select
                value={filters.estado}
                onChange={(e) => handleFilterChange('estado', e.target.value)}
              >
                <option value="">Todos los estados</option>
                <option value="sin iniciar">Sin Iniciar</option>
                <option value="jugando">Jugando</option>
                <option value="completado">Completado</option>
                <option value="abandonado">Abandonado</option>
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Género */}
          <Col xs={12} sm={6} md={3}>
            <Form.Group>
              <Form.Label>Género</Form.Label>
              <Form.Select
                value={filters.genero}
                onChange={(e) => handleFilterChange('genero', e.target.value)}
              >
                <option value="">Todos los géneros</option>
                {genres.map((genero) => (
                  <option key={genero} value={genero}>
                    {genero.charAt(0).toUpperCase() + genero.slice(1)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Plataforma */}
          <Col xs={12} sm={6} md={3}>
            <Form.Group>
              <Form.Label>Plataforma</Form.Label>
              <Form.Select
                value={filters.plataforma}
                onChange={(e) => handleFilterChange('plataforma', e.target.value)}
              >
                <option value="">Todas las plataformas</option>
                {platforms.map((plataforma) => (
                  <option key={plataforma} value={plataforma}>
                    {plataforma}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Calificación mínima */}
          <Col xs={12} sm={6} md={3}>
            <Form.Group>
              <Form.Label>Calificación mínima</Form.Label>
              <Form.Select
                value={filters.calificacion_min || ''}
                onChange={(e) => handleFilterChange('calificacion_min', e.target.value ? parseInt(e.target.value) : undefined)}
              >
                <option value="">Sin calificación mínima</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating}+ estrellas
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Horas mínimas */}
          <Col xs={12} sm={6} md={3}>
            <Form.Group>
              <Form.Label>Horas mínimas jugadas</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="9999"
                placeholder="0"
                value={filters.horas_min || ''}
                onChange={(e) => handleFilterChange('horas_min', e.target.value ? parseInt(e.target.value) : undefined)}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Resumen de filtros activos */}
        {hasActiveFilters && (
          <div className="mt-3 pt-3 border-top">
            <small className="text-muted">
              <strong>Filtros activos:</strong>
              {filters.search && ` Búsqueda: "${filters.search}"`}
              {filters.estado && ` Estado: ${filters.estado}`}
              {filters.genero && ` Género: ${filters.genero}`}
              {filters.plataforma && ` Plataforma: ${filters.plataforma}`}
              {filters.calificacion_min && ` Calificación: ${filters.calificacion_min}+`}
              {filters.horas_min && ` Horas: ${filters.horas_min}+`}
            </small>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default GameFilters;

