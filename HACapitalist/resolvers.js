function saveWorld(context) {
  //update de la date de dernière sauvegarde du monde
  context.world.lastupdate = Date.now().toString();
  const fs = require("fs").promises;
  fs.writeFile(
    //création du ficher de l'utilisateur
    "userworlds/" + context.user + "-world.json",
    JSON.stringify(context.world),
    (err) => {
      if (err) {
        console.error(err);
        throw new Error(`Erreur d'écriture du monde coté serveur`);
      }
    }
  );
}

function majScore(context) {
  let world = context.world;
  let produits = world.products;
  produits.forEach ((produit) => {
    //temps écoulé depuis la dernière action sur le monde
    //resultat en  Int
    let tempsEcoule = Date.now() - parseInt(world.lastupdate);

    //Cas 1 : produit avec manager unlock (produiction automatique)
    if (produit.managerUnlocked) {
      tempsEcoule = tempsEcoule - produit.timeleft;
      if (tempsEcoule < 0) {
        produit.timeleft -= tempsEcoule;
      } else {
        //division entière
        let nbProduction = Math.floor(tempsEcoule / produit.vitesse);
        //temps restant avec le reste de la division
        produit.timeleft = tempsEcoule % produit.vitesse;
        //on met a jour le score et la money
        world.score += produit.revenu * produit.quantite * nbProduction * (1 + world.activeangels *  world.angelbonus /100);
        world.money += produit.revenu * produit.quantite * nbProduction * (1 + world.activeangels *  world.angelbonus /100);
      }
    } 
    // Cas 2 : produit sans manager 
    else {
      if (produit.timeleft != 0) {
        if (produit.timeleft <= tempsEcoule) {
          //on met a jour le score et la money
          world.score += produit.revenu * produit.quantite * (1 + world.activeangels *  world.angelbonus /100);
          world.money += produit.revenu * produit.quantite * (1 + world.activeangels *  world.angelbonus /100);
          produit.timeleft = 0;
        } else {
          produit.timeleft -= tempsEcoule;
        }
      }
    }
  })
}

//fonction pour appliquer les allunlocked, palier d'un produit, cashUpgrade
function appliquerBonus(palier, context) {
  let produitid = palier.idcible;
  let produits = [];
  //Cas 1 : idcible est associé à un produit (entre 1 et 6)
  if (produitid != 0) {
    produits.push(context.world.products.find((p) => p.id === produitid));
  } 
  //Cas 2 : idcible pour tout les produits (0)
  else {
    produits = context.world.products;
  }
  produits.forEach((produit) => {
    if (palier.typeratio == "vitesse") {
      //reduction du temps de production
      produit.vitesse = Math.round(produit.vitesse / palier.ratio);
    } else {
      //augmentation du revenu 
      produit.revenu = Math.round(produit.revenu * palier.ratio);
    }
  });
}

//fonction verifiant à l'achat d'un produit si il débloque un allunlock (palier commun pour tout les produits)
function allunlocks(context) {
  allunlocks = context.world.allunlocks.filter((allunlock) => !allunlock.unlocked);
  products = context.world.products;
  allunlocks.forEach((allunlock) => {
    allunlock.unlocked = true;
    //si la quantité d'un des produits ne dépasse pas le seuil du allunlock on ne le débloque pas
    products.forEach((product)=>{
      if(product.quantite < allunlock.seuil){
        allunlock.unlocked = false;
      }
    })
    if(allunlock.unlocked){
      appliquerBonus(allunlock, context);
    }
  });
}

module.exports = {
  Query: {
    getWorld(parent, args, context) {
      majScore(context);
      saveWorld(context);
      return context.world;
    },
  },
  Mutation: {
    acheterQtProduit(parent, args, context) {
      majScore(context);
      let world = context.world;

      let produitid = args.id;
      let produitquantite = args.quantite;

      let produit = world.products.find((p) => p.id === produitid);

      let paliers = produit.paliers;
      if (produit === undefined) {
        throw new Error(`Le produit avec l'id ${args.id} n'existe pas`);
      } else {
        produit.quantite += produitquantite,
        world.money -= produit.cout * ((1-Math.pow(produit.croissance, produitquantite))/(1-produit.croissance))
        produit.cout = produit.cout * Math.pow(produit.croissance, produitquantite);

        //on filtre les paliers qui ne sont pas déjà débloqués et dont la quantité de produit est supérieur au seuil du palier
        paliers = paliers.filter((palier) => !palier.unlocked && produit.quantite >= palier.seuil);

        //on déploque les paliers et on applique leur bonus
        paliers.forEach((palier) => {
          palier.unlocked = true;
          appliquerBonus(palier, context);
        });

        //on verifie les allunlocks
        allunlocks(context);
        saveWorld(context);
      }
      return produit;
    },

    lancerProductionProduit(parent, args, context) {
      majScore(context);
      let world = context.world;

      let produitid = args.id;

      let produit = world.products.find((p) => p.id === produitid);

      if (produit === undefined) {
        throw new Error(`Le produit avec l'id ${args.id} n'existe pas`);
      } else {
        produit.timeleft = Math.round(produit.vitesse);
        saveWorld(context);
      }
      return produit;
    },

    engagerManager(parent, args, context) {
      majScore(context);
      let world = context.world;
      let managername = args.name;

      let manager = world.managers.find((m) => m.name === managername);

      let produit = world.products.find((p) => p.id === manager.idcible);
      if (manager === undefined) {
        throw new Error(`Le manager avec le nom ${args.name} n'existe pas`);
      } else {
        produit.managerUnlocked = true, 
        manager.unlocked = true,
        console.log(manager.seuil)
        world.money -= manager.seuil
        saveWorld(context);
      }
      return manager;
    },

    acheterCashUpgrade(parent, args, context) {
      majScore(context);
      let world = context.world;
      let cashUpgradeName = args.name;

      let cashUpgrade = world.upgrades.find((u) => u.name === cashUpgradeName);

      if (cashUpgrade === undefined) {
        throw new Error(`L'update avec le nom ${args.name} n'existe pas`);
      } else {
        cashUpgrade.unlocked = true;
        world.money -= cashUpgrade.seuil;
        //on applique le bonus de l'upgrade
        appliquerBonus(cashUpgrade, context);
        saveWorld(context);
      }

      return cashUpgrade;
    },
    acheterAngelUpgrade(parent, args, context) {
      majScore(context);
      let world = context.world;
      let angelUpgradeName = args.name;

      let angelUpgrade = world.angelupgrades.find((u) => u.name === angelUpgradeName);

      if (angelUpgrade === undefined) {
        throw new Error(`L'angel update avec le nom ${args.name} n'existe pas`);
      } else {
        angelUpgrade.unlocked = true;
        world.activeangels -= angelUpgrade.seuil;
        //on applique le bonus de l'upgrade
        appliquerBonus(angelUpgrade, context);
        saveWorld(context);
      }

      return angelUpgrade;
    },
    resetWorld(parent, args, context) {
      majScore(context);
      let world = context.world;
      let nbanges = Math.floor(150 * Math.sqrt(world.score/Math.pow(10, 15))-world.totalangels);
      let activeangels = world.activeangels + nbanges;
      let totalangels = world.totalangels + nbanges;      
      let score = world.score

      context.world = require("./world");
      context.world.activeangels = activeangels;
      context.world.totalangels = totalangels;
      context.world.score = score;
      saveWorld(context);
      return context.world;
    },
  },
};
