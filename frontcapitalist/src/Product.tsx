import './css/App.css';
import './css/Product.css';
import {Product} from './world';
import MyProgressbar, { Orientation} from './MyProgressbar';
import { useState } from 'react';
import { useInterval } from './MyInterval';
import { devis, transform } from './utils';
import { gql, useMutation } from '@apollo/client';
import Button from '@mui/material/Button';



type ProductProps = {
    product: Product
    onProductionDone: (product: Product) => void,
    onProductBuy: (qt: number, product: Product) => void,
    qtmulti: string
    worldmoney: number
    username: string
}

export default function ProductComponent({product, onProductBuy, onProductionDone, qtmulti, worldmoney, username} : ProductProps) { 

    const [run, setRun] = useState(false);
    
    // METTRE LASTUPDATE EN USEREF ?
    const [lastupdate, setLastUpdate] = useState(Date.now());
    useInterval(() => calcScore(), 100)
    
    // ------ MUTATION ---------------------------------------------

    const LANCER_PRODUCTION = gql`
        mutation lancerProductionProduit($id: Int!) {
            lancerProductionProduit(id: $id) {
                id
            }
        }`

    const [lancerProduction] = useMutation(LANCER_PRODUCTION,
        { context: { headers: { "x-user": username }},
            onError: (error): void => {
            // actions en cas d'erreur
            }
        }
    )
    // ------ /MUTATION ---------------------------------------------

    // Retourne le prix d'achat du produit en fonction de la qt souhaitée, à l'aide des fonctions utilitaires "transform" et "devis"
    function prixAfficher(): string{
        let montant
        let maxCanBuy = calcMaxCanBuy()

        if ( (qtmulti == "Max" && maxCanBuy == 0) || (qtmulti !== "Max" && maxCanBuy < parseInt(qtmulti.substring(1))) ) {
            if (qtmulti == "Max"){
                montant = "Prix : Pas assez d'argent ! - " + transform(devis(product,calcMaxCanBuy()))
            }
            else{
                montant = "Prix : Pas assez d'argent ! - " + transform(devis(product, parseInt(qtmulti.substring(1))))
            }
        }else{
            if (qtmulti == "Max"){
                montant = transform(devis(product,calcMaxCanBuy()))
            }
            else{
                montant = transform(devis(product, parseInt(qtmulti.substring(1))))
            }
        }

        return montant
    }

    // Active ou désactive le bouton d'achat en retournant respectivement false ou true si les fonds sont suffisants
    function desactiverButton() {
        let maxCanBuy = calcMaxCanBuy()
        if ( (qtmulti == "Max" && maxCanBuy == 0) || (qtmulti !== "Max" && maxCanBuy < parseInt(qtmulti.substring(1))) ) {
            return true
            
        }else{
            return false
        }
    }
    
    // Au clic du bouton d'achat d'un produit, appelle la fonction "onProductBuy" du composant MAIN avec les paramètres adequats à la quantité souhaitée
    function onBuyProduct() {

        let maxCanBuy = calcMaxCanBuy()

        switch (qtmulti) {
            case "x1" :
            case "x10" :
            case "x100":

                let qtmulti_Int = parseInt(qtmulti.substring(1))

                if (qtmulti_Int <= maxCanBuy ) {
                    onProductBuy(qtmulti_Int,product)
                }
                break;
            case "Max":
                if (maxCanBuy > 0) {
                    onProductBuy(maxCanBuy,product)
                }
                break;
            default:
                break;
        }
    }

    // Au clic sur un produit, lance sa production si le produit n'est pas déjà en cours de production 
    function onProduceProduct(){
        if(product.timeleft == 0 && product.quantite > 0){
            setRun(true)
            product.timeleft = product.vitesse
            setLastUpdate(Date.now())
        }
    }
    
    // Calcul la quantité de produit maximal que l'on peut acheter avec notre argent
    function calcMaxCanBuy(): number{
        let prix = product.cout
        let maxCanBuy = 0
        let somme = product.cout

        while (worldmoney >= somme) {
            prix = prix*product.croissance
            somme = somme + prix
            maxCanBuy ++
        }
        return maxCanBuy
    }

    // Fonction appellée à un interval de temps regulier (100ms) afin de mettre à jour la progression de la production du produit
    function calcScore(): void {

        // si le produit est en cours de production => mise à jour du timeleft
        if (product.timeleft !== 0) {
            product.timeleft = product.timeleft - (Date.now() - lastupdate)
            setLastUpdate(Date.now())
        }

        // si la production est terminée OU si (le manager du produit est debloqué ET que la production n'est pas en cours)
        if (product.timeleft < 0 || (product.managerUnlocked && product.timeleft==0 )) {
            
            setLastUpdate(Date.now()) 

            // si le manager est débloqué
            if (product.managerUnlocked) { 
                // on relance la production
                setRun(true) 
                product.timeleft = product.vitesse
            }else{
                lancerProduction({ variables: { id: product.id } });
                // on stop la production
                product.timeleft = 0
                setRun(false) 
            }
            // quand la production est terminée, on prévient le composant parent qui notifie le serveur
            onProductionDone(product)
        }
    }

    // Affichage de la quantité d'achat sur le bouton d'achat (si le bouton est mis sur max, on affiche le max que l'on peut acheter)
    function displayQtAchat(): String {
        if (qtmulti == "Max") {
            return calcMaxCanBuy().toString()
        }else{
            return qtmulti
        }
    }

    return (
        <div className="product">

            <div className='p_firstSection'>
                <img src={"http://localhost:4000/"+ product.logo} width='55px' onClick={onProduceProduct} />
                <div><p>{product.quantite}</p></div>
            </div>
            
            <div className='p_secondSection'>
                <h2>{product.name}</h2>
                { product.quantite > 0 && 
                    <div className='progressBar'>

                        <MyProgressbar className="barstyle" vitesse={product.vitesse}
                        initialvalue={product.vitesse - product.timeleft}
                        run={run} frontcolor="#eeb63c" backcolor="#3c3c3c"
                        auto={product.managerUnlocked}
                        orientation={Orientation.horizontal} />

                        <div className='timeleft'>{product.timeleft}</div>

                    </div>
                }     

                <Button
                    disabled={desactiverButton()}
                    onClick={onBuyProduct}
                    id={"buyProduct" + product.id.toString()}
                    style={{display : "flex", flexDirection : "column"}}
                    >
                    <span> Acheter{" (" + displayQtAchat() + ") "}</span>
                    <span style={{marginLeft : "10px"}} dangerouslySetInnerHTML={{__html: prixAfficher() }} />
                </Button>            

            </div>
        </div>
    );

}
