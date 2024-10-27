// src\server\service\GameService.ts

import { PlayerRepository } from "../repository/PlayerRepository";
import { RoomRepository } from "../repository/RoomRepository";
import { Room } from "../entity/Room";
import ResponseBuilder from "../utils/ResponseBuilder";
import { AddShipsRequest, AttackRequest, PlayerRequest } from "../dto/Requests";
import { Player } from "../entity/Player";
import { Ship } from "../entity/Ship";

export class GameService {
    private static instance: GameService;
    private playerRepository = PlayerRepository.getInstance();
    private roomRepository = RoomRepository.getInstance();

    private constructor() { }

    public static getInstance(): GameService {
        if (!GameService.instance) {
            GameService.instance = new GameService();
        }
        return GameService.instance;
    }


    public registerPlayer(clientIndex: string, playerRequest: PlayerRequest): Player {
        return this.playerRepository.createPlayer(playerRequest.name, playerRequest.password, clientIndex);
    }

    public createRoom(playerIndex: string) {
        const createdRoom = this.roomRepository.createRoom();
        const currentPlayer = this.playerRepository.getPlayerByIndex(playerIndex);
        if (!currentPlayer) throw new Error('Player not found');
        this.roomRepository.addUserToRoom(createdRoom.indexRoom, currentPlayer);
    }

    public addUserToRoom(playerIndex: string, indexRoom: string) {
        const currentPlayer = this.playerRepository.getPlayerByIndex(playerIndex);
        if (!currentPlayer) throw new Error('Player not found');
        this.roomRepository.addUserToRoom(indexRoom, currentPlayer);
    }

    public updateRoom(roomIndex: string): Room {
        const room = this.roomRepository.getRoomByIndex(roomIndex);
        if (!room) throw new Error('Room not found');

        if (room.players.length >= 2) {
            return room;
        } else if (room.players.length === 0) {
            this.roomRepository.removeRoom(room);
        }

        throw new Error('Room state undefined');
    }

    public getRoom(roomIndex: string): Room | undefined {
        return this.roomRepository.getRoomByIndex(roomIndex);
    }

    public getFreeRooms(): string {
        const freeRooms = this.roomRepository.getAllRooms().filter(room => room.players.length < 2);
        return ResponseBuilder.buildRoomsResponse(
            freeRooms.map(room => ({
                roomId: room.indexRoom,
                roomUsers: room.players.map(player => ({
                    name: player.name,
                    index: player.index
                }))
            }))
        );
    }

    public addShipsToRoom(playerIndex: string, shipsData: AddShipsRequest): boolean {
        const room = this.roomRepository.getRoomByIndex(shipsData.gameId);
        if (!room || room.isStarted) throw new Error('Room not found or battle already started');

        const ships: Ship[] = shipsData.ships.map(ship => ({
            position: ship.position,
            direction: ship.direction,
            length: ship.length,
            type: ship.type,
            hits: 0
        }));
        room.ships.set(playerIndex, ships);

        return room.ships.size >= 2;
    }

    public startGame(roomIndex: string): Room {
        const room = this.roomRepository.getRoomByIndex(roomIndex);
        if (!room || room.isStarted) throw new Error('Room not found or battle already started');

        room.isStarted = true;
        this.switchToNextPlayer(room);
        return room;
    }

    private executeAttack(playerIndex: string, roomIndex: string, x: number, y: number): string {
        const room = this.roomRepository.getRoomByIndex(roomIndex);
        if (!room || !room.isStarted) throw new Error('Invalid room or game not started');
        if (room.nextPlayerIndex !== playerIndex) throw new Error('Invalid player turn');

        const opponentIndex = room.players.find(player => player.index !== playerIndex)?.index;
        const opponentShips = room.ships.get(opponentIndex!);
        if (!opponentShips) throw new Error('Opponent ships not found');

        const hitShip = opponentShips.find(ship => this.isHit(ship, x, y));
        if (!hitShip) {
            this.switchToNextPlayer(room);
            return 'miss';
        } 

        hitShip.hits++;
        if (hitShip.hits >= hitShip.length) {
            room.ships.set(opponentIndex!, opponentShips.filter(ship => ship !== hitShip));
            return 'killed';
        }

        return 'shot';
    }

    public attack(playerIndex: string, attackData: AttackRequest): string {
        return this.executeAttack(playerIndex, attackData.gameId, attackData.x, attackData.y);
    }

    private isHit(ship: Ship, x: number, y: number): boolean {
        return (
            (ship.direction && ship.position.x === x && y >= ship.position.y && y < ship.position.y + ship.length) ||
            (!ship.direction && ship.position.y === y && x >= ship.position.x && x < ship.position.x + ship.length)
        );
    }

    private switchToNextPlayer(room: Room) {
        room.nextPlayerIndex = room.players[(room.nextPlayerCounter % 2)]?.index!;
        room.nextPlayerCounter = (room.nextPlayerCounter % 2) + 1;
    }

    public checkFinishGame(room: Room): string | undefined {
        let emptyShipsFound = false;
        let winnerPlayerIndex: string | undefined;

        room.ships.forEach((ships, playerIndex) => {
            if (ships.length === 0) {
                emptyShipsFound = true;
            } else if (!winnerPlayerIndex) {
                winnerPlayerIndex = playerIndex;
            }
        });

        if (emptyShipsFound && winnerPlayerIndex) {
            const player = this.playerRepository.getPlayerByIndex(winnerPlayerIndex);
            if (!player) throw new Error('Finish: unable to find player');
            player.wins++;
            return player.index;
        }
        return undefined;
    }

    public getWinners(): Player[] {
        return Array.from(this.playerRepository.getAllPlayers().values()).filter(player => player.wins > 0);
    }
}
