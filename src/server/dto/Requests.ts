//src\server\dto\Requests.ts

import { ShipType } from "../dto/Enums";

export interface PlayerRequest {
    name: string;
    password: string;
}

export interface CreateRoomRequest {
}

export interface AddToRoomRequest {
    indexRoom: string;
}

export interface Ship {
    position: {
        x: number;
        y: number;
    };
    direction: boolean;
    length: number;
    type: ShipType;
}

export interface AddShipsRequest {
    gameId: string;
    ships: Ship[];
    indexPlayer: number | string;
}


export interface AttackRequest {
    gameId: string;
    x: number;
    y: number;
    indexPlayer: string;
}

export interface RandomAttackRequest {
    gameId: string;
    indexPlayer: string;
}
