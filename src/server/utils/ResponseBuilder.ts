// src\server\utils\ResponseBuilder.ts

import PlayerResponse from '../response_templates/PlayerResponse.json';
import UpdateRoomResponse from '../response_templates/UpdateRoomResponse.json';
import CreateGameResponse from '../response_templates/CreateGameResponse.json';
import StartGameResponse from '../response_templates/StartGameResponse.json';
import AttackResponse from '../response_templates/AttackResponse.json';
import TurnResponse from '../response_templates/TurnResponse.json';
import FinishGameResponse from '../response_templates/FinishGameResponse.json';
import UpdateWinnersResponse from '../response_templates/UpdateWinnersResponse.json';

class ResponseBuilder {

  static buildPlayerResponse(data: {
    name: string;
    index: string;
    error: boolean;
    errorText: string
  }): string {
    const template = JSON.parse(JSON.stringify(PlayerResponse));
    template.data = JSON.stringify({ ...data });

    return JSON.stringify(template);
  }

  static buildRoomsResponse(data: {
    roomId: string;
    roomUsers: {
      name: string;
      index: string
    }[]
  }[]): string {
    const template = JSON.parse(JSON.stringify(UpdateRoomResponse));
    template.data = JSON.stringify(data);

    return JSON.stringify(template);
  }

  static buildCreateGameResponse(data: {
    idGame: string;
    idPlayer: string
  }): string {
    const template = JSON.parse(JSON.stringify(CreateGameResponse));
    template.data = JSON.stringify({ ...data });

    return JSON.stringify(template);
  }

  static buildStartGameResponse(data: {
    ships: {
      position: { x: number; y: number };
      direction: boolean;
      length: number;
      type: string;
    }[];
    currentPlayerIndex: string;
  }): string {
    const template = JSON.parse(JSON.stringify(StartGameResponse));
    template.data = JSON.stringify({
      ships: data.ships,
      currentPlayerIndex: data.currentPlayerIndex
    });

    return JSON.stringify(template);
  }

  static buildAttackResponse(data: {
    position: { x: number; y: number };
    currentPlayer: string;
    status: string;
  }): string {

    const template = JSON.parse(JSON.stringify(AttackResponse));
    template.data = JSON.stringify({
      position: data.position,
      currentPlayer: data.currentPlayer,
      status: data.status
    });

    return JSON.stringify(template);
  }

  static buildTurnResponse(data: {
    currentPlayer: string;
  }): string {
    const template = JSON.parse(JSON.stringify(TurnResponse));
    template.data = JSON.stringify({
      currentPlayer: data.currentPlayer
    });

    return JSON.stringify(template);
  }

  static buildFinishGameResponse(data: {
    winPlayer: string;
  }): string {
    const template = JSON.parse(JSON.stringify(FinishGameResponse));
    template.data = JSON.stringify({
      winPlayer: data.winPlayer
    });

    return JSON.stringify(template);
  }

  static buildUpdateWinnersResponse(data: {
    name: string;
    wins: number;
  }[]): string {
    const template = JSON.parse(JSON.stringify(UpdateWinnersResponse));
    template.data = JSON.stringify(data);

    return JSON.stringify(template);
  }


}
export default ResponseBuilder;
