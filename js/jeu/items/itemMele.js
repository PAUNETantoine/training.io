import {Items} from "./items.js";

class ItemMele extends Items
{
    constructor(id, quantite, nom, jetable, range, distanceJoueur) {
        super(id, quantite, nom, jetable);
        this.dmg = 24;
        this.cooldown = 0.40;
        this.range = range; //pixels
        this.distanceJoueur = distanceJoueur;
        this.xHitboxHaut = 0;
        this.yHitboxHaut = 0;
        this.xHitboxBas = 0;
        this.yHitboxBas = 0;


    }
}

export { ItemMele }