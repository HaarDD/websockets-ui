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

    public getAllRooms(): Room[] {
        return Array.from(this.rooms.values());
    }

    public addUserToRoom(indexRoom: string, player: Player): void {
        const room = this.rooms.get(indexRoom);
        if(room){
            if(!room?.players.some(p => p.index === player.index)){
                if (room) room.players.push(player);
            }else {
                throw new Error('Player already exists in the room!');
            }
        } else{
            throw new Error('Room is not found!');
        }
        
        
    }

    public removeRoom(room: Room): void{
        this.rooms.delete(room.indexRoom);
    }

    

}