import { Product } from "./world";

export function transform(valeur: number): string {
    let res : string = "";
    if (valeur < 1000)
    res = valeur.toFixed(2);
    else if (valeur < 1000000)
    res = valeur.toFixed(0);
    else if (valeur >= 1000000) {
    res = valeur.toPrecision(4);
    res = res.replace(/e\+(.*)/, " 10<sup>$1</sup>");
    }
    return res;
}

export function devis(product: Product, qt: number): number{
    // console.log(qt)
    // console.log("le cout d'un produit dans utils"+qt)
    let prix = product.cout
    let somme = product.cout

    for (let i = 1; i < qt; i++) {
        prix = prix*product.croissance
        somme = somme + prix
    }

    // console.log("montant ici : " + montant)
    return somme

}
   