import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonButton } from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { getGame, updateGame } from '../api/games';

const EditGame: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [nombre, setNombre] = useState('');
  const [plataforma, setPlataforma] = useState('');
  const [estado, setEstado] = useState('');
  const history = useHistory();

  useEffect(() => {
    const loadGame = async () => {
      const res = await getGame(parseInt(id));
      setNombre(res.data.nombre);
      setPlataforma(res.data.plataforma);
      setEstado(res.data.estado);
    };
    loadGame();
  }, [id]);

  const handleUpdate = async () => {
    await updateGame(parseInt(id), { nombre, plataforma, estado });
    history.push('/');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Editar Juego</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          <IonLabel position="stacked">Nombre</IonLabel>
          <IonInput value={nombre} onIonChange={e => setNombre(e.detail.value!)} />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Plataforma</IonLabel>
          <IonInput value={plataforma} onIonChange={e => setPlataforma(e.detail.value!)} />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Estado</IonLabel>
          <IonSelect value={estado} onIonChange={e => setEstado(e.detail.value)}>
            <IonSelectOption value="sin iniciar">Sin Iniciar</IonSelectOption>
            <IonSelectOption value="jugando">Jugando</IonSelectOption>
            <IonSelectOption value="completado">Completado</IonSelectOption>
          </IonSelect>
        </IonItem>
        <IonButton expand="full" onClick={handleUpdate}>Actualizar</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default EditGame;
