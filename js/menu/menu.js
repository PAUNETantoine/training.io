import {Controleur} from "../controleur.js";

class Menu {
    constructor(pseudo)
    {
        this.estMenu = true //Défini si le jeu est sur le menu ou non
        this.pseudo = pseudo;

        this.initMenu();
    }

    initMenu()
    {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "./css/menu.css";

        document.head.appendChild(link);

        const divMenu = document.createElement("div");
        divMenu.classList.add("menu");

        divMenu.appendChild(this.initZoneJouer());

        document.body.appendChild(divMenu);
    }


    initZoneJouer()
    {
        const divZoneJouer = document.createElement("div");
        divZoneJouer.className = "conteneur";
        divZoneJouer.id = "zoneJouer";

        const zonePseudo = document.createElement("textarea");
        zonePseudo.className = "";
        zonePseudo.id = "zonePseudo";
        zonePseudo.text = "Votre Pseudo";

        const btnJouer = document.createElement("button");
        btnJouer.className = "btns";
        btnJouer.id = "btnJouer";
        btnJouer.innerHTML = "Lancer la partie";

        btnJouer.addEventListener("click", () => {
            this.lancerPartie();
        })

        divZoneJouer.appendChild(btnJouer);

        return divZoneJouer;
    }

    async lancerPartie()
    {
        document.getElementById("canvas").width = window.innerWidth;
        document.getElementById("canvas").height = window.innerHeight;

        await Controleur.Lancerjeu();

        const element = document.getElementById("zoneJouer")
        element.style.display = "none";

    }
}

export {Menu};