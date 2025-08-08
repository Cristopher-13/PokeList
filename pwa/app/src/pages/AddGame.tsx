import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonButton } from '@ionic/react';
import { createGame } from '../api/games';
import { useHistory } from 'react-router-dom';

const AddGame: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [plataforma, setPlataforma] = useState('');
  const [estado, setEstado] = useState('sin iniciar');
  const history = useHistory();

  const handleSubmit = async () => {
    await createGame({ nombre, plataforma, estado });
    history.push('/');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Agregar Juego</IonTitle>
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
        <IonButton expand="full" onClick={handleSubmit}>Guardar</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default AddGame;
