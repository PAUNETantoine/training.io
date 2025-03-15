class Chunk{
    constructor(id, xMap, yMap, obstacles)
    {
        this.obstacles = obstacles; //Contient tous les obstacle du chunk ainsi que leurs coordonnées
        this.id = id;
        this.xMap = xMap; //Coordonnée x / y sur la map
        this.yMap = yMap;
        this.itemSol = [];
    }


    removeObstacle(obstacle)
    {
        this.obstacles.split(this.obstacles.indexOf(obstacle), 1);
    }
}

export { Chunk }