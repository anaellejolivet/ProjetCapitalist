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
