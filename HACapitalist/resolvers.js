function saveWorld(context) {
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
module.exports = {
  Query: {
    getWorld(parent, args, context) {
      saveWorld(context);
      return context.world;
    },
  },
  Mutation: {
    acheterQtProduit(parent, args, context) {
      let world = context.world;

      let produitid = args.id;
      let produitquantite = args.quantite;

      let produit = world.products.find((p) => p.id === produitid);

      if (produit === undefined) {
        throw new Error(`Le produit avec l'id ${args.id} n'existe pas`);
      } else {
        produit.quantite += produitquantite,
          world.money -= produit.cout,
          produit.cout = produit.cout * produit.croissance
        saveWorld(context);
      }
      return produit;
    },
    lancerProductionProduit(parent, args, context) {
      let world = context.world;

      let produitid = args.id;

      let produit = world.products.find((p) => p.id === produitid);

      if (produit === undefined) {
        throw new Error(`Le produit avec l'id ${args.id} n'existe pas`);
      } else {
        (produit.timeleft = produit.vitesse), (world.lastupdate = Date.now());
        saveWorld(context);
      }
      return produit;
    },
    engagerManager(parent, args, context) {
      let world = context.world;

      console.log(args);
      let managername = args.name;

      let manager = world.managers.find((m) => m.name === managername);

      if (manager === undefined) {
        throw new Error(`Le manager avec le nom ${args.name} n'existe pas`);
      } else {
        let produit = world.products.find((p) => p.id === idcible);

        (produit.managerUnlock = true), (manager.unlocked = true);
        saveWorld(context);
      }
      return produit;
    },
  },
};
