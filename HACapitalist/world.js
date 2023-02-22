module.exports = {
    "name": "Egypte antique",
    "logo": "public/icones/logoworld.png",
    "money": 0,
    "score": 0,
    "totalangels": 0,
    "activeangels": 0,
    "angelbonus": 2,
    "lastupdate": 0,
    "products": [
        {
            "id": 1,
            "name": "Papyrus",
            "logo": "public/icones/papyrus.png", "cout": 4,
            "croissance": 1.07,
            "revenu": 1,
            "vitesse": 500,
            "quantite": 1,
            "timeleft": 0,
            "managerUnlocked": false, 
            "paliers": [
                {
                    "name": "Papyrus 1", 
                    "logo": "public/icones/papyrus.png", 
                    "seuil": 20,
                    "idcible": 1,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": false
                }, 
                {
                    "name": "Papyrus 2", 
                    "logo": "public/icones/papyrus.png", 
                    "seuil": 75,
                    "idcible": 1,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": false
                }]
        },
        {
            "id": 2,
            "name": "Chat",
            "logo": "public/icones/chat.png", "cout": 60,
            "croissance": 1.15,
            "revenu": 60,
            "vitesse": 3000,
            "quantite": 0,
            "timeleft": 0,
            "managerUnlocked": false, 
            "paliers": [
                {
                    "name": "Chat 1", 
                    "logo": "public/icones/chat.png", 
                    "seuil": 20,
                    "idcible": 2,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": false
                }, 
                {
                    "name": "Chat 2", 
                    "logo": "public/icones/chat.png", 
                    "seuil": 75,
                    "idcible": 2,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": false
                }]
        },
        {
            "id": 3,
            "name": "Batton",
            "logo": "public/icones/batton.png", "cout": 720,
            "croissance": 1.14,
            "revenu": 540,
            "vitesse": 6000,
            "quantite": 0,
            "timeleft": 0,
            "managerUnlocked": false, 
            "paliers": [
                {
                    "name": "Batton 1", 
                    "logo": "public/icones/batton.png", 
                    "seuil": 20,
                    "idcible": 3,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": false
                }, 
                {
                    "name": "Batton 2", 
                    "logo": "public/icones/batton.png", 
                    "seuil": 75,
                    "idcible": 3,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": false
                }]
        },
        {
            "id": 4,
            "name": "Oeuil de Ra",
            "logo": "public/icones/ra.png", "cout": 8640,
            "croissance": 1.13,
            "revenu": 4320,
            "vitesse": 12000,
            "quantite": 0,
            "timeleft": 0,
            "managerUnlocked": false, 
            "paliers": [
                {
                    "name": "Oeuil de Ra 1", 
                    "logo": "public/icones/ra.png", 
                    "seuil": 20,
                    "idcible": 4,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": false
                }, 
                {
                    "name": "Oeuil de Ra 2", 
                    "logo": "public/icones/ra.png", 
                    "seuil": 75,
                    "idcible": 4,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": false
                }]
        },
        {
            "id": 5,
            "name": "Isis",
            "logo": "public/icones/isis.png", "cout": 103680,
            "croissance": 1.12,
            "revenu": 51840,
            "vitesse": 24000,
            "quantite": 0,
            "timeleft": 0,
            "managerUnlocked": false, 
            "paliers": [
                {
                    "name": "Isis 1", 
                    "logo": "public/icones/isis.png", 
                    "seuil": 20,
                    "idcible": 5,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": false
                }, 
                {
                    "name": "Isis 2", 
                    "logo": "public/icones/isis.png", 
                    "seuil": 75,
                    "idcible": 5,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": false
                }]
        },
        {
            "id": 6,
            "name": "Pharaon",
            "logo": "public/icones/pharaon.png", "cout": 1244160,
            "croissance": 1.11,
            "revenu": 622080,
            "vitesse": 96000,
            "quantite": 0,
            "timeleft": 0,
            "managerUnlocked": false, 
            "paliers": [
                {
                    "name": "Pharaon 1", 
                    "logo": "public/icones/pharaon.png", 
                    "seuil": 20,
                    "idcible": 6,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": false
                }, 
                {
                    "name": "Pharaon 2", 
                    "logo": "public/icones/pharaon.png", 
                    "seuil": 75,
                    "idcible": 6,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": false
                }]
        }
    ],
    "allunlocks": [
        {
            "name": "Nom du premier unlock général", 
            "logo": "icones/premierunlock.jpg", 
            "seuil": 30,
            "idcible": 0,
            "ratio": 2,
            "typeratio": "gain",
            "unlocked": false
        },
    ],
    "upgrades": [
        {
            "name": "Nom du premier upgrade", 
            "logo": "icones/premierupgrade.jpg", 
            "seuil": 1e3,
            "idcible": 1,
            "ratio": 3,
            "typeratio": "gain",
            "unlocked": false
        },
    ],
    "angelupgrades": [
        {
            "name": "Sphynx",
            "logo": "icones/angel.png",
            "seuil": 10,
            "idcible": 0,
            "ratio": 3,
            "typeratio": "gain",
            "unlocked": false
        },
    ],
    "managers": [
        {
            "name": "Wangari Maathai",
            "logo": "icones/WangariMaathai.jpg", 
            "seuil": 10,
            "idcible": 1,
            "ratio": 0,
            "typeratio": "gain",
            "unlocked": false
        },
    ]
};