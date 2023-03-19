import { Product } from "./world";

// Transformation d'un nombre en chaine de caractère de ce nombre en puissance de 10
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

// Calcul, à partir de la quantité souhaité, le prix d'achat de n produit
// Appel : Lors de l'achat d'un produit et pour l'affichage du prix d'achat de n produits sur le bouton achat
export function devis(product: Product, qt: number): number{

    let prix = product.cout
    let somme = product.cout

    for (let i = 1; i < qt; i++) {
        prix = prix*product.croissance
        somme = somme + prix
    }

    return somme
}
   