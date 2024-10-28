// src\server\routes\Routes.ts

import { DefaultMessage } from '../dto/DefaultMessage';
import { parseMessage, validateData } from '../utils/MessageUtils';
import { GameController } from '../controller/GameController';
import { AddShipsRequest, AddToRoomRequest, AttackRequest, PlayerRequest, RandomAttackRequest } from '../dto/Requests';
import { generateUniqueIndex } from '../utils/GenerationUtils';
import { Room } from '../entity/Room';
import { getRandomMap } from '../utils/BattleshipMapTemplates';


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
                case 'single_play':
                    const aiIndex = generateUniqueIndex();
                    const aiRequest: PlayerRequest = { name: 'AI_Opponent', password: 'ai-pass' };

                    this.gameController.registerPlayer(aiIndex, aiRequest);

                    const room = this.gameController.createRoom(playerIndex);

                    this.gameController.addPlayerToRoom(aiIndex, room.indexRoom);

                    this.gameController.addShipsToRoom(aiIndex, getRandomMap(room.indexRoom, aiIndex)!);

                    this.startAiLoop(room, aiIndex);

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

    private startAiLoop(room: Room, aiIndex: string) {
        const aiAttackInterval = setInterval(() => {
            try{
                const attackData = {
                    gameId: room.indexRoom,
                    x: Math.floor(Math.random() * 10),
                    y: Math.floor(Math.random() * 10),
                    indexPlayer: aiIndex,
                };
                
                this.gameController.attack(aiIndex, attackData);
    
                if (room && this.gameController.checkForWinnerAndUpdate(room)) {
                    clearInterval(aiAttackInterval);
                }
            }
            catch {
            }
        }, 1500); 
    }
}