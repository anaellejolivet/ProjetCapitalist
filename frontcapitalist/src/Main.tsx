import React, {useEffect, useState} from 'react';
import './App.css';
import {Pallier, Product, World} from './world'
import {devis, transform} from './utils'
import ProductComponent from './Product';
import ManagerComponent from './Manager';
import { gql, useMutation } from '@apollo/client';
import UnlockComponent from './Unlock';
import { all } from 'q';
import { IconButton } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import CashUpgradesComponent from './CashUpgrades';


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
    const [showUpgrades, setShowUpgrades] = useState(false);


    useEffect(() => {
        setWorld(JSON.parse(JSON.stringify(loadworld)) as World)
    }, [loadworld])

    const [open, setOpen] = useState(false);

    // ------ SNACKBAR ---------------------------------------------
    const [messageSnackBar, setMessageSnackBar] = useState("");

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
    
        setOpen(false);
    };

    const action = (
        <React.Fragment>
            <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
            >
            <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    // ------ /SNACKBAR ---------------------------------------------





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

            // ~~~~ Achat d'un Cash Upgrade
            const ACHETER_CASH_UPGRADE = gql`
            mutation acheterCashUpgrade($name: String!) {
                acheterCashUpgrade(name: $name) {
                    name
                }
            }`

            const [acheterCashUpgrade] = useMutation(ACHETER_CASH_UPGRADE,
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
        let facture = devis(product,qt)

        product.quantite = product.quantite + qt
        product.cout = product.cout*Math.pow(product.croissance, qt)

        // ================================DETAIL A REGLER =========================
        world.money = world.money - facture
        setMoney(money - facture)
        // ================================DETAIL A REGLER =========================

        // ++++++++++++ QUAND JE MET CA FAIT BUGGER L'AFFICHAGE MAIS LA PERSISTANCE FONCTIONNE ++++++++++++
        achatProduit({ variables: { id: product.id, quantite: qt } });

        world.products.forEach(product => {
            product.paliers.forEach(palier =>{
                if (palier.seuil <= product.quantite && palier.unlocked != true ) {
                    palier.unlocked = true
                    switch (palier.typeratio) {
                        case "vitesse":
                            product.revenu = product.vitesse/palier.ratio
                            break;
                        case "gain":
                            product.vitesse = product.vitesse/palier.ratio
                            break;
                        default:
                            break;
                    }
                    setMessageSnackBar(palier.name + " ! ==> "+ palier.typeratio + " x" + palier.ratio)
                    setOpen(true)
                }
            });
        });

        world.allunlocks.forEach(unlock => {
            if (unlock.seuil <= product.quantite && !unlock.unlocked) {
                let allGood = true
                world.products.forEach(p => {
                    if (unlock.seuil > p.quantite) {
                        allGood = false
                        return
                    }
                })

                if (allGood) {
                    unlock.unlocked = true
                    setMessageSnackBar(unlock.name + " ! ==> "+ unlock.typeratio + " x" + unlock.ratio)
                    setOpen(true)
                    
                }
            }
        });

    }

    function onCloseManager() {
        setShowManagers(!showManagers)
    }

    function onCloseUnlock() {
        setShowUnlocks(!showUnlocks)
    }

    function onCloseCashUpgrades() {
        setShowUpgrades(!showUpgrades)
    }
    
    function onManagerHired(manager: Pallier) {

        // ================================DETAIL A REGLER =========================
        world.money = world.money - manager.seuil
        setMoney(money - manager.seuil)
        // ================================DETAIL A REGLER =========================
        manager.unlocked= true

        world.products[manager.idcible-1].managerUnlocked = true;

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

    function onUpgradeBought(upgrade:Pallier) {
        world.money = world.money - upgrade.seuil
        setMoney(money - upgrade.seuil)


        switch (upgrade.typeratio) {
            case "vitesse":
                world.products[upgrade.idcible].revenu = world.products[upgrade.idcible].vitesse/upgrade.ratio
                break;
            case "gain":
                world.products[upgrade.idcible].vitesse = world.products[upgrade.idcible].vitesse/upgrade.ratio
                break;
            default:
                break;
        }

        acheterCashUpgrade({ variables: { name: upgrade.name } });
        upgrade.unlocked= true

        setMessageSnackBar(upgrade.name + " ! ==> "+ upgrade.typeratio + " x" + upgrade.ratio)
        setOpen(true)
        

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

                    <button onClick={() => setShowUpgrades(!showUpgrades)}>{showUpgrades ? 'Hide Upgrades' : 'Show Upgrades'}</button>
                    {showUpgrades && <CashUpgradesComponent world={world} money={world.money} showUpgrades={showUpgrades} onCloseCashUpgrades={onCloseCashUpgrades} onUpgradeBought={onUpgradeBought} />}

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
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            message={messageSnackBar}
            action={action}
        />
    </div>
    );

}










