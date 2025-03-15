import {Controleur} from "../../controleur.js";
import {ItemMele} from "../items/itemMele.js";
import {ItemSol} from "./itemSol.js";

class ObstacleDef {

    static imgArbre = (() => {
        const img = new Image();
        img.src = "../../images/obstacles/2.png";
        return img;
    })();

    static imgCaisse = (() => {
        const img = new Image();
        img.src = "../../images/obstacles/1.png";
        return img;
    })();

    static imgBuisson = (() => {
        const img = new Image();
        img.src = "../../images/obstacles/0.png";
        return img;
    })();


    constructor(id, xObst, yObst, chunk) {
        this.xObst = xObst;
        this.yObst = yObst;
        this.id = id;
        this.chunkLier = chunk;
        this.contenu = null;

        switch(id)
        {
            case 0 : {
                //Def data
                this.name = "Buisson";
                this.hp = 50;
                this.hpDep = 50;

                //Def hit box
                this.img = ObstacleDef.imgBuisson;
                this.rayonHitBox = this.img.width*0.45;
                this.centreHitBoxX = this.xObst + this.chunkLier.xMap + this.img.width / 2;
                this.centreHitBoxY = this.yObst + this.chunkLier.yMap + this.img.height / 2;
                this.typeHitBox = "rond";

                //Est solide
                this.solide = false;
                break;
            }
            case 1 : {
                this.name = "Caisse";
                this.hp = 50;
                this.hpDep = 50;

                this.img = ObstacleDef.imgCaisse;
                this.hitboxWidth = this.img.width;
                this.hitboxHeight = this.img.height;
                this.hitboxX = this.xObst + this.chunkLier.xMap;
                this.hitboxY = this.yObst + this.chunkLier.yMap;
                this.typeHitBox = "carre";

                this.contenu = [new ItemMele(1, 1, "Katana", true, 30, 40)];

                this.solide = true;
                break;
            }
            case 2 : {
                this.name = "Arbre";
                this.hp = 100;
                this.hpDep = 100;

                this.img = ObstacleDef.imgArbre;
                this.rayonHitBox = this.img.width * 0.18;
                this.centreHitBoxX = this.xObst + this.chunkLier.xMap + this.img.width / 2;
                this.centreHitBoxY = this.yObst + this.chunkLier.yMap + this.img.height / 2;
                this.typeHitBox = "rond";

                this.solide = true;
                break;
            }
        }
    }

    setDmg(hp)
    {
        this.hp -= hp;

        console.log(this.hp, this.contenu)


        if(this.hp <= 0 && this.contenu !== null)
        {
            for(let i = 0; i < this.contenu.length ; i++)
            {
                this.chunkLier.itemSol.push(new ItemSol(this.contenu[i], this.xObst + (i*30), this.yObst));
            }
        }
    }

    estToucher(joueur, x, y)
    {
        if(!this.solide || this.hp < 0)
        {
            return false;
        }

        let joueurX = joueur.centreHitBoxX + x;
        let joueurY = joueur.centreHitBoxY + y;

        if(this.typeHitBox === "rond")
        {
            let distance = Math.sqrt(Math.pow(((joueur.centreHitBoxX) + x) - this.centreHitBoxX, 2) +
                Math.pow(((joueur.centreHitBoxY) + y) - this.centreHitBoxY, 2)
            );

            return distance < (joueur.rayonHitBox + this.rayonHitBox); // Collision si distance < somme des rayons
        }
        else if (this.typeHitBox === "carre")
        {
            // Coordonnées du rectangle (obstacle)
            let rectX = this.hitboxX;
            let rectY = this.hitboxY;
            let rectWidth = this.hitboxWidth;
            let rectHeight = this.hitboxHeight;

            // Coordonnées du joueur (cercle)
            let cercleX = joueurX;
            let cercleY = joueurY;
            let rayonCercle = joueur.rayonHitBox;

            // Trouver le point le plus proche du centre du cercle sur le rectangle
            let closestX = Math.max(rectX, Math.min(cercleX, rectX + rectWidth));
            let closestY = Math.max(rectY, Math.min(cercleY, rectY + rectHeight));

            // Calcul de la distance entre ce point et le centre du cercle
            let distance = Math.sqrt(
                (closestX - cercleX) * (closestX - cercleX) +
                (closestY - cercleY) * (closestY - cercleY)
            );

            return distance < rayonCercle;
        }

        return false;
    }

