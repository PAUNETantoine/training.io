class InitJeu{
    constructor()
    {
        this.canvas = document.createElement("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.ctx = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);
    }
}