import './App.css';
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
    //services: Services
    qtmulti: string
    worldmoney: number
    username: string
}

// export default function ProductComponent({product, onProductionDone, services} : ProductProps) { 
export default function ProductComponent({product, onProductBuy, onProductionDone, qtmulti, worldmoney, username} : ProductProps) { 

    const [quantite, setQuantite] = useState(product.quantite);
    const [run, setRun] = useState(false);
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

    useEffect(() => {

      }, []);
           

    function prixAfficher(): String{
        let montant
        let maxCanBuy = calcMaxCanBuy()

        if ( (qtmulti == "Max" && maxCanBuy == 0) || (qtmulti !== "Max" && maxCanBuy < parseInt(qtmulti.substring(1))) ) {
            montant = "Not enough money"

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
        setRun(true)
        product.timeleft = product.vitesse
        setLastUpdate(Date.now())
    }
    
    function buyProduct() {

        let maxCanBuy = calcMaxCanBuy()

        // console.log("Argent dans la pocket : " + worldmoney)
        // console.log("Max Can Buy :" + maxCanBuy)
        // console.log("Quantité desirée :" + qtmulti)
        // console.log("Quantité produit :" + product.quantite)
        //console.log("Cout produit :" + product.cout)
        // console.log("Croissant :" + product.croissance)

        switch (qtmulti) {
            case "x1" :
            case "x10" :
            case "x100":
                //console.log("là peut etre ?")

                let qtmulti_Int = parseInt(qtmulti.substring(1))

                if (qtmulti_Int <= maxCanBuy ) {
                    // console.log("j'arrvie ici")
                    // APPEL DE LA FONCTION ON PRODUCT BUY A LA PLACE
                    // setQuantite(product.quantite + qtmulti_Int)
                    // product.quantite = product.quantite + qtmulti_Int
                    // worldmoney = worldmoney - product.cout
                    // APPEL DE LA FONCTION ON PRODUCT BUY A LA PLACE
                    onProductBuy(qtmulti_Int,product)
                }
                break;
            case "Max":
                if (maxCanBuy > 0) {
                    // APPEL DE LA FONCTION ON PRODUCT BUY A LA PLACE
                    // setQuantite(product.quantite + maxCanBuy)
                    // product.quantite = product.quantite + maxCanBuy
                    // worldmoney = worldmoney - product.cout
                    // APPEL DE LA FONCTION ON PRODUCT BUY A LA PLACE
                    console.log(maxCanBuy)
                    onProductBuy(maxCanBuy,product)
                }
                break;
            default:
                break;
        }
    }

    function calcMaxCanBuy(): number{
        //console.log("Prix du produit =>  "+product.cout)
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

    return (
        <div className="product">

            <div className='p_firstSection'>
                <img src={oeil} width='55px' onClick={produceProduct} />
                <div><p>{product.quantite}</p></div>
            </div>
            
            <div className='p_secondSection'>
                { product.quantite > 0 && 
                    <MyProgressbar className="barstyle" vitesse={product.vitesse}
                    initialvalue={product.vitesse - product.timeleft}
                    run={run} frontcolor="#ff8400" backcolor="#feffff"
                    auto={product.managerUnlocked}
                    orientation={Orientation.horizontal} />
                }           
                <Button disabled={desactiverButton()} onClick={buyProduct} id={"buyProduct" + product.id.toString()} >Buy {qtmulti} (Price : {
                prixAfficher()
                })</Button>
            </div>
            
        </div>
    );

}
