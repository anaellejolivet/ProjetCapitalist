function saveWorld(context) {
  const fs = require('fs');
  fs.writeFile("userworlds/" + context.user + "-world.json",
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
  Mutation: {},
};
