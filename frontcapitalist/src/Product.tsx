import './App.css';
import {Product} from './world';
import MyProgressbar, { Orientation} from './MyProgressbar';
import oeil from './images/oeil-de-ra.png'
import {useState} from 'react';
import { useInterval } from './MyInterval';
import { devis, transform } from './utils';



type ProductProps = {
    product: Product
    onProductionDone: (product: Product) => void,
    onProductBuy: (qt: number, product: Product) => void,
    //services: Services
    qtmulti: string
    worldmoney: number
}

// export default function ProductComponent({product, onProductionDone, services} : ProductProps) { 
export default function ProductComponent({product, onProductBuy, onProductionDone, qtmulti, worldmoney} : ProductProps) { 

    const [quantite, setQuantite] = useState(product.quantite);
    const [run, setRun] = useState(false);
    const [lastupdate, setLastUpdate] = useState(Date.now());

    function prixAfficher(): String{
        let blablou
        let maxCanBuy = calcMaxCanBuy()

        if ( (qtmulti == "Max" && maxCanBuy == 0) || (qtmulti !== "Max" && maxCanBuy < parseInt(qtmulti.substring(1))) ) {
            blablou = "Not enough money"

        }else{

            if (qtmulti == "Max"){
                // console.log("calcmaxcanbuy"+calcMaxCanBuy())
                blablou = transform(devis(product,calcMaxCanBuy()))
            }
            else{
                blablou = transform(devis(product, parseInt(qtmulti.substring(1))))
                // console.log("blablou ici" + blablou)    
            }
        }

        return blablou
    }

    function desactiverButton() {
        let maxCanBuy = calcMaxCanBuy()
        if ( (qtmulti == "Max" && maxCanBuy == 0) || (qtmulti !== "Max" && maxCanBuy < parseInt(qtmulti.substring(1))) ) {
            return true
            
        }else{
            return false
        }

    }
    
    useInterval(() => calcScore(), 100)


    
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
        console.log("Cout produit :" + product.cout)
        // console.log("Croissant :" + product.croissance)
        

        switch (qtmulti) {
            case "x1" :
            case "x10" :
            case "x100":
                console.log("là peut etre ?")

                let qtmulti_Int = parseInt(qtmulti.substring(1))

                if (qtmulti_Int <= maxCanBuy ) {
                    console.log("j'arrvie ici")
                    // APPEL DE LA FONCTION ON PRODUCT BUY A LA PLACE
                    // setQuantite(product.quantite + qtmulti_Int)
                    // product.quantite = product.quantite + qtmulti_Int
                    // worldmoney = worldmoney - product.cout
                    // APPEL DE LA FONCTION ON PRODUCT BUY A LA PLACE
                    onProductBuy(qtmulti_Int,product)
                    product.cout = product.cout*Math.pow(product.croissance, qtmulti_Int)

                }
                break;
            case "Max":
                if (maxCanBuy > 0) {

                    // APPEL DE LA FONCTION ON PRODUCT BUY A LA PLACE
                    // setQuantite(product.quantite + maxCanBuy)
                    // product.quantite = product.quantite + maxCanBuy
                    // worldmoney = worldmoney - product.cout
                    // APPEL DE LA FONCTION ON PRODUCT BUY A LA PLACE
                    onProductBuy(maxCanBuy,product)

                    product.cout = product.cout*Math.pow(product.croissance, maxCanBuy)
                    console.log("Bonjour la baguette")
                }
                break;
            default:
                break;
        }
    }

    function calcMaxCanBuy(): number{
        let prix = product.cout
        let maxCanBuy = 0
        while (worldmoney >= prix) {
            prix = prix*product.croissance
            maxCanBuy ++
        }
        return maxCanBuy
    }


    function calcScore(): void {
        //  console.log("time left :" + product.timeleft)
        //  console.log("last update :" + ( Date.now() - lastupdate))

        if (product.timeleft !== 0) {
            product.timeleft = product.timeleft - (Date.now() - lastupdate)
            setLastUpdate(Date.now())
        }
        //product.timeleft = product.timeleft - lastupdate - Date.now()
    
        if (product.timeleft < 0) {
            product.timeleft = 0
            setRun(false)         
            // quand la production est terminée, on prévient le composant parent
            onProductionDone(product)
        }
    }


    return (
        <div className="product">

            <img src={oeil} width='55px' onClick={produceProduct} />

            <p>prix unité : {transform(product.cout)}</p>
            <div><p>{product.quantite}</p></div>

            <button disabled={desactiverButton()} onClick={buyProduct} id={"buyProduct" + product.id.toString()} >Buy {qtmulti} (Price : {

            prixAfficher()
            
            })</button>

            <MyProgressbar className="barstyle" vitesse={product.vitesse}
            initialvalue={product.vitesse - product.timeleft}
            run={run} frontcolor="#ff8400" backcolor="#feffff"
            auto={product.managerUnlocked}
            orientation={Orientation.horizontal} />
        </div>
    );

}






