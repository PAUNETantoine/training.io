const logoPoings = new Image();
logoPoings.src = "../../images/armes/logo/poings.png";

const logoKatana = new Image();
logoKatana.src = "../../images/armes/logo/katana.png";

class Items
{

    constructor(id, quantite, nom, jetable)
    {
        this.id = id;
        this.quantite = quantite;
        this.nom = nom;
        this.jetable = jetable;

        switch (id)
        {
            case 0 : this.logo = logoPoings; break;
            case 1 : this.logo = logoKatana; break;
        }
    }
}

export { Items }