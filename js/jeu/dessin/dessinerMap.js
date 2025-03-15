import {Controleur} from "../../controleur.js";
import {dessinerJoueur} from "./dessinerJoueur.js";


const canva = document.getElementById("canvas");
const ctx = canva.getContext("2d");

//images
const imgFond = new Image();
imgFond.src = "../../images/mapBG.jpg";


async function rechargerMap(joueur, world) {
    const demiTaille = 2; // Car on veut un carré de 5x5 (2 de chaque côté + le chunk central)

    // Trouver le chunk actuel du joueur
    let chunkJoueurX = Math.floor(joueur.x / Controleur.tailleChunk);
    let chunkJoueurY = Math.floor(joueur.y / Controleur.tailleChunk);

    //Tableau permettant de stocker les chunk afin de pouvoir les utiliser pour le dessin des obstacles
    let tabChunksGeneres = [];

    for (let i = -demiTaille; i <= demiTaille; i++)
    {
        for (let j = -demiTaille; j <= demiTaille; j++)
        {
            let chunkX = chunkJoueurX + i;
            let chunkY = chunkJoueurY + j;

            // Vérifier si le chunk existe
            let chunk = world.chunks.find(c =>
                c.xMap === chunkX * Controleur.tailleChunk &&
                c.yMap === chunkY * Controleur.tailleChunk
            );

            if (chunk) {
                // Dessiner en fonction du déplacement du joueur
                let drawX = canva.width / 2 - (joueur.x - chunkX * Controleur.tailleChunk);
                let drawY = canva.height / 2 - (joueur.y - chunkY * Controleur.tailleChunk);

                ctx.drawImage(imgFond, drawX, drawY, Controleur.tailleChunk, Controleur.tailleChunk);
                ctx.font = "30px Arial"; // Définir la police et la taille
                ctx.fillStyle = "white"; // Couleur du texte
                ctx.fillText(chunk.id, drawX + 100, drawY + 100); // Texte et position (x, y)
                tabChunksGeneres.push(chunk);
            }
        }
    }

    //Permet de dessiner les items au sol
    for (let idObstacle = 0; idObstacle < 3; idObstacle++) {
        // Boucle pour dessiner les obstacles
        for (let i = 0; i < tabChunksGeneres.length; i++) {
            let chunk = tabChunksGeneres[i]; // Récupérer le chunk en cours

            for (let i = 0; i < chunk.itemSol.length; i++) {

                let drawX = canva.width / 2 - (joueur.x - chunk.xMap);
                let drawY = canva.height / 2 - (joueur.y - chunk.yMap);

                // Calcul des coordonnées du centre du cercle
                let circleCenterX = chunk.itemSol[i].x + drawX + 44;
                let circleCenterY = chunk.itemSol[i].y + drawY + 44;
                let radius = 60;

                // Dessiner l'image de l'objet
                ctx.drawImage(
                    chunk.itemSol[i].item.logo,
                    chunk.itemSol[i].x + drawX,
                    chunk.itemSol[i].y + drawY,
                    88,
                    88
                );

                // Dessiner le cercle
                ctx.beginPath();
                ctx.arc(circleCenterX, circleCenterY, radius, 0, Math.PI * 2);
                ctx.strokeStyle = "Yellow"; // Couleur du cercle
                ctx.lineWidth = 4;
                ctx.stroke();
                ctx.closePath();

                // Vérifier si le joueur entre dans la zone du cercle
                let distance = Math.sqrt(
                    Math.pow(Controleur.joueur.x - chunk.itemSol[i].x, 2) + Math.pow(Controleur.joueur.y - chunk.itemSol[i].y, 2)
                );

                if (distance <= radius) {
                    console.log("Le joueur est dans la zone du cercle!");
                    // Ici tu peux mettre l'action à effectuer quand le joueur entre dans le cercle
                }
            }
        }
    }

    dessinerJoueur();

    //Permet de dessiner les types d'obstacles les uns après les autres
    for(let idObstacle = 0 ; idObstacle < 3 ; idObstacle++)
    {
        // Boucle pour dessiner les obstacles
        for (let i = 0; i < tabChunksGeneres.length; i++) {
            let chunk = tabChunksGeneres[i]; // Récupérer le chunk en cours

            for (let j = 0; j < chunk.obstacles.length; j++)
            {
                let obstacle = chunk.obstacles[j];

                if (obstacle !== undefined && obstacle.id === idObstacle && obstacle.hp > 0)
                {
                    let drawX = canva.width / 2 - (joueur.x - chunk.xMap);
                    let drawY = canva.height / 2 - (joueur.y - chunk.yMap);


                    ctx.drawImage(
                        obstacle.img,
                        obstacle.xObst + drawX,
                        obstacle.yObst + drawY,
                        obstacle.img.width,
                        obstacle.img.height
                    );

                    if(obstacle.typeHitBox === "rond")
                    {
                        ctx.beginPath();
                        ctx.arc(obstacle.centreHitBoxX + drawX - chunk.xMap, obstacle.centreHitBoxY + drawY - chunk.yMap, obstacle.rayonHitBox, 0, Math.PI * 2);
                        ctx.strokeStyle = "red"; // Couleur de la hitbox
                        if(obstacle.hp < obstacle.hpDep)
                        {
                            ctx.strokeStyle = "yellow";
                        }
                        ctx.lineWidth = 2;
                        ctx.stroke();
                        ctx.closePath();
                    }else{
                        // Dessiner la hitbox carrée
                        ctx.beginPath();
                        // Utilisation de hitboxX, hitboxY pour le coin supérieur gauche de la hitbox
                        ctx.rect(
                            obstacle.hitboxX + drawX - chunk.xMap,  // x position de la hitbox (ajustée)
                            obstacle.hitboxY + drawY - chunk.yMap,  // y position de la hitbox (ajustée)
                            obstacle.hitboxWidth,                    // largeur de la hitbox carrée
                            obstacle.hitboxHeight                    // hauteur de la hitbox carrée
                        );
                        ctx.strokeStyle = "red"; // Couleur de la hitbox
                        if (obstacle.hp < obstacle.hpDep) {
                            ctx.strokeStyle = "yellow";
                        }
                        ctx.lineWidth = 2;
                        ctx.stroke();
                        ctx.closePath();
                    }
                }
            }
        }
    }

}

export { rechargerMap }