    estFrapper(item)
    {
        if(this.typeHitBox === "rond")
        {
            // Coordonnées du cercle
            let cercleX = this.centreHitBoxX;
            let cercleY = this.centreHitBoxY;
            let rayonCercle = this.rayonHitBox;

            // Coordonnées du rectangle (Item)
            let rectX = item.xHitboxHaut;
            let rectY = item.yHitboxHaut;
            let rectLargeur = item.xHitboxBas - item.xHitboxHaut;
            let rectHauteur = item.yHitboxBas - item.yHitboxHaut;


            // Trouver le point le plus proche du centre du cercle sur le rectangle
            let closestX = Math.max(rectX, Math.min(cercleX, rectX + rectLargeur));
            let closestY = Math.max(rectY, Math.min(cercleY, rectY + rectHauteur));

            // Calcul de la distance entre ce point et le centre du cercle
            let distance = Math.sqrt(Math.pow(closestX - cercleX, 2) + Math.pow(closestY - cercleY, 2));


            // Vérification de la collision : si la distance est inférieure ou égale au rayon du cercle
            return distance <= rayonCercle;
        }else{
            // Coordonnées du rectangle (Obstacle)
            let rect1X = this.hitboxX;
            let rect1Y = this.hitboxY;
            let rect1Largeur = this.hitboxWidth;
            let rect1Hauteur = this.hitboxHeight;

            // Coordonnées du rectangle (Item)
            let rect2X = item.xHitboxHaut;
            let rect2Y = item.yHitboxHaut;
            let rect2Largeur = item.xHitboxBas - item.xHitboxHaut;
            let rect2Hauteur = item.yHitboxBas - item.yHitboxHaut;

            // Vérification de la collision entre les deux rectangles
            let collisionX = rect1X < rect2X + rect2Largeur && rect1X + rect1Largeur > rect2X;
            let collisionY = rect1Y < rect2Y + rect2Hauteur && rect1Y + rect1Hauteur > rect2Y;

            return collisionX && collisionY;
        }
    }

    estSurMemePosition(obstacle) {
        if (obstacle.hp < 0) {
            return false;
        }

        if (this.typeHitBox === "rond" && obstacle.typeHitBox === "rond") {
            // Collision entre deux hitbox rondes
            let distance = Math.sqrt(Math.pow(obstacle.centreHitBoxX - this.centreHitBoxX, 2) +
                Math.pow(obstacle.centreHitBoxY - this.centreHitBoxY, 2)
            );

            return distance < (obstacle.rayonHitBox + this.rayonHitBox); // Collision si distance < somme des rayons
        }

        if (this.typeHitBox === "carre" && obstacle.typeHitBox === "carre") {
            // Collision entre deux hitbox carrées
            let rect1X = this.hitboxX;
            let rect1Y = this.hitboxY;
            let rect1Largeur = this.hitboxWidth;
            let rect1Hauteur = this.hitboxHeight;

            let rect2X = obstacle.hitboxX;
            let rect2Y = obstacle.hitboxY;
            let rect2Largeur = obstacle.hitboxWidth;
            let rect2Hauteur = obstacle.hitboxHeight;

            let collisionX = rect1X < rect2X + rect2Largeur && rect1X + rect1Largeur > rect2X;
            let collisionY = rect1Y < rect2Y + rect2Hauteur && rect1Y + rect1Hauteur > rect2Y;

            return collisionX && collisionY;
        }

        if ((this.typeHitBox === "rond" && obstacle.typeHitBox === "carre") ||
            (this.typeHitBox === "carre" && obstacle.typeHitBox === "rond")) {
            // Collision entre un cercle et un carré
            let cercleX, cercleY, rayonCercle, rectX, rectY, rectLargeur, rectHauteur;

            if (this.typeHitBox === "rond") {
                cercleX = this.centreHitBoxX;
                cercleY = this.centreHitBoxY;
                rayonCercle = this.rayonHitBox;

                rectX = obstacle.hitboxX;
                rectY = obstacle.hitboxY;
                rectLargeur = obstacle.hitboxWidth;
                rectHauteur = obstacle.hitboxHeight;
            } else {
                cercleX = obstacle.centreHitBoxX;
                cercleY = obstacle.centreHitBoxY;
                rayonCercle = obstacle.rayonHitBox;

                rectX = this.hitboxX;
                rectY = this.hitboxY;
                rectLargeur = this.hitboxWidth;
                rectHauteur = this.hitboxHeight;
            }

            let closestX = Math.max(rectX, Math.min(cercleX, rectX + rectLargeur));
            let closestY = Math.max(rectY, Math.min(cercleY, rectY + rectHauteur));

            let distance = Math.sqrt(Math.pow(closestX - cercleX, 2) + Math.pow(closestY - cercleY, 2));

            return distance <= rayonCercle;
        }

        return false;
    }
}

export {ObstacleDef};