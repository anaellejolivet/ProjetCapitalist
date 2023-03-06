import {ChangeEvent, useState} from 'react';
import './App.css';
import { gql, useApolloClient, useQuery } from '@apollo/client';
import Main from './Main';

const GET_WORLD = gql`
    query getWorld {
      getWorld {
        activeangels
        allunlocks {
          idcible
          logo
          name
          ratio
          seuil
          typeratio
          unlocked
        }
        angelbonus
        angelupgrades {
          idcible
          logo
          name
          ratio
          seuil
          typeratio
          unlocked
        }
        lastupdate
        logo
        managers {
          idcible
          logo
          name
          ratio
          seuil
          typeratio
          unlocked
        }
        money
        name
        products {
          cout
          id
        croissance
          logo
          managerUnlocked
          name
          paliers {
            idcible
            logo
            name
            ratio
            seuil
            typeratio
            unlocked
          }
          quantite
          revenu
          timeleft
          vitesse
        }
        score
        totalangels
        upgrades {
          idcible
          logo
          name
          ratio
          seuil
          typeratio
          unlocked
        }
      }
    }
  `;

function App() {

  const [username, setUsername] = useState("")

  const {loading, error, data, refetch } = useQuery(GET_WORLD, {
    context: { headers: { "x-user": username } }
  });

  const client = useApolloClient();

  let corps = undefined
  if (loading) corps = <div> Loading... </div>
  else if (error) corps = <div> Erreur de chargement du monde ! </div>
  else corps = <Main loadworld={data.getWorld} username={username} />

  function onUserNameChanged(event:ChangeEvent<HTMLInputElement>){
    setUsername(event.target.value);
    client.resetStore()

    if (event.target.value) {
      localStorage.setItem("username", event.target.value);
    }else{
      localStorage.setItem("username", ("Capitaine" + Math.floor(Math.random()*10000)) );
    }
  }


  return (
    <div className="App">
      <div className='player'>
          ID du joueur :
          <input type="text" value={username} onChange={onUserNameChanged}/>
      </div>
      { corps }
    </div>
  );
}

export default App;


// =========   TO DO LIST :  =========
//
//    AddToScore : l'argent crée depuis le debut
//    Demander au prof pour les images
//    Demander au prof pour le calcul des gains
//    Demander au prof pour les services
//    Page 41 ?
//    Faire en sorte de faire fonctionner la persistance avec notre monde (pb avec le back psq avec le serv de test ça marche)
//    Pour timeleft faire un usestate, ne pas changer 
//    Si les unlocks sont trop nombreux, vous pouvez choisir de n’afficher que les n premiers, ou de n’afficher que le prochain seuil associé à chaque produit.
//    Fermer la fenetre des unlocks si on ouvre la fenetre des managers et inversement