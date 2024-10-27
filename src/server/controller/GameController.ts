// src\server\controller\GameController.ts

import { broadcastMessage, unicastMessage } from '../../server';
import { AddShipsRequest, AttackRequest, PlayerRequest, RandomAttackRequest } from '../dto/Requests';
import { Player } from '../entity/Player';

import { GameService } from '../service/GameService';
import { ErrorMessages } from '../utils/ErrorMessages';
import ResponseBuilder from '../utils/ResponseBuilder';


export class GameController {
  private static instance: GameController;

  private constructor() { }

  public static getInstance(): GameController {
    if (!GameController.instance) {
      GameController.instance = new GameController();
    }
    return GameController.instance;
  }

  private gameService = GameService.getInstance();

  registerPlayer(playerIndex: string, playerRequest: PlayerRequest) {
    try {
      const player = this.gameService.registerPlayer(playerIndex, playerRequest);
      this.sendPlayerResponse(playerIndex, player, false, '');
      this.postRegisterActions();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : ErrorMessages.UnknownError;
      this.sendPlayerResponse(playerIndex, new Player(), true, errorMessage);
    }
  }

  private sendPlayerResponse(playerIndex: string, player: Player, error: boolean, errorText: string) {
    const response = ResponseBuilder.buildPlayerResponse({
      name: player.name,
      index: player.index,
      error,
      errorText,
    });
    unicastMessage(playerIndex, response);
  }

  private postRegisterActions() {
    this.sendToAllFreeRooms();
    this.checkWinners();
  }

  private sendToAllFreeRooms() {
    broadcastMessage(this.gameService.getFreeRooms());
  }

  public createRoom(playerIndex: string) {
    this.gameService.createRoom(playerIndex);
    this.postRegisterActions();
  }

  public addPlayerToRoom(playerIndex: string, roomIndex: string) {
    this.gameService.addUserToRoom(playerIndex, roomIndex);
    this.sendToAllFreeRooms();
    this.updateRoom(roomIndex);
  }

  public updateRoom(roomIndex: string) {
    const room = this.gameService.updateRoom(roomIndex);
    room.players.forEach(player => {
      const response = ResponseBuilder.buildCreateGameResponse({
        idGame: room.indexRoom,
        idPlayer: player.index
      });
      unicastMessage(player.index, response);
    });
  }

  public addShipsToRoom(playerIndex: string, shipsData: AddShipsRequest) {
    if (this.gameService.addShipsToRoom(playerIndex, shipsData)) {
      this.startGame(shipsData.gameId);
    }
  }

  public startGame(roomIndex: string) {
    const room = this.gameService.startGame(roomIndex);
    room.players.forEach(player => {
      this.sendGameStartAndTurnMessages(player.index, room);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private sendGameStartAndTurnMessages(playerIndex: string, room: any) {
    const playerShips = room.ships.get(playerIndex) || [];
    const responseStartGame = ResponseBuilder.buildStartGameResponse({
      ships: playerShips,
      currentPlayerIndex: playerIndex,
    });
    const responseTurn = ResponseBuilder.buildTurnResponse({
      currentPlayer: room.nextPlayerIndex,
    });
    unicastMessage(playerIndex, responseStartGame);
    unicastMessage(playerIndex, responseTurn);
  }

  public attack(playerIndex: string, attackData: AttackRequest) {
    const room = this.gameService.getRoom(attackData.gameId);
    const attackStatus = this.gameService.attack(playerIndex, attackData);
    if (room) {
      this.broadcastAttackAndTurn(room, playerIndex, attackData, attackStatus);
      this.checkForWinnerAndUpdate(room);
    }
  }

  public randomAttack(playerIndex: string, randomAttackData: RandomAttackRequest) {
    const attackData = this.generateRandomAttackData(randomAttackData);
    this.attack(playerIndex, attackData);
  }

  private generateRandomAttackData(randomAttackData: RandomAttackRequest): AttackRequest {
    return {
      gameId: randomAttackData.gameId,
      x: Math.floor(Math.random() * 10),
      y: Math.floor(Math.random() * 10),
      indexPlayer: randomAttackData.indexPlayer
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private checkForWinnerAndUpdate(room: any): boolean {
    const winner = this.gameService.checkFinishGame(room);
    if (winner) {
      const responseWinner = ResponseBuilder.buildFinishGameResponse({ winPlayer: winner });
      room.players.forEach((player: { index: string; }) => unicastMessage(player.index, responseWinner));
      this.checkWinners();
      return true;
    }
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private broadcastAttackAndTurn(room: any, playerIndex: string, attackData: AttackRequest, attackStatus: string) {
    room.players.forEach((player: { index: string; }) => {
      const responseBuildAttack = ResponseBuilder.buildAttackResponse({
        position: { x: attackData.x, y: attackData.y },
        currentPlayer: playerIndex,
        status: attackStatus
      });
      const responseTurn = ResponseBuilder.buildTurnResponse({
        currentPlayer: room.nextPlayerIndex,
      });
      unicastMessage(player.index, responseBuildAttack);
      unicastMessage(player.index, responseTurn);
    });
  }

  public checkWinners() {
    const winners = this.gameService.getWinners();
    if (winners?.length) {
      const response = ResponseBuilder.buildUpdateWinnersResponse(
        winners.map(player => ({
          name: player.name,
          wins: player.wins,
        }))
      );
      broadcastMessage(response);
    }
  }
}
