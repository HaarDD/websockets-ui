// src\server\repository\RoomRepository.ts

import { Room } from "../entity/Room";
import { Player } from "../entity/Player";
import { generateUniqueIndex as generateUniqueLine } from "../utils/GenerationUtils";

export class RoomRepository {
    private static instance: RoomRepository;
    private rooms: Map<string, Room> = new Map();

    private constructor() {}

    public static getInstance(): RoomRepository {
        if (!RoomRepository.instance) {
            RoomRepository.instance = new RoomRepository();
        }
        return RoomRepository.instance;
    }

    public createRoom(): Room {
        const indexRoom = generateUniqueLine();
        const room = new Room(indexRoom);
        this.rooms.set(indexRoom, room);
        return room;
    }

    public getRoomByIndex(indexRoom: string): Room | undefined {
        return this.rooms.get(indexRoom);
    }

    public getRoomByPlayerIndex(playerIndex: string): Room | undefined {
        for (const room of this.rooms.values()) {
            if (room.players.some(player => player.index === playerIndex)) {
                return room;
            }
        }
        return undefined;
    }

    public getAllRooms(): Room[] {
        return Array.from(this.rooms.values());
    }

    public addUserToRoom(indexRoom: string, player: Player): void {
        const room = this.rooms.get(indexRoom);
    
        if (!room) {
            throw new Error('Room not found!');
        }
    
        // Проверка на наличие игрока в текущей комнате
        if (!room.players.some(p => p.index === player.index)) {
            room.players.push(player);
        } else {
            throw new Error('Player already exists in the room!');
        }
    }

    public removeRoom(room: Room): void{
        this.rooms.delete(room.indexRoom);
    }

    
    public removePlayerFromRoom(indexRoom: string, playerIndex: string): void {
        const room = this.rooms.get(indexRoom);
    
        if (!room) {
            throw new Error('Room not found!');
        }
    
        const playerIndexInRoom = room.players.findIndex(player => player.index === playerIndex);
    
        if (playerIndexInRoom === -1) {
            throw new Error('Player not found in the room!');
        }
    
        room.players.splice(playerIndexInRoom, 1);
    }


}