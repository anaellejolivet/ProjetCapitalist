import React, {useEffect, useState} from 'react';
import './App.css';
import {Product, World} from './world'
import {transform} from './utils'
import ProductComponent from './Product';


type MainProps = {
    loadworld: World
    username: string
}


export default function Main({ loadworld, username } : MainProps) {

    const [world, setWorld] = useState(JSON.parse(JSON.stringify(loadworld)) as World)

    const [qtmulti, setQtMulti] = useState("x1")
    const [money, setMoney] = useState(world.money)

    useEffect(() => {
        setWorld(JSON.parse(JSON.stringify(loadworld)) as World)
    }, [loadworld])


    function onProductionDone(p: Product): void {
        // calcul de la somme obtenue par la production du produit
        let gain = p.revenu*p.quantite
        // ajout de la somme à l’argent possédé
        //addToScore(gain)

        // ==================================== Regler ce problème ? ==================================================================
        // world.money ne s'update pas à l'affichage quand on l'incrémente mais ça marche avec le hook, doit-on garder le hook ou world.money ?
        world.money = world.money + gain
        setMoney(world.money+gain)
        // ============================================================================================================================
    }

    function onProductBuy(qt:number, product: Product) {
        // world.money = world.money + gain
        
        let facture = product.cout;
        for (let i = 1; i < qt; i++) {
            facture = facture*product.croissance
        }
        console.log()
        setMoney(money - facture)
        product.quantite = product.quantite + qt
        world.money = world.money - facture
    }

    function switchQtMulti() {
        switch (qtmulti) {
            case "x1":
                setQtMulti("x10")
                break;
            case "x10":
                setQtMulti("x100")
                break;
            case "x100":
                setQtMulti("Max")
                break;
            case "Max":
                setQtMulti("x1")
                break;
            default:
                setQtMulti("x1")
                break;
        }
    }
    return (


    <div className="main">

        <div className='dashboard'>
            <div> {loadworld.name} <img src={"http://localhost:4000/" + loadworld.logo} /> </div> 
            <div className='money'> Logo Argent :
            <span dangerouslySetInnerHTML={{__html: transform(world.money)}}></span>
            </div>
            <div><button onClick={switchQtMulti}>{qtmulti}</button>  </div> 
        </div>

        <div className='jeu'>
            <div className='menu_buttons'> liste des boutons de menu :
                <div className='button'> <img src="" /> <p>Button A</p></div>
                <div className='button'> <img src="" /> <p>Button B</p></div>
                <div className='button'> <img src="" /> <p>Button C</p></div>
                <div className='button'> <img src="" /> <p>Button D</p></div>
                <div className='button'> <img src="" /> <p>Button E</p></div>
            </div>

            <div className='products'> 
                <ProductComponent product={world.products[0]} onProductBuy={onProductBuy} onProductionDone={onProductionDone} qtmulti={qtmulti} worldmoney={world.money} />

            </div>
        </div>
    </div>
    );

}










