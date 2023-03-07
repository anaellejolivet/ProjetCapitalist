import React, {useEffect, useState} from 'react';
import './App.css';
import {Pallier, Product, World} from './world'
import {devis, transform} from './utils'
import ProductComponent from './Product';
import ManagerComponent from './Manager';
import { gql, useMutation } from '@apollo/client';
import UnlockComponent from './Unlock';


type MainProps = {
    loadworld: World
    username: string
}


export default function Main({ loadworld, username } : MainProps) {

    const [world, setWorld] = useState(JSON.parse(JSON.stringify(loadworld)) as World)

    const [qtmulti, setQtMulti] = useState("x1")
    const [money, setMoney] = useState(world.money)

    const [showManagers, setShowManagers] = useState(false);
    const [showUnlocks, setShowUnlocks] = useState(false);

    useEffect(() => {
        setWorld(JSON.parse(JSON.stringify(loadworld)) as World)
    }, [loadworld])



    // ------ MUTATION ---------------------------------------------

        // ~~~~ Achat d'une quantité de produit
            const ACHETER_QT_PRODUIT = gql`
            mutation acheterQtProduit($id: Int!, $quantite: Int!) {
                acheterQtProduit(id: $id, quantite: $quantite) {
                    id,
                    quantite
                }
            }`

            const [achatProduit] = useMutation(ACHETER_QT_PRODUIT,
                { context: { headers: { "x-user": username }},
                    onError: (error): void => {
                    // actions en cas d'erreur
                    }
                }
            )

        // ~~~~ Engagement d'un manager
            const ENGAGER_MANAGER = gql`
            mutation engagerManager($name: String!) {
                engagerManager(name: $name) {
                    name
                }
            }`

            const [engagerManager] = useMutation(ENGAGER_MANAGER,
                { context: { headers: { "x-user": username }},
                    onError: (error): void => {
                    // actions en cas d'erreur
                    }
                }
            )

    // ------ /MUTATION ---------------------------------------------




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
        let facture = devis(product,qt)

        product.quantite = product.quantite + qt
        product.cout = product.cout*Math.pow(product.croissance, qt)

        // ================================DETAIL A REGLER =========================
        world.money = world.money - facture
        setMoney(money - facture)
        // ================================DETAIL A REGLER =========================

        // ++++++++++++ QUAND JE MET CA FAIT BUGGER L'AFFICHAGE MAIS LA PERSISTANCE FONCTIONNE ++++++++++++
        //achatProduit({ variables: { id: product.id, quantite: qt } });

        world.products.forEach(product => {
            product.paliers.forEach(palier =>{
                if (palier.seuil <= product.quantite) {
                    palier.unlocked = true
                }
            });
        });
        
        world.allunlocks.forEach(unlock => {
            if (unlock.seuil <= product.quantite) {
                unlock.unlocked = true
            }
        });

    }

    function onCloseManager() {
        setShowManagers(!showManagers)
    }

    function onCloseUnlock() {
        setShowUnlocks(!showUnlocks)
    }
    
    function onManagerHired(manager: Pallier) {

        // ================================DETAIL A REGLER =========================
        world.money = world.money - manager.seuil
        setMoney(money - manager.seuil)
        // ================================DETAIL A REGLER =========================
        manager.unlocked= true

        console.log(world.products[manager.idcible].name)
        console.log(world.products[0].managerUnlocked)


        console.log(world.products[manager.idcible].managerUnlocked)

        world.products[manager.idcible-1].managerUnlocked = true;
        console.log(world.products[manager.idcible].managerUnlocked)

        engagerManager({ variables: { name: manager.name } });

        
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
                <div>
                    <button onClick={() => setShowManagers(!showManagers)}>{showManagers ? 'Hide Managers' : 'Show Managers'}</button>
                    {showManagers && <ManagerComponent world={world} money={world.money} showManagers={showManagers} onCloseManager={onCloseManager} onManagerHired={onManagerHired} />}
                    <button onClick={() => setShowUnlocks(!showUnlocks)}>{showUnlocks ? 'Hide Unlocks' : 'Show Unlocks'}</button>
                    {showUnlocks && <UnlockComponent world={world} money={world.money} showUnlocks={showUnlocks} onCloseUnlock={onCloseUnlock} />}

                </div>
                <div className='button'> <img src="" /> <p>Button B</p></div>
                <div className='button'> <img src="" /> <p>Button C</p></div>
                <div className='button'> <img src="" /> <p>Button D</p></div>
                <div className='button'> <img src="" /> <p>Button E</p></div>
            </div>

            <div className='products'> 
                <ProductComponent product={world.products[0]} onProductBuy={onProductBuy} onProductionDone={onProductionDone} qtmulti={qtmulti} worldmoney={world.money} username={username} />
                <ProductComponent product={world.products[1]} onProductBuy={onProductBuy} onProductionDone={onProductionDone} qtmulti={qtmulti} worldmoney={world.money} username={username} />
                <ProductComponent product={world.products[2]} onProductBuy={onProductBuy} onProductionDone={onProductionDone} qtmulti={qtmulti} worldmoney={world.money} username={username} />
                <ProductComponent product={world.products[3]} onProductBuy={onProductBuy} onProductionDone={onProductionDone} qtmulti={qtmulti} worldmoney={world.money} username={username} />
                <ProductComponent product={world.products[4]} onProductBuy={onProductBuy} onProductionDone={onProductionDone} qtmulti={qtmulti} worldmoney={world.money} username={username} />
                <ProductComponent product={world.products[5]} onProductBuy={onProductBuy} onProductionDone={onProductionDone} qtmulti={qtmulti} worldmoney={world.money} username={username} />

            </div>
        </div>
    </div>
    );

}










