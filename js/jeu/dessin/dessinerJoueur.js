import {Controleur} from "../../controleur.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//images
const imgJoueurCorps = new Image();
imgJoueurCorps.src = "../../images/playerBody.png";

const imgJoueurMain = new Image();
imgJoueurMain.src = "../../images/armes/images/playerHand.png";

const imgKatana = new Image();
imgKatana.src = "../../images/armes/images/katana.png";

// Position de la souris
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

// Écouteur d'événement pour suivre la souris
canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
});


// Fonction de dessin
async function dessinerJoueur() {
    // Dessin du corps du joueur
    ctx.drawImage(imgJoueurCorps, canvas.width / 2 - 40, canvas.height / 2 - 40, 80, 80);

    // Position du joueur (au centre de l'écran)
    const joueurX = canvas.width / 2;
    const joueurY = canvas.height / 2;

    // Coordonnées globales du joueur dans le monde
    const joueurXGlobal = Controleur.joueur.x;
    const joueurYGlobal = Controleur.joueur.y;

    // Calcul de l'angle entre le joueur et la souris
    const angle = Math.atan2(mouseY - joueurY, mouseX - joueurX);

    // Distance initiale des mains
    const distanceRepos = Controleur.joueur.itemEquipe.distanceJoueur;
    let mainDistance = distanceRepos; // Distance actuelle des mains
    let avancee = 0; // Distance d'animation vers la souris
    let separation = 25; // Décalage initial des mains sur les côtés

    // Gestion de l'animation
    if (Controleur.joueur.estAnimation) {
        const cooldown = Controleur.joueur.itemEquipe.cooldown * 1000; // Convertir en ms
        const halfCooldown = cooldown / 2;

        // Temps écoulé depuis le début de l'animation
        Controleur.joueur.tempsAnimation += 16; // ~16 ms par frame à 60 FPS

        if (Controleur.joueur.tempsAnimation < halfCooldown) {
            // Phase d'attaque : la main avance vers la souris et s’écarte un peu
            avancee = 30 * (Controleur.joueur.tempsAnimation / halfCooldown);
            separation *= (1.2 - (Controleur.joueur.tempsAnimation / halfCooldown));
        } else if (Controleur.joueur.tempsAnimation < cooldown) {
            // Phase de retour : la main recule et retrouve sa position normale
            avancee = 30 * (1 - (Controleur.joueur.tempsAnimation - halfCooldown) / halfCooldown);
            separation *= ((Controleur.joueur.tempsAnimation - halfCooldown) / halfCooldown) * 1.2;
        } else {
            // Fin de l'animation
            Controleur.joueur.estAnimation = false;
            Controleur.joueur.tempsAnimation = 0;
            Controleur.joueur.mainAleatoire = null;
        }
    }

    let main1X, main1Y, main2X, main2Y;

    if (Controleur.joueur.mainAleatoire === 1) {
        // Main 1 attaque, main 2 reste normale
        main1X = joueurX + Math.cos(angle) * (mainDistance + avancee) + Math.cos(angle + Math.PI / 2) * separation;
        main1Y = joueurY + Math.sin(angle) * (mainDistance + avancee) + Math.sin(angle + Math.PI / 2) * separation;

        main2X = joueurX + Math.cos(angle) * mainDistance + Math.cos(angle - Math.PI / 2) * separation;
        main2Y = joueurY + Math.sin(angle) * mainDistance + Math.sin(angle - Math.PI / 2) * separation;
    } else {
        // Main 2 attaque, main 1 reste normale
        main1X = joueurX + Math.cos(angle) * mainDistance + Math.cos(angle + Math.PI / 2) * separation;
        main1Y = joueurY + Math.sin(angle) * mainDistance + Math.sin(angle + Math.PI / 2) * separation;

        main2X = joueurX + Math.cos(angle) * (mainDistance + avancee) + Math.cos(angle - Math.PI / 2) * separation;
        main2Y = joueurY + Math.sin(angle) * (mainDistance + avancee) + Math.sin(angle - Math.PI / 2) * separation;
    }

    // Calcul de la position globale des mains
    const main1XGlobal = joueurXGlobal + Math.cos(angle) * (mainDistance + avancee) + Math.cos(angle + Math.PI / 2) * separation;
    const main1YGlobal = joueurYGlobal + Math.sin(angle) * (mainDistance + avancee) + Math.sin(angle + Math.PI / 2) * separation;

    const main2XGlobal = joueurXGlobal + Math.cos(angle) * mainDistance + Math.cos(angle - Math.PI / 2) * separation;
    const main2YGlobal = joueurYGlobal + Math.sin(angle) * mainDistance + Math.sin(angle - Math.PI / 2) * separation;

    // Mise à jour dynamique de la hitbox en fonction des mains
    const hitboxX = Math.min(main1XGlobal, main2XGlobal) - 10;
    const hitboxY = Math.min(main1YGlobal, main2YGlobal) - 10;
    const hitboxWidth = Math.abs(main1XGlobal - main2XGlobal) + 20;
    const hitboxHeight = Math.abs(main1YGlobal - main2YGlobal) + 20;

    // Mise à jour des valeurs de la hitbox dans l'objet du joueur
    Controleur.joueur.itemEquipe.xHitboxHaut = hitboxX;
    Controleur.joueur.itemEquipe.yHitboxHaut = hitboxY;
    Controleur.joueur.itemEquipe.xHitboxBas = hitboxX + hitboxWidth;
    Controleur.joueur.itemEquipe.yHitboxBas = hitboxY + hitboxHeight;

    // Calcul de la position de la hitbox sur l'écran sans diviser par tailleChunk
    const hitboxXScreen = (hitboxX - joueurXGlobal) + canvas.width / 2;
    const hitboxYScreen = (hitboxY - joueurYGlobal) + canvas.height / 2;

    // Dessin des mains
    ctx.drawImage(imgJoueurMain, main1X - 15, main1Y - 15, 30, 30);
    ctx.drawImage(imgJoueurMain, main2X - 15, main2Y - 15, 30, 30);

    // Dessin de la hitbox de l'item du joueur (rectangle dynamique)
    ctx.beginPath();
    ctx.rect(hitboxXScreen, hitboxYScreen, hitboxWidth, hitboxHeight);
    ctx.strokeStyle = "green"; // Couleur de la hitbox de l'item
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
}

export { dessinerJoueur };