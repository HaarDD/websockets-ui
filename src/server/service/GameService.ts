// src\server\service\GameService.ts

import { PlayerRepository } from "../repository/PlayerRepository";
import { RoomRepository } from "../repository/RoomRepository";
import { Room } from "../entity/Room";
import { Player } from "../entity/Player";
import { Ship } from "../entity/Ship";
import { AddShipsRequest, AttackRequest, PlayerRequest } from "../dto/Requests";
import { AttackResult } from "../dto/AttackResult";

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
        return this.playerRepository.createPlayerOrLogin(playerRequest.name, playerRequest.password, clientIndex);
    }

    public createRoom(playerIndex: string): Room {
        const createdRoom = this.roomRepository.createRoom();
        try {
            const currentPlayer = this.playerRepository.getPlayerByIndex(playerIndex);
            if (!currentPlayer) throw new Error('Player not found');
            this.roomRepository.addUserToRoom(createdRoom.indexRoom, currentPlayer);
        }
        catch {
            this.checkGameFinishOrEnd(createdRoom);
        }
        return createdRoom;
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

    public getFreeRooms(): Room[] {
        return this.roomRepository.getAllRooms().filter(room => room.players.length < 2);
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

    private executeAttack(playerIndex: string, roomIndex: string, x: number, y: number): AttackResult[] {
        const attackResults: AttackResult[] = [];

        const room = this.roomRepository.getRoomByIndex(roomIndex);
        if (!room || !room.isStarted) throw new Error('Invalid room or game not started');
        if (room.nextPlayerIndex !== playerIndex) throw new Error('Invalid player turn');

        const opponentIndex = room.players.find(player => player.index !== playerIndex)?.index;
        const opponentShips = room.ships.get(opponentIndex!);
        if (!opponentShips) throw new Error('Opponent ships not found');

        const hitShip = opponentShips.find(ship => this.isHit(ship, x, y));
        if (!hitShip) {
            attackResults.push(new AttackResult(x, y, 'miss'));
            this.switchToNextPlayer(room);
            return attackResults;
        } else {
            hitShip.hits++;
            if (hitShip.hits >= hitShip.length) {
                room.ships.set(opponentIndex!, opponentShips.filter(ship => ship !== hitShip));
                this.addKilledForEachCell(hitShip, attackResults);
                this.addMissesAroundShip(hitShip, attackResults);
                return attackResults;
            }
        }
        attackResults.push(new AttackResult(x, y, 'shot'));
        return attackResults;
    }

    public attack(playerIndex: string, attackData: AttackRequest): AttackResult[] {
        return this.executeAttack(playerIndex, attackData.gameId, attackData.x, attackData.y);
    }

    private isHit(ship: Ship, x: number, y: number): boolean {
        return (
            (ship.direction && ship.position.x === x && y >= ship.position.y && y < ship.position.y + ship.length) ||
            (!ship.direction && ship.position.y === y && x >= ship.position.x && x < ship.position.x + ship.length)
        );
    }

    private addKilledForEachCell(ship: Ship, attackResults: AttackResult[]): void {
        const { x: startX, y: startY } = ship.position;
        const isHorizontal = !ship.direction;

        for (let i = 0; i < ship.length; i++) {
            const cellX = isHorizontal ? startX + i : startX;
            const cellY = isHorizontal ? startY : startY + i;
            attackResults.push(new AttackResult(cellX, cellY, 'killed'));
        }
    }

    private addMissesAroundShip(ship: Ship, attackResults: AttackResult[]): void {
        const { x: startX, y: startY } = ship.position;
        const length = ship.length;
        const isHorizontal = !ship.direction;

        const xRange = isHorizontal ? [startX - 1, startX + length] : [startX - 1, startX + 1];
        const yRange = isHorizontal ? [startY - 1, startY + 1] : [startY - 1, startY + length];

        for (let x = xRange[0]!; x <= xRange[1]!; x++) {
            for (let y = yRange[0]!; y <= yRange[1]!; y++) {

                if ((isHorizontal && y === startY && x >= startX && x < startX + length) ||
                    (!isHorizontal && x === startX && y >= startY && y < startY + length)) {
                    continue;
                }

                if (x >= 0 && x < 10 && y >= 0 && y < 10) {
                    attackResults.push(new AttackResult(x, y, 'miss'));
                }
            }
        }
    }


    private switchToNextPlayer(room: Room) {
        room.nextPlayerIndex = room.players[(room.nextPlayerCounter % 2)]?.index!;
        room.nextPlayerCounter = (room.nextPlayerCounter % 2) + 1;
    }

    public checkGameFinishOrEnd(room: Room): string | undefined {

        

        if (room.players.length === 0) {
            this.roomRepository.removeRoom(room);
            return undefined;
        }

        if (room.players.length === 1) {
            const winnerPlayerIndex = room.players[0]?.index;
            const player = this.playerRepository.getPlayerByIndex(winnerPlayerIndex!);
            if (!player) throw new Error('Finish: unable to find player');
            player.wins++;
            this.roomRepository.removeRoom(room);
            return winnerPlayerIndex;
        }

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
            this.roomRepository.removeRoom(room);
            return player.index;
        }
        return undefined;
    }

    public getWinners(): Player[] {
        return Array.from(this.playerRepository.getAllPlayers().values()).filter(player => player.wins > 0);
    }

    public removeDisconnectedPlayerFromRoom(playerIndex: string): Room | undefined {
        const room = this.roomRepository.getRoomByPlayerIndex(playerIndex);
        if (room) {
            this.roomRepository.removePlayerFromRoom(room.indexRoom, playerIndex);
            return this.roomRepository.getRoomByIndex(room.indexRoom);
        }
        return undefined;

    }

}
