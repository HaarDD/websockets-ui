// src\server\entity\Room.ts

import { Player } from './Player';
import { Ship } from './Ship';

export class Room {
    constructor(
        public indexRoom: string,
        public players: Player[] = [],
        public ships: Map<string, Ship[]> = new Map(),
        public isStarted: boolean = false,
        public nextPlayerCounter: number = 1,
        public nextPlayerIndex: string = ''    
    ) {}
}