import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonList, IonItem, IonLabel } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { getGames, deleteGame } from '../api/games';

const Home: React.FC = () => {
  const [games, setGames] = useState<any[]>([]);
  const history = useHistory();

  const loadGames = async () => {
    const res = await getGames();
    setGames(res.data);
  };

  const handleDelete = async (id: number) => {
    await deleteGame(id);
    loadGames();
  };

  useEffect(() => {
    loadGames();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mis Juegos Pokémon</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton expand="full" onClick={() => history.push('/add')}>Agregar juego</IonButton>
        <IonList>
          {games.map((game) => (
            <IonItem key={game.id}>
              <IonLabel>
                <h2>{game.nombre}</h2>
                <p>Plataforma: {game.plataforma}</p>
                <p>Estado: {game.estado}</p>
              </IonLabel>
              <IonButton color="primary" onClick={() => history.push(`/edit/${game.id}`)}>Editar</IonButton>
              <IonButton color="danger" onClick={() => handleDelete(game.id)}>Eliminar</IonButton>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
