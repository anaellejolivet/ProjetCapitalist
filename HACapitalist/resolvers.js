function saveWorld(context) {
  context.world.lastupdate = Date.now().toString();
  const fs = require("fs").promises;
  fs.writeFile(
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
  console.log("maj score");
  let world = context.world;
  let produits = world.products;
  for (var i = 0; i < produits.length; i++) {
    let tempsEcoule = Date.now() - parseInt(world.lastupdate);
    let produit = produits[i];
    if (produit.managerUnlocked) {
      tempsEcoule = tempsEcoule - produit.timeleft;

      if (tempsEcoule < 0) {
        produit.timeleft -= tempsEcoule;
      } else {
        //division entière
        let nbProduction = Math.floor(tempsEcoule, produit.vitesse) + 1;
        //temps restant avec le reste de la division
        produit.timeleft = tempsEcoule % produit.vitesse;
        //on met a jour le score et la money
        world.score += produit.revenu * produit.quantite * nbProduction;
        world.money += produit.revenu * produit.quantite * nbProduction;
      }
    } else {
      if (produit.timeleft != 0) {
        if (produit.timeleft <= tempsEcoule) {
          //on met a jour le score et la money
          world.score += produit.revenu * produit.quantite;
          world.money += produit.revenu * produit.quantite;
        } else {
          produit.timeleft -= tempsEcoule;
        }
      }
    }
  }
}
function appliquerBonus(palier, context) {
  let produitid = palier.idcible;
  let produits = [];
  if (produitid != 0) {
    produits = context.world.products.find((p) => p.id === produitid);
  } else {
    produits = context.world.products;
  }
  produits.forEach((produit) => {
    if (palier.typeratio == "vitesse") {
      produit.vitesse = produit.vitesse / palier.ratio;
    } else if (palier.typeratio == "gain") {
      produit.revenu = produit.revenu * palier.ratio;
    }
  });
}
function allunlocks(context) {
  allunlocks = allunlocks.filter((allunlock) => !allunlock.unlocked);
  products = context.world.products;
  allunlocks.forEach((allunlock) => {
    allunlock.unlocked = true;
    products.forEach((product)=>{
      if(product.quantite <= allunlock.seuil){
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
        (produit.quantite += produitquantite),
          (world.money -=
            produit.cout * Math.pow(produit.croissance, produitquantite - 1)),
          (produit.cout =
            produit.cout * Math.pow(produit.croissance, produitquantite));

        paliers = paliers.filter(
          (palier) => !palier.unlocked && produit.quantite >= palier.seuil
        );
        paliers.forEach((palier) => {
          palier.unlocked = true;
          appliquerBonus(palier, context);
        });
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
        produit.timeleft = produit.vitesse;
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
        (produit.managerUnlocked = true), (manager.unlocked = true);
        world.money -= manager.seuil;
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
        appliquerBonus(cashUpgrade, context);
        saveWorld(context);
      }

      return cashUpgrade;
    },
  },
};
