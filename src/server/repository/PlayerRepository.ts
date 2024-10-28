// src\server\repository\PlayerRepository.ts

import { Player } from "../entity/Player";

export class PlayerRepository {
    private static instance: PlayerRepository;
    private players: Map<string, Player> = new Map();

    private constructor() { }

    public static getInstance(): PlayerRepository {
        if (!PlayerRepository.instance) {
            PlayerRepository.instance = new PlayerRepository();
        }
        return PlayerRepository.instance;
    }

    public createPlayerOrLogin(name: string, password: string, index: string): Player {
        const existingPlayer = this.getPlayerByName(name);


        if (existingPlayer) {
            if (existingPlayer.password === password) {
                return existingPlayer;
            } else {
                throw new Error('Password is incorrect!');
            }
        } else {
            if(name.length < 5){
                throw new Error('User must be more than 4 symbols!');
            }
            if(password.length < 5){
                throw new Error('Password must be more than 4 symbols!');
            }
            const player = new Player(name, password, index);
            this.players.set(index, player);
            return player;
        }
    }

    public getPlayerByIndex(id: string): Player | undefined {
        return this.players.get(id);
    }

    public getAllPlayers(): Player[] {
        return Array.from(this.players.values());
    }

    private getPlayerByName(name: string): Player | undefined {
        return Array.from(this.players.values()).find(player => player.name === name);
    }
}