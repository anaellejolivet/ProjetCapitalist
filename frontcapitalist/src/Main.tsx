import './css/App.css';
import React, {useEffect, useState} from 'react';
import {Pallier, Product, World} from './world'
import {devis, transform} from './utils'
import { gql, useMutation } from '@apollo/client';

import { Badge, Button, IconButton, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { wait } from '@testing-library/user-event/dist/utils';

import ProductComponent from './Product';
import ManagerComponent from './Manager';
import UnlockComponent from './Unlock';
import CashUpgradesComponent from './CashUpgrades';
import AngelComponent from './AngelUpgrades';
import InvestorComponent from './Investor';
import StatComponent from './Statistic';


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
    const [showAngelUpgrades, setShowAngelUpgrades] = useState(false);
    const [showInvestors, setShowInvestors] = useState(false);
    const [showStat, setShowStat] = useState(false);

    
    const [open, setOpen] = useState(false);
    const [badgeManager, setBadgeManager] = useState(0);
    const [badgeUpgrade, setBadgeUpgrade] = useState(0);
    const [badgeAngelUpgrade, setBadgeAngelUpgrade] = useState(0);
    const [badgeReset, setBadgeReset] = useState(0);

    
    useEffect(() => {

        setWorld(JSON.parse(JSON.stringify(loadworld)) as World);

      }, [loadworld]);
      

    // ~~~ Mise à jour des badges ~~~ 

    useEffect(() => {
        updateMoneyBadges()
    }, [money])

    useEffect(() => {
        updateAngelBadges()
    }, [world.activeangels])


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

        // ~~~~ Reset World
            const RESET_WORLD = gql`
            mutation resetWorld{
                resetWorld{
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
            }`

            const [resetWorld] = useMutation(RESET_WORLD,
                { context: { headers: { "x-user": username }},
                    onError: (error): void => {
                    // actions en cas d'erreur
                    }
                }
            )
        
        // ~~~~ Angel Upgrade
            const ACHETER_ANGEL_UPGRADE = gql`
            mutation acheterAngelUpgrade($name: String!) {
                acheterAngelUpgrade(name: $name) {
                    name
                }
            }`

            const [acheterAngelUpgrade] = useMutation(ACHETER_ANGEL_UPGRADE,
                { context: { headers: { "x-user": username }},
                    onError: (error): void => {
                    // actions en cas d'erreur
                    }
                }
            )

    // ------ /MUTATION ---------------------------------------------


    // ------ FONCTIONS D'AFFICHAGE ---------------------------------------

        // Changement de la valeur inscrite dans le bouton de quantité
        // Appel : au clic du bouton de quantité
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

        // Mise à jour des badges liées à l'argent (Manager + Cash Upgrade)
        function updateMoneyBadges() {
            // Badges Manager
            setBadgeManager(prevBadgeManager => prevBadgeManager - prevBadgeManager);
            world.managers.forEach(manager => {
                if (world.money < manager.seuil) {
                    return
                }else if(!manager.unlocked && manager.seuil <= world.money){
                    setBadgeManager(prevBadgeManager => prevBadgeManager + 1); // Mettre à jour la valeur de badgeManager
                }
            });

            // Badges Cash Upgrades
            setBadgeUpgrade(prevBadgeUpgrade => prevBadgeUpgrade - prevBadgeUpgrade);
            world.upgrades.forEach(upgrade => {
                if (world.money < upgrade.seuil) {
                    return
                }else if(!upgrade.unlocked && upgrade.seuil <= world.money){
                    setBadgeUpgrade(prevBadgeUpgrade => prevBadgeUpgrade + 1);
                }
            });
        }

        // Mise à jour des badges liées aux anges (Reset World + Angel Upgrade)
        function updateAngelBadges() {
            // Badges Angel Upgrades
            setBadgeAngelUpgrade(prevBadgeAngelUpgrade => prevBadgeAngelUpgrade - prevBadgeAngelUpgrade);
            world.angelupgrades.forEach(angelUpg => {
                if (world.activeangels < angelUpg.seuil) {
                    return
                }else if(!angelUpg.unlocked && angelUpg.seuil <= world.activeangels){
                    setBadgeAngelUpgrade(prevBadgeAngelUpgrade => prevBadgeAngelUpgrade + 1);
                }
            });

            // Badges Reset World
            setBadgeReset(prevBadgeReset => prevBadgeReset - prevBadgeReset);
            setBadgeReset(prevBadgeReset => prevBadgeReset + Math.floor(150 * Math.sqrt(world.score/Math.pow(10, 15))-world.totalangels));
            
        }

        // ---  Ouverture et Fermeture des fenetres  ---
        // (A l'ouverture ou fermeture d'une fenetre, on ferme toutes les autres)
            function onOpenCloseManager() {
                setShowManagers(!showManagers)
                setShowAngelUpgrades(false)
                setShowInvestors(false)
                setShowUnlocks(false)
                setShowUpgrades(false)
                setShowStat(false)
            }

            function onOpenCloseUnlock() {
                setShowUnlocks(!showUnlocks)
                setShowAngelUpgrades(false)
                setShowInvestors(false)
                setShowManagers(false)
                setShowUpgrades(false)
                setShowStat(false)
            }

            function onOpenCloseCashUpgrades() {
                setShowUpgrades(!showUpgrades)
                setShowAngelUpgrades(false)
                setShowInvestors(false)
                setShowManagers(false)
                setShowUnlocks(false)
                setShowStat(false)
            }

            function onOpenCloseAngelUpgrades() {
                setShowAngelUpgrades(!showAngelUpgrades)
                setShowInvestors(false)
                setShowManagers(false)
                setShowUnlocks(false)
                setShowUpgrades(false)
                setShowStat(false)
            }

            function onOpenCloseInvestors() {
                setShowInvestors(!showInvestors)
                setShowAngelUpgrades(false)
                setShowManagers(false)
                setShowUnlocks(false)
                setShowUpgrades(false)
                setShowStat(false)
            }

            function onOpenCloseStat() {
                setShowStat(!showStat)
                setShowInvestors(false)
                setShowAngelUpgrades(false)
                setShowManagers(false)
                setShowUnlocks(false)
                setShowUpgrades(false)
            }
        // ---  /Ouverture et Fermeture des fenetres  ---

    // ------ /FONCTIONS D'AFFICHAGE ---------------------------------------

    // ------ FONCTIONS D'EVENEMENT ----------------------------------------

        // Mise à jour de l'affichage de l'argent et du score
        // Appel : à la fin de chaque production
        function onProductionDone(p: Product): void {
            // calcul de la somme obtenue par la production du produit
            let gain = p.revenu * p.quantite * (1 + world.activeangels *  world.angelbonus /100)

            // ============ MAJ MONEY & SCORE ============
            world.money = world.money + gain
            world.score = world.score + gain
            setMoney(world.money + gain) // (afin de mettre à jour l'affichage dynamiquement)
            // ============ MAJ MONEY & SCORE ============

            console.log("Revenu du produit " + p.name + " : " + p.revenu)
        }

        // Mise à jour de l'affichage de l'argent + appel de la mutation "achatProduit" + prise en compte des unlocks
        // Appel : à chaque achat de n = qt produit(s)
        function onProductBuy(qt:number, product: Product) {

            let facture = devis(product,qt) // (Fonction utilitaire qui calcul, à partir de la quantité souhaité, le prix d'achat de n produit)
            
            product.quantite = product.quantite + qt
            product.cout = product.cout*Math.pow(product.croissance, qt)

            // ============ MAJ MONEY & SCORE ============
            world.money = world.money - facture
            setMoney(money - facture) // (afin de mettre à jour l'affichage dynamiquement)
            // ============ MAJ MONEY & SCORE ============

            // Mutation : Appel au back
            achatProduit({ variables: { acheterQtProduitId: product.id, quantite: qt } })

            // Vérification si un palier a été atteint - Unlock de produit
            world.products.forEach(product => {
                product.paliers.forEach(palier =>{
                    if (palier.seuil <= product.quantite && palier.unlocked != true ) {
                        palier.unlocked = true
                        switch (palier.typeratio) {
                            case "vitesse":
                                Math.round(product.vitesse = product.vitesse/palier.ratio)
                                break;
                            case "gain":
                                Math.round(product.revenu = product.revenu*palier.ratio)
                                break;
                            default:
                                break;
                        }
                        // Affichage du Snack Bar avec message adapté
                        setMessageSnackBar(palier.name + " ! ==> "+ palier.typeratio + " x" + palier.ratio)
                        setOpen(true)
                    }
                });
            });

            // Vérification si un palier a été atteint - All Unlock
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
                        world.products.forEach(product => {
                            switch (unlock.typeratio) {
                                case "vitesse":
                                    product.vitesse = Math.round(product.vitesse/unlock.ratio)
                                    break;
                                case "gain":
                                    product.revenu = Math.round(product.revenu*unlock.ratio)
                                    break;
                                default:
                                    break;
                            }
                        })
                        // Affichage du Snack Bar avec message adapté
                        setMessageSnackBar(unlock.name + " ! ==> "+ unlock.typeratio + " x" + unlock.ratio)
                        setOpen(true)
                    }
                }

            });

        }

        // Mise à jour de l'affichage de l'argent + appel de la mutation "engagerManager"
        // Appel : au clic du bouton d'embauche d'un manager
        function onManagerHired(manager: Pallier) {

            // ============ MAJ MONEY ============
            world.money = world.money - manager.seuil
            setMoney(money - manager.seuil)
            // ============ MAJ MONEY ============
            manager.unlocked= true
            world.products[manager.idcible-1].managerUnlocked = true;

            engagerManager({ variables: { name: manager.name } });

            setMessageSnackBar(manager.name + " rejoins l'équipe !")
            setOpen(true)
            
        }

        // Mise à jour de l'affichage de l'argent + Appel de la fonction d'achat d'un upgrade "onUpgradeBought" + mutation "acheterCashUpgrade"
        // Appel : à l'achat d'un upgrade de type cash
        function onCashUpgradeBought(cashUpgrade:Pallier) {
            
            onUpgradeBought(cashUpgrade)

            // ============ MAJ MONEY ============
            world.money -= cashUpgrade.seuil
            setMoney(money - cashUpgrade.seuil)
            // ============ MAJ MONEY ============

            acheterCashUpgrade({ variables: { name: cashUpgrade.name } });

        }

        // Mise à jour de l'affichage des anges + Appel de la fonction d'achat d'un upgrade "onUpgradeBought" + mutation "acheterAngelUpgrade"
        // Appel : à l'achat d'un upgrade de type angel
        function onAngelUpgradeBought(angelUpgrade:Pallier) {
            onUpgradeBought(angelUpgrade)

            world.activeangels -= angelUpgrade.seuil

            acheterAngelUpgrade({ variables: { name: angelUpgrade.name } });
        }

        // Fonction qui mutualise le fonctionnement de l'achat d'upgrade de type cash ou angel
        // Appel : Par les fonctions onCashUpgradeBought et onAngelUpgradeBought
        function onUpgradeBought(upgrade:Pallier) {


            switch (upgrade.typeratio) {
                case "vitesse":
                    if (upgrade.idcible == 0) {
                        world.products.forEach(product => {
                            product.vitesse = product.vitesse/upgrade.ratio
                        });
                    }else{
                        world.products[upgrade.idcible-1].vitesse = world.products[upgrade.idcible-1].vitesse/upgrade.ratio
                    }
                    break;
                case "gain":
                    if (upgrade.idcible == 0) {
                        world.products.forEach(product => {
                            product.revenu = product.revenu*upgrade.ratio
                        });
                    }else{
                        world.products[upgrade.idcible-1].revenu = world.products[upgrade.idcible-1].revenu*upgrade.ratio
                    }
                    break;
                default:
                    break;
            }

            upgrade.unlocked= true

            setMessageSnackBar(upgrade.name + " ! ==> "+ upgrade.typeratio + " x" + upgrade.ratio)
            setOpen(true)
        }

        // Fonction asychrone qui appelle la mutation "resetWorld" puis met à jour le monde à partir des données de retour de la mutation
        // Appel : au clic du bouton de réinitialisation du monde
        async function onResetWorld() {
            // APPELER LA MUTATION
            const { data } = await resetWorld({ variables: { name: username } })
            loadworld = data.resetWorld
            
            setWorld(JSON.parse(JSON.stringify(data.resetWorld)) as World);
        }


    // ------ /FONCTIONS D'EVENEMENT ---------------------------------------


    return (
        <div className="main">

            <div className='dashboard'>
                <div>  <img className='worldImg' src={"http://localhost:4000/" + loadworld.logo} /> <h4>{loadworld.name}</h4> </div> 
                    
                <div className='money'> <h4 dangerouslySetInnerHTML={{__html: transform(world.money)}}></h4> <img onClick={() => onOpenCloseStat()} className='imgMoney moneyDashboard' src={"http://localhost:4000/icones/money.png"}  /></div>
                <div><button className='qtBuy' onClick={switchQtMulti}>{qtmulti}</button>  </div> 
            </div>

            <div className='jeu'>
                <div className='menu_buttons'>
                    <h2>Menu</h2>
                    
                    {showStat && <StatComponent world={world} showStat={showStat} onCloseStat={onOpenCloseStat} />}


                    <Badge badgeContent={badgeManager} color="primary">
                    <Button onClick={onOpenCloseManager}>{showManagers ? 'Cacher Managers' : 'Afficher Managers'}</Button>
                    </Badge>
                    {showManagers && <ManagerComponent world={world} money={world.money} showManagers={showManagers} onCloseManager={onOpenCloseManager} onManagerHired={onManagerHired} />}

                    <Button onClick={onOpenCloseUnlock}>{showUnlocks ? 'Cacher Unlocks' : 'Afficher Unlocks'}</Button>
                    {showUnlocks && <UnlockComponent world={world} money={world.money} showUnlocks={showUnlocks} onCloseUnlock={onOpenCloseUnlock} />}
                    
                    <Badge badgeContent={badgeUpgrade} color="primary">             
                    <Button onClick={onOpenCloseCashUpgrades}>{showUpgrades ? 'Cacher Upgrades' : 'Afficher Upgrades'}</Button>
                    {showUpgrades && <CashUpgradesComponent world={world} money={world.money} showUpgrades={showUpgrades} onCloseCashUpgrades={onOpenCloseCashUpgrades} onUpgradeBought={onCashUpgradeBought} />}
                    </Badge>

                    <Badge badgeContent={badgeAngelUpgrade} color="primary">             
                    <Button onClick={onOpenCloseAngelUpgrades}>{showAngelUpgrades ? 'Cacher Angel Upgrades' : 'Afficher Angel Upgrades'}</Button>
                    {showAngelUpgrades && <AngelComponent world={world} money={world.money} showAngelUpgrades={showAngelUpgrades} onCloseAngel={onOpenCloseAngelUpgrades} onAngelUpgBought={onAngelUpgradeBought} />}
                    </Badge>

                    
                    <Badge badgeContent={badgeReset} color="secondary">             
                    <Button color="secondary" onClick={onOpenCloseInvestors}>{showInvestors ? 'Cacher Investors' : 'Afficher Investisseurs'}</Button>
                    {showInvestors && <InvestorComponent world={world} money={world.money} showInvestors={showInvestors} onCloseInvestors={onOpenCloseInvestors} onResetWorld={onResetWorld} />}
                    </Badge>

                </div>

                <div className='products'> 
                    {world.products.map(product => (
                        <ProductComponent key={"product"+product.id} product={product} onProductBuy={onProductBuy} onProductionDone={onProductionDone} qtmulti={qtmulti} worldmoney={world.money} username={username} />
                    ))}

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










