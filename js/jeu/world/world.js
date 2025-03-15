import {Chunk} from "./chunk.js";
import {Controleur} from "../../controleur.js";
import {ObstacleDef} from "./obstacle.js";

class World {
    constructor(size)
    {
        this.size = size;
        this.chunks = [];
        this.initChunks();
    }

    initChunks()
    {
        let id = 0;

        for(let i = 0; i < this.size; i++)
        {
            for(let j = 0; j < this.size; j++)
            {
                let tmp = new Chunk(id, i*Controleur.tailleChunk, j*Controleur.tailleChunk, []);
                this.initObstacles(tmp);
                this.chunks.push(tmp);
                id++;
            }
        }


        for(let i = 0; i < this.chunks.length; i++)
        {
            if(this.chunks[i] !== undefined)
            {
                let chunkNord = this.getChunk(this.chunks[i].id -1);
                let chunkSud = this.getChunk(this.chunks[i].id + 1);
                let chunkOuest = this.getChunk(this.chunks[i].id - 10);
                let chunkEst = this.getChunk(this.chunks[i].id + 10);


                let tabChunkVerif = [chunkNord, chunkSud, chunkOuest, chunkEst];

                for(let j = 0; j < this.chunks[i].obstacles.length; j++)
                {
                    for(let v = 0 ; v < tabChunkVerif.length; v++)
                    {
                        if(tabChunkVerif[v] !== undefined)
                        {
                            for(let k = 0 ; k < tabChunkVerif[v].obstacles.length; k++)
                            {
                                if(tabChunkVerif[v].obstacles[k] !== undefined && this.chunks[i].obstacles[j] !== undefined && this.chunks[i].obstacles[j].estSurMemePosition(tabChunkVerif[v].obstacles[k]))
                                {
                                    this.chunks[i].obstacles.splice(j,1);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    initObstacles(chunk)
    {
        let nbObstacles = Math.round(Math.random() * 5);

        for(let i = 0; i < nbObstacles; i++)
        {
            chunk.obstacles[i] = new ObstacleDef(Math.round(Math.random() * 2), (Math.round(Math.random() * (Controleur.tailleChunk / 5)) * 5), (Math.round(Math.random() * (Controleur.tailleChunk / 5)) * 5), chunk);

            //Vérif que l'élément ne sorte pas de la map
            if(chunk.obstacles[i].xObst + chunk.xMap + chunk.obstacles[i].img.width > this.size * Controleur.tailleChunk || chunk.obstacles[i].yObst + chunk.yMap + chunk.obstacles[i].img.height > this.size * Controleur.tailleChunk)
            {
                chunk.obstacles.pop();
            }

            for(let j = 0 ; j < chunk.obstacles.length-1; j++)
            {
                if(chunk.obstacles[j] !== undefined && chunk.obstacles[i] !== undefined && chunk.obstacles[j].estSurMemePosition(chunk.obstacles[i]))
                {
                    chunk.obstacles.pop();
                }
            }
        }

        chunk.obstacles.sort((a, b) => a.id - b.id);
    }

    getChunk(id)
    {
        for(let i = 0; i < this.chunks.length; i++)
        {
            if(this.chunks[i].id === id)
            {
                return this.chunks[i];
            }
        }
    }
}

export {World};