import {Menu} from "./menu/menu.js";
import {World} from "./jeu/world/world.js";
import {rechargerMap} from "./jeu/dessin/dessinerMap.js";
import {Joueur} from "./jeu/joueur/joueur.js";
import {dessinerHud} from "./jeu/dessin/inventaire.js";

class Controleur {

    static jeuLance = false;
    static canvas = document.getElementById("canvas");
    static ctx = canvas.getContext("2d");
    static tailleChunk = 520;
    static joueur = undefined;
    static world = undefined;

    constructor()
    {
        this.menu = new Menu("Test");
        this.eventListener();
        Controleur.world = new World(10);
        Controleur.joueur = new Joueur(100,0, null, [], [], Math.random() * (Controleur.world.size * Controleur.tailleChunk), Math.random() * (Controleur.world.size * Controleur.tailleChunk));

        while(!Controleur.deplacementValide(0, 0))
        {
            Controleur.joueur = new Joueur(100,0, null, [], [], Math.random() * (Controleur.world.size * Controleur.tailleChunk), Math.random() * (Controleur.world.size * Controleur.tailleChunk));
        }
    }

    static async Lancerjeu()
    {
        Controleur.jeuLance = true;
        Controleur.rechargerJeu();
    }

    async eventListener() {
        const vitesse = 9; // Vitesse constante du déplacement
        const touchesPressées = new Set(); // Suivre les touches actuellement pressées
        let animationFrameId = null;

        // Fonction pour démarrer le mouvement
        function startAction() {
            if (!animationFrameId) {
                animationFrameId = requestAnimationFrame(deplacerJoueur); // Démarre l'animation
            }
        }

        // Fonction pour arrêter le mouvement
        function stopAction() {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId); // Arrêter l'animation
                animationFrameId = null;
            }
        }

        // Fonction de déplacement
        function deplacerJoueur() {
            let deplacementX = 0;
            let deplacementY = 0;

            // Gère les déplacements selon les touches pressées
            if (touchesPressées.has("a")) deplacementX -= vitesse; // Déplacement à gauche
            if (touchesPressées.has("d")) deplacementX += vitesse; // Déplacement à droite
            if (touchesPressées.has("s")) deplacementY += vitesse; // Déplacement vers le bas
            if (touchesPressées.has("w")) deplacementY -= vitesse; // Déplacement vers le haut

            // Normalisation pour diagonale (éviter la vitesse plus rapide en diagonale)
            if (deplacementX !== 0 && deplacementY !== 0) {
                const magnitude = Math.sqrt(deplacementX ** 2 + deplacementY ** 2);
                const facteur = vitesse / magnitude;
                deplacementX *= facteur;
                deplacementY *= facteur;
            }

            // Appliquer les déplacements si valides
            if (deplacementX !== 0 && !Controleur.deplacementValide(deplacementX, 0)) {
                deplacementX = 0; // Si déplacement horizontal invalide
            }
            if (deplacementY !== 0 && !Controleur.deplacementValide(0, deplacementY)) {
                deplacementY = 0; // Si déplacement vertical invalide
            }

            // Appliquer le déplacement
            Controleur.joueur.setX(Controleur.joueur.x + deplacementX);
            Controleur.joueur.setY(Controleur.joueur.y + deplacementY);

            // Continuer l'animation si des touches sont pressées
            if (touchesPressées.size > 0) {
                animationFrameId = requestAnimationFrame(deplacerJoueur); // Relancer l'animation
            } else {
                stopAction(); // Si aucune touche n'est pressée, arrêter l'animation
            }
        }

        // Écouteur de keydown
        document.addEventListener("keydown", (event) => {
            if (estToucheDir(event.key) && !touchesPressées.has(event.key)) {
                touchesPressées.add(event.key); // Enregistrer la touche pressée
                startAction(); // Démarre l'action si une touche est pressée
            }
        });

        // Écouteur de keyup
        document.addEventListener("keyup", (event) => {
            if (estToucheDir(event.key)) {
                touchesPressées.delete(event.key); // Supprimer la touche relâchée
                if (touchesPressées.size === 0) {
                    stopAction(); // Arrêter l'action si aucune touche n'est pressée
                }
            }
        });

        // Écouteur de mousedown
        document.addEventListener("mousedown", () => {
            Controleur.joueur.hp -= 5;
            if (!Controleur.joueur.estAnimation) {
                Controleur.joueur.estAnimation = true;
                Controleur.joueur.tempsAnimation = 0;
                Controleur.joueur.attaque();

                if (Controleur.joueur.estAnimation && Controleur.joueur.itemEquipe.id === 0) {
                    Controleur.joueur.mainAleatoire = Math.floor(Math.random() * 2);
                }
            }
        });

        document.addEventListener("contextmenu", function(event) {
            event.preventDefault();  // Empêche le menu contextuel par défaut

            recupererItem();
        });
    }

    static deplacementValide(x, y)
    {
        if((Controleur.joueur.x + x) <= 0 || (Controleur.joueur.x + x) >= (Controleur.tailleChunk * Controleur.world.size) || (Controleur.joueur.y + y) <= 0 || (Controleur.joueur.y + y) >= (Controleur.tailleChunk * Controleur.world.size))
        {
            return false;
        }


        let chunkXJoueur = Math.floor((Controleur.joueur.x + x) / Controleur.tailleChunk);
        let chunkYJoueur = Math.floor((Controleur.joueur.y + y) / Controleur.tailleChunk);


        if(Controleur.world.chunks[chunkYJoueur + (chunkXJoueur * Controleur.world.size)] === undefined)
        {
            return false;
        }

        let positionChunkActuelDansTab = chunkYJoueur + (chunkXJoueur * Controleur.world.size);

        //tab des verfications des chunk autour
        //                          Ici chunk au dessus                     chunk actuel        chunk en dessous                    chunk droite                                            //chunk gauche
        let tabVerif = [positionChunkActuelDansTab - 1, positionChunkActuelDansTab, positionChunkActuelDansTab+1, chunkYJoueur + ((chunkXJoueur + 1) * Controleur.world.size), chunkYJoueur + ((chunkXJoueur - 1) * Controleur.world.size),
            (chunkYJoueur - 1) + ((chunkXJoueur - 1) * Controleur.world.size), (chunkYJoueur + 1) + ((chunkXJoueur - 1) * Controleur.world.size), (chunkYJoueur - 1) + ((chunkXJoueur + 1) * Controleur.world.size), (chunkYJoueur + 1) + ((chunkXJoueur + 1) * Controleur.world.size)];
        //Chunk bas gauche

        for(let j = 0 ; j < tabVerif.length; j++)
        {
            if(Controleur.world.chunks[tabVerif[j]] !== undefined)
            {
                for(let i = 0 ; i < Controleur.world.chunks[tabVerif[j]].obstacles.length; i++)
                {
                    if(Controleur.world.chunks[tabVerif[j]].obstacles[i] !== undefined)
                    {
                        if(Controleur.world.chunks[tabVerif[j]].obstacles[i].estToucher(Controleur.joueur, x, y))
                        {
                            return false;
                        }
                    }
                }
            }
        }


        return true;
    }

    static async rechargerJeu()
    {
        Controleur.ctx.clearRect(0, 0, Controleur.canvas.width, Controleur.canvas.height)
        rechargerMap(Controleur.joueur, Controleur.world);
        dessinerHud();
        requestAnimationFrame(() => this.rechargerJeu());
    }
}

function estToucheDir(touche)
{
    if(touche === "a" || touche === "w" || touche === "s" || touche === "d")
    {
        return true;
    }
}

export {Controleur};