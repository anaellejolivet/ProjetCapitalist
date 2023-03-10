import React, {useEffect, useState} from 'react';
import './App.css';
import {Pallier, Product, World} from './world'
import {devis, transform} from './utils'
import ProductComponent from './Product';
import ManagerComponent from './Manager';
import { gql, useMutation } from '@apollo/client';
import UnlockComponent from './Unlock';
import { Button, IconButton } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import CashUpgradesComponent from './CashUpgrades';
import { wait } from '@testing-library/user-event/dist/utils';


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
    const [open, setOpen] = useState(false);

    useEffect(() => {
        // Code de l'ennoncé :
        console.log("avant : : : : : : : : "+ money) // affiche la bonne valeur (càd l'argent décrementé du montant de l'achat)

        setWorld(JSON.parse(JSON.stringify(loadworld)) as World)

        console.log("apres : : : : : : : : "+(JSON.parse(JSON.stringify(loadworld)) as World).money) // affiche de la money au chargement de la page
        // Ex : quand on crée un nouveau joueur ("Jean"), on lance manuelement des productions pour obtenir un total d'argent de 20$
        // si on achete un produit qui coute 4, normalement, notre money sera de 16$ (et c'est ce qu'affiche mon premier console.log "avant")
        // or, le world va être à nouveau generé à partir de loadworld qui lui n'a pas changé de valeur.
        // mon deuxieme console.log "apres" va donc afficher 0 et donc l'argent affiché sera 0
        // Ex 2 : si je change de joueur et reviens sur "Jean", tout aura été mis à jour avec les bonnes données car les données auront été recuperées 
        // du backend qui a été appelé et qui s'est executé correctement.
        // Si on effectue les même actions qu'à mon premier exemple, le money affiché sera 16$, la valeur du money au chargement

    }, [loadworld])


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
            mutation AcheterQtProduit($acheterQtProduitId: Int!, $quantite: Int!) {
                acheterQtProduit(id: $acheterQtProduitId, quantite: $quantite) {
                    id
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
            mutation EngagerManager($name: String!) {
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

        // ================================ MAJ MONEY =========================
        world.money = world.money + gain
        setMoney(world.money+gain)
        // ================================ MAJ MONEY =========================
    }

    function onProductBuy(qt:number, product: Product) {
        console.log("****************** onProductBuy *************************")

        let facture = devis(product,qt)
        
        product.quantite = product.quantite + qt
        product.cout = product.cout*Math.pow(product.croissance, qt)

        // ================================ MAJ MONEY =========================
        world.money = world.money - facture
        setMoney(money - facture)
        // ================================ MAJ MONEY =========================


        console.log("****************** Appel au back *************************")
        // En commentant cette ligne le front fonctionne mais perte de persistance
        achatProduit({ variables: { acheterQtProduitId: product.id, quantite: qt } })
        

        // console.log("cout = " + product.cout)
        // console.log("money = " + world.money)
        // console.log("quantite produit = "+ product.quantite)
        // console.log("quantite acheté = "+ qt)
        // console.log("Vitesse = " + product.vitesse )

        // console.log("money = " + world.money)
        // console.log("money = " + money)

        world.products.forEach(product => {
            product.paliers.forEach(palier =>{
                if (palier.seuil <= product.quantite && palier.unlocked != true ) {
                    palier.unlocked = true
                    switch (palier.typeratio) {
                        case "vitesse":
                            product.vitesse = product.vitesse/palier.ratio
                            break;
                        case "gain":
                            product.revenu = product.vitesse/palier.ratio
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
                    
                    //setOpen(true)
                    
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

        // ================================ MAJ MONEY =========================
        world.money = world.money - manager.seuil
        setMoney(money - manager.seuil)
        // ================================ MAJ MONEY =========================
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

        console.log("unlocked ? : "+ upgrade.unlocked)


        switch (upgrade.typeratio) {
            case "vitesse":
                world.products[upgrade.idcible-1].vitesse = world.products[upgrade.idcible-1].vitesse/upgrade.ratio
                console.log(world.products[upgrade.idcible-1].name)
                break;
            case "gain":
                world.products[upgrade.idcible-1].revenu = world.products[upgrade.idcible-1].revenu*upgrade.ratio
                console.log(upgrade.ratio)
                break;
            default:
                break;
        }

        world.money = world.money - upgrade.seuil
        setMoney(money - upgrade.seuil)

        acheterCashUpgrade({ variables: { name: upgrade.name } });
        
        upgrade.unlocked= true
        world.upgrades[upgrade.idcible-1].unlocked = true

        setMessageSnackBar(upgrade.name + " ! ==> "+ upgrade.typeratio + " x" + upgrade.ratio)
        setOpen(true)

    }

        return (
        <div className="main">

            <div className='dashboard'>
                <div> {loadworld.name} <img className='worldImg' src={"http://localhost:4000/" + loadworld.logo} /> </div> 
                <div className='money'> Logo Argent :
                <span dangerouslySetInnerHTML={{__html: transform(world.money)}}></span>
                </div>
                <div><button onClick={switchQtMulti}>{qtmulti}</button>  </div> 
            </div>

            <div className='jeu'>
                <div className='menu_buttons'>
                    <h2>Menu</h2>              
                    <Button onClick={() => setShowManagers(!showManagers)}>{showManagers ? 'Hide Managers' : 'Show Managers'}</Button>
                    {showManagers && <ManagerComponent world={world} money={world.money} showManagers={showManagers} onCloseManager={onCloseManager} onManagerHired={onManagerHired} />}
                    
                    <Button onClick={() => setShowUnlocks(!showUnlocks)}>{showUnlocks ? 'Hide Unlocks' : 'Show Unlocks'}</Button>
                    {showUnlocks && <UnlockComponent world={world} money={world.money} showUnlocks={showUnlocks} onCloseUnlock={onCloseUnlock} />}

                    <Button onClick={() => setShowUpgrades(!showUpgrades)}>{showUpgrades ? 'Hide Upgrades' : 'Show Upgrades'}</Button>
                    {showUpgrades && <CashUpgradesComponent world={world} money={world.money} showUpgrades={showUpgrades} onCloseCashUpgrades={onCloseCashUpgrades} onUpgradeBought={onUpgradeBought} />}

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










