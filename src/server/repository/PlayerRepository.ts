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

    public createPlayer(name: string, password: string, index: string): Player {
        if (this.players.has(index)) {
            const player = this.players.get(index);
            if (player?.password === password) {
                return player;
            } else {
                throw new Error('Password is incorrect!');
            }
        } else {
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
}