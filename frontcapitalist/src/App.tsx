import {ChangeEvent, useEffect, useState} from 'react';
import './css/App.css';
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

  const client = useApolloClient();

  let name = localStorage.getItem("username");
  // si pas de username, on génère un username aléatoire
  if (!name || name === "") {
       name = "Egyptien" + Math.floor(Math.random() * 10000);
       localStorage.setItem("username", name);
  }
  
  const [username, setUsername] = useState(name)

  const {loading, error, data, refetch } = useQuery(GET_WORLD, {
    context: { headers: { "x-user": username } }
  });


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
      let name = "Egyptien" + Math.floor(Math.random()*10000)
      localStorage.setItem("username", name );
      setUsername(name)
    }
  }


  return (
    <div className="App">
      <div className='player'>
          <h5>Joueur </h5>
          <input type="text" value={username} onChange={onUserNameChanged}/>
      </div>
      { corps }
    </div>
  );
}

export default App;


// =========   TO DO LIST :  =========
//
//    Page 41 ?
//    QUAND ON RESET LE MONDE ALORS QU'ON A DES ANGES ON LES PERD

//    Pour timeleft faire un usestate, ne pas changer 
