import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { getGame, updateGame, createGameFormData } from '../api/games';
import { Game, GameFormData } from '../types/Game';

const EditGame: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<GameFormData>({
    nombre: '',
    descripcion: '',
    plataforma: '',
    estado: 'sin iniciar',
    genero: 'rpg',
    fecha_lanzamiento: '',
    horas_jugadas: 0,
    calificacion: undefined,
    imagen: undefined
  });

  useEffect(() => {
    if (id) {
      loadGame(parseInt(id));
    }
  }, [id]);

  const loadGame = async (gameId: number) => {
    try {
      setLoading(true);
      const response = await getGame(gameId);
      const game = response.data;
      
      setFormData({
        nombre: game.nombre,
        descripcion: game.descripcion || '',
        plataforma: game.plataforma,
        estado: game.estado,
        genero: game.genero,
        fecha_lanzamiento: game.fecha_lanzamiento || '',
        horas_jugadas: game.horas_jugadas,
        calificacion: game.calificacion,
        imagen: undefined
      });

      if (game.imagen_url) {
        setCurrentImage(game.imagen_url);
        setImagePreview(game.imagen_url);
      }
    } catch (err: any) {
      console.error('Error loading game:', err);
      setError('Error al cargar el juego');
      toast.error('Error al cargar el juego');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, imagen: file }));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCurrentImage = () => {
    setCurrentImage(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, imagen: undefined }));
  };

  const validateForm = (): boolean => {
    if (!formData.nombre.trim()) {
      setError('El nombre del juego es obligatorio');
      return false;
    }
    if (!formData.plataforma.trim()) {
      setError('La plataforma es obligatoria');
      return false;
    }
    if (formData.estado === 'completado' && formData.horas_jugadas === 0) {
      setError('Un juego completado debe tener al menos 1 hora jugada');
      return false;
    }
    if (formData.calificacion && (formData.calificacion < 1 || formData.calificacion > 10)) {
      setError('La calificación debe estar entre 1 y 10');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      const formDataToSend = createGameFormData(formData);
      await updateGame(parseInt(id!), formDataToSend);
      
      toast.success('Juego actualizado exitosamente');
      navigate('/');
    } catch (err: any) {
      console.error('Error updating game:', err);
      const errorMessage = err.response?.data?.detail || err.message || 'Error al actualizar el juego';
      setError(errorMessage);
      toast.error('Error al actualizar el juego');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando juego...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card>
            <Card.Header className="bg-warning text-dark">
              <h3 className="mb-0">
                <i className="bi bi-pencil-square me-2"></i>
                Editar Juego
              </h3>
            </Card.Header>
            <Card.Body>
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre del Juego *</Form.Label>
                      <Form.Control
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        placeholder="Ej: The Legend of Zelda"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Plataforma *</Form.Label>
                      <Form.Control
                        type="text"
                        name="plataforma"
                        value={formData.plataforma}
                        onChange={handleInputChange}
                        placeholder="Ej: Nintendo Switch"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    placeholder="Describe el juego..."
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Estado</Form.Label>
                      <Form.Select
                        name="estado"
                        value={formData.estado}
                        onChange={handleInputChange}
                      >
                        <option value="sin iniciar">Sin Iniciar</option>
                        <option value="jugando">Jugando</option>
                        <option value="completado">Completado</option>
                        <option value="abandonado">Abandonado</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Género</Form.Label>
                      <Form.Select
                        name="genero"
                        value={formData.genero}
                        onChange={handleInputChange}
                      >
                        <option value="rpg">RPG</option>
                        <option value="accion">Acción</option>
                        <option value="aventura">Aventura</option>
                        <option value="estrategia">Estrategia</option>
                        <option value="deportes">Deportes</option>
                        <option value="otros">Otros</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Fecha de Lanzamiento</Form.Label>
                      <Form.Control
                        type="date"
                        name="fecha_lanzamiento"
                        value={formData.fecha_lanzamiento}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Horas Jugadas</Form.Label>
                      <Form.Control
                        type="number"
                        name="horas_jugadas"
                        value={formData.horas_jugadas}
                        onChange={handleInputChange}
                        min="0"
                        max="9999"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Calificación (1-10)</Form.Label>
                      <Form.Control
                        type="number"
                        name="calificacion"
                        value={formData.calificacion || ''}
                        onChange={handleInputChange}
                        min="1"
                        max="10"
                        placeholder="Opcional"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label>Imagen del Juego</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <Form.Text className="text-muted">
                    Formatos soportados: JPG, PNG, GIF. Máximo 5MB.
                  </Form.Text>
                </Form.Group>

                {currentImage && (
                  <div className="mb-3">
                    <Form.Label>Imagen Actual:</Form.Label>
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={currentImage}
                        alt="Imagen actual"
                        className="img-thumbnail"
                        style={{ maxHeight: '100px' }}
                      />
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={removeCurrentImage}
                      >
                        <i className="bi bi-trash me-1"></i>
                        Eliminar
                      </Button>
                    </div>
                  </div>
                )}

                {imagePreview && imagePreview !== currentImage && (
                  <div className="mb-4">
                    <Form.Label>Nueva Imagen:</Form.Label>
                    <div className="text-center">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="img-thumbnail"
                        style={{ maxHeight: '200px' }}
                      />
                    </div>
                  </div>
                )}

                <div className="d-flex gap-2 justify-content-end">
                  <Button variant="secondary" onClick={handleCancel} disabled={saving}>
                    Cancelar
                  </Button>
                  <Button variant="warning" type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Guardar Cambios
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditGame;
