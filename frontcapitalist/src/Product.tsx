import './css/App.css';
import './css/Product.css';
import {Product} from './world';
import MyProgressbar, { Orientation} from './MyProgressbar';
import oeil from './images/oeil-de-ra.png'
import {useEffect, useState} from 'react';
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

// export default function ProductComponent({product, onProductionDone, services} : ProductProps) { 
export default function ProductComponent({product, onProductBuy, onProductionDone, qtmulti, worldmoney, username} : ProductProps) { 

    const [run, setRun] = useState(false);
    
    // METTRE LASTUPDATE EN USEREF
    const [lastupdate, setLastUpdate] = useState(Date.now());
    useInterval(() => calcScore(), 100)

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

    function desactiverButton() {
        let maxCanBuy = calcMaxCanBuy()
        if ( (qtmulti == "Max" && maxCanBuy == 0) || (qtmulti !== "Max" && maxCanBuy < parseInt(qtmulti.substring(1))) ) {
            return true
            
        }else{
            return false
        }

    }
    
    function produceProduct(){
        if(product.timeleft == 0 && product.quantite > 0){
            setRun(true)
            product.timeleft = product.vitesse
            setLastUpdate(Date.now())
        }
    }
    
    function buyProduct() {

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

    function calcScore(): void {

        if (product.timeleft !== 0) {
            product.timeleft = product.timeleft - (Date.now() - lastupdate)
            setLastUpdate(Date.now())
        }

        if (product.timeleft < 0 || (product.managerUnlocked && product.timeleft==0 )) {
            setLastUpdate(Date.now())
            if (product.managerUnlocked) {
                setRun(true)
                product.timeleft = product.vitesse
            }else{
                lancerProduction({ variables: { id: product.id } });
                product.timeleft = 0
                setRun(false)
            }
            // quand la production est terminée, on prévient le composant parent et on notifie le serveur
            onProductionDone(product)
        }
    }

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
                <img src={"http://localhost:4000/"+ product.logo} width='55px' onClick={produceProduct} />
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
                onClick={buyProduct}
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
