import {ItemMele} from "../items/itemMele.js";
import {Controleur} from "../../controleur.js";

class Joueur {
    constructor(hp, adrenaline, armure, hotBar, munitions, x, y)
    {
        this.hp = hp;
        this.adrenaline = adrenaline;
        this.armure = armure;
        this.hotBar = hotBar;
        this.munitions = munitions;
        this.x = x;
        this.y = y;
        this.rayonHitBox = 200 * 0.2; //Taille img
        this.centreHitBoxX = this.x;
        this.centreHitBoxY = this.y;
        this.itemEquipe = new ItemMele(0, 1, "Mains", false, 0.2, 40);
        this.estAnimation = false;
        this.tempsAnimation = 0;
        this.mainAleatoire = null;

        this.slots = [null,null,this.itemEquipe,null] //ici on a le slot 1, 2, mele, grenades
    }

    setX(x)
    {
        this.x = x;
        this.centreHitBoxX = this.x;
    }

    setY(y)
    {
        this.y = y;
        this.centreHitBoxY = this.y;
    }

    attaque()
    {
        let chunkXJoueur = Math.floor(this.x / Controleur.tailleChunk);
        let chunkYJoueur = Math.floor(this.y / Controleur.tailleChunk);

        // Vérifier si le chunk actuel est défini
        if (Controleur.world.chunks[chunkYJoueur + (chunkXJoueur * Controleur.world.size)] === undefined) {
            return false;
        }

        let positionChunkActuelDansTab = chunkYJoueur + (chunkXJoueur * Controleur.world.size);

        // Vérification des chunks autour du joueur, avec prise en compte de la portée de l'attaque
        let range = 2;  // Définir une portée d'attaque (par exemple, 2 chunks autour du joueur)
        let tabVerif = [];

        // Remplir le tableau des chunks à vérifier en fonction de la portée
        for (let i = -range; i <= range; i++) {
            for (let j = -range; j <= range; j++) {
                let chunkX = chunkXJoueur + i;
                let chunkY = chunkYJoueur + j;

                if (chunkX >= 0 && chunkX < Controleur.world.size && chunkY >= 0 && chunkY < Controleur.world.size) {
                    let position = chunkY + (chunkX * Controleur.world.size);
                    tabVerif.push(position);
                }
            }
        }

        // Vérifier les obstacles dans les chunks à proximité
        for (let j = 0; j < tabVerif.length; j++)
        {
            if (Controleur.world.chunks[tabVerif[j]] !== undefined)
            {
                for (let i = 0; i < Controleur.world.chunks[tabVerif[j]].obstacles.length; i++)
                {
                    if (Controleur.world.chunks[tabVerif[j]].obstacles[i] !== undefined)
                    {
                        // Vérifier si l'obstacle est frappé par l'attaque
                        if (Controleur.world.chunks[tabVerif[j]].obstacles[i].estFrapper(this.itemEquipe))
                        {
                            Controleur.world.chunks[tabVerif[j]].obstacles[i].setDmg(this.itemEquipe.dmg);
                        }
                    }
                }
            }
        }
    }
}

export {Joueur}