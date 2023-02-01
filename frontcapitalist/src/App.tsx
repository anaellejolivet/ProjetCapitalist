import React from 'react';
import logo from './logo.svg';
import './App.css';
import { gql } from '@apollo/client';

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
  return (
    
    <div className="App">
      <div className="header">
        <div> logo monde </div> 
        <div> argent </div>
        <div> multiplicateur </div> 
        <div> ID du joueur </div>
      </div>
      <div className="main">
        <div> liste des boutons de menu </div> 
      <div className="product">
        <div> premier produit </div> 
        <div> second produit </div> 
        <div> troisième produit </div> 
        <div> quatrième produit </div> 
        <div> cinquième produit </div> 
        <div> sixième produit </div>
      </div>
    </div>
  </div>
  );
}

export default App;
