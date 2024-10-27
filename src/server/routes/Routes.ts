// src\server\routes\Routes.ts

import { DefaultMessage } from '../dto/DefaultMessage';
import { parseMessage, validateData } from '../utils/MessageUtils';
import { GameController } from '../controller/GameController';
import { AddShipsRequest, AddToRoomRequest, AttackRequest, PlayerRequest, RandomAttackRequest } from '../dto/Requests';


export class WebSocketRoutes {
    private gameController = GameController.getInstance();

    public handleMessage(playerIndex: string, message: string) {
        try {
            const defaultMessage: DefaultMessage = parseMessage(message);

            switch (defaultMessage.type) {
                case 'reg':
                    const playerData = validateData<PlayerRequest>(defaultMessage.data);
                    this.gameController.registerPlayer(playerIndex, playerData);
                    break;
                case 'create_room':
                    this.gameController.createRoom(playerIndex);
                    break;
                case 'add_user_to_room':
                    const roomData = validateData<AddToRoomRequest>(defaultMessage.data);
                    this.gameController.addPlayerToRoom(playerIndex, roomData.indexRoom);
                    break;
                case 'add_ships':
                    const shipsData = validateData<AddShipsRequest>(defaultMessage.data);
                    this.gameController.addShipsToRoom(playerIndex, shipsData);
                    break;
                case 'attack':
                    const attackData = validateData<AttackRequest>(defaultMessage.data);
                    this.gameController.attack(playerIndex, attackData);
                    break;
                case 'randomAttack':
                    const randomAttackData = validateData<RandomAttackRequest>(defaultMessage.data);
                    this.gameController.randomAttack(playerIndex, randomAttackData);
                break;

                default:
                    throw new Error('Unexpected request type!');
            }
        }
        catch (error) {
            const errorMessage = (error as Error).message ? (error as Error).message : '';
            // eslint-disable-next-line no-console
            console.log(`Error: "${errorMessage}", player: "${playerIndex}".`);
        }
    }

}


