import {Controleur} from "../../controleur.js";
import {ItemMele} from "../items/itemMele.js";

function dessinerHud()
{
    dessinerInventaire();
    dessinerBarreVie();
}

function dessinerInventaire()
{
    const slots = document.querySelectorAll("#hud-armes div");
    slots.forEach(slot => slot.classList.remove("selectionnee"));


    for(let i = 0 ; i < Controleur.joueur.slots.length ; i++)
    {
        const slotDiv = document.getElementById("slot" + i);

        if(Controleur.joueur.itemEquipe === Controleur.joueur.slots[i])
        {
            document.getElementById("slot"+i).classList.add("selectionnee");
        }

        // Vider le contenu de la div avant d'ajouter une nouvelle image
        slotDiv.innerHTML = '<div class="slot-number">'+(i+1)+'</div>'

        // Vérifier si un item est présent dans le slot
        if (Controleur.joueur.slots[i]) {
            // Créer un élément <img> et lui attribuer l'image de l'item
            const itemImage = document.createElement('img');
            itemImage.src = Controleur.joueur.slots[i].logo.src;
            itemImage.classList.add('item-image');

            // Ajouter l'image à la div du slot
            slotDiv.appendChild(itemImage);
        }
    }
}

function dessinerBarreVie(vieRestante) {
    const barreVie = document.getElementById("barre-vie");
    barreVie.style.width = Controleur.joueur.hp + "%"; // Met à jour la largeur en fonction de la vie restante
}

export {dessinerHud};