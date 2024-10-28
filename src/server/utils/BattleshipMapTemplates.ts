import { ShipType } from "../dto/Enums";
import { AddShipsRequest } from "../dto/Requests";

export function getRandomMap(gameIndex: string, indexPlayer: string): AddShipsRequest | undefined {
  const templates: AddShipsRequest[] = [
    {
      ships: [
        { position: { x: 6, y: 0 }, direction: true, type: ShipType.Huge, length: 4 },
        { position: { x: 4, y: 6 }, direction: true, type: ShipType.Large, length: 3 },
        { position: { x: 0, y: 5 }, direction: true, type: ShipType.Large, length: 3 },
        { position: { x: 1, y: 2 }, direction: false, type: ShipType.Medium, length: 2 },
        { position: { x: 8, y: 2 }, direction: false, type: ShipType.Medium, length: 2 },
        { position: { x: 6, y: 6 }, direction: false, type: ShipType.Medium, length: 2 },
        { position: { x: 1, y: 9 }, direction: false, type: ShipType.Small, length: 1 },
        { position: { x: 0, y: 0 }, direction: true, type: ShipType.Small, length: 1 },
        { position: { x: 3, y: 0 }, direction: true, type: ShipType.Small, length: 1 },
        { position: { x: 2, y: 7 }, direction: false, type: ShipType.Small, length: 1 },
      ],
      gameId: gameIndex,
      indexPlayer: indexPlayer
    },
    {
      ships: [
        { position: { x: 3, y: 2 }, direction: false, type: ShipType.Huge, length: 4 },
        { position: { x: 1, y: 2 }, direction: true, type: ShipType.Large, length: 3 },
        { position: { x: 5, y: 6 }, direction: true, type: ShipType.Large, length: 3 },
        { position: { x: 7, y: 5 }, direction: true, type: ShipType.Medium, length: 2 },
        { position: { x: 1, y: 6 }, direction: false, type: ShipType.Medium, length: 2 },
        { position: { x: 8, y: 3 }, direction: false, type: ShipType.Medium, length: 2 },
        { position: { x: 8, y: 1 }, direction: false, type: ShipType.Small, length: 1 },
        { position: { x: 0, y: 0 }, direction: true, type: ShipType.Small, length: 1 },
        { position: { x: 8, y: 8 }, direction: true, type: ShipType.Small, length: 1 },
        { position: { x: 5, y: 0 }, direction: false, type: ShipType.Small, length: 1 },
      ],
      gameId: gameIndex,
      indexPlayer: indexPlayer
    },
    {
      ships: [
        { position: { x: 2, y: 0 }, direction: true, type: ShipType.Huge, length: 4 },
        { position: { x: 1, y: 7 }, direction: false, type: ShipType.Large, length: 3 },
        { position: { x: 8, y: 1 }, direction: true, type: ShipType.Large, length: 3 },
        { position: { x: 7, y: 5 }, direction: false, type: ShipType.Medium, length: 2 },
        { position: { x: 8, y: 7 }, direction: true, type: ShipType.Medium, length: 2 },
        { position: { x: 5, y: 7 }, direction: false, type: ShipType.Medium, length: 2 },
        { position: { x: 5, y: 2 }, direction: true, type: ShipType.Small, length: 1 },
        { position: { x: 2, y: 5 }, direction: true, type: ShipType.Small, length: 1 },
        { position: { x: 4, y: 0 }, direction: true, type: ShipType.Small, length: 1 },
        { position: { x: 0, y: 2 }, direction: false, type: ShipType.Small, length: 1 },
      ],
      gameId: gameIndex,
      indexPlayer: indexPlayer
    },
    {
      ships: [
        { position: { x: 1, y: 5 }, direction: false, type: ShipType.Huge, length: 4 },
        { position: { x: 3, y: 0 }, direction: true, type: ShipType.Large, length: 3 },
        { position: { x: 2, y: 7 }, direction: true, type: ShipType.Large, length: 3 },
        { position: { x: 6, y: 6 }, direction: false, type: ShipType.Medium, length: 2 },
        { position: { x: 9, y: 0 }, direction: true, type: ShipType.Medium, length: 2 },
        { position: { x: 8, y: 3 }, direction: true, type: ShipType.Medium, length: 2 },
        { position: { x: 8, y: 8 }, direction: true, type: ShipType.Small, length: 1 },
        { position: { x: 5, y: 0 }, direction: true, type: ShipType.Small, length: 1 },
        { position: { x: 9, y: 6 }, direction: false, type: ShipType.Small, length: 1 },
        { position: { x: 6, y: 4 }, direction: false, type: ShipType.Small, length: 1 }
      ],
      gameId: gameIndex,
      indexPlayer: indexPlayer
    },
    {
      ships: [
        { position: { x: 5, y: 7 }, direction: false, type: ShipType.Huge, length: 4 },
        { position: { x: 2, y: 1 }, direction: true, type: ShipType.Large, length: 3 },
        { position: { x: 0, y: 6 }, direction: true, type: ShipType.Large, length: 3 },
        { position: { x: 4, y: 3 }, direction: false, type: ShipType.Medium, length: 2 },
        { position: { x: 6, y: 9 }, direction: false, type: ShipType.Medium, length: 2 },
        { position: { x: 2, y: 8 }, direction: false, type: ShipType.Medium, length: 2 },
        { position: { x: 6, y: 0 }, direction: true, type: ShipType.Small, length: 1 },
        { position: { x: 4, y: 5 }, direction: false, type: ShipType.Small, length: 1 },
        { position: { x: 8, y: 0 }, direction: true, type: ShipType.Small, length: 1 },
        { position: { x: 0, y: 4 }, direction: false, type: ShipType.Small, length: 1 }
      ],
      gameId: gameIndex,
      indexPlayer: indexPlayer
    },
    {
      ships: [
        { position: { x: 4, y: 9 }, direction: false, type: ShipType.Huge, length: 4 },
        { position: { x: 0, y: 6 }, direction: false, type: ShipType.Large, length: 3 },
        { position: { x: 2, y: 0 }, direction: true, type: ShipType.Large, length: 3 },
        { position: { x: 5, y: 5 }, direction: true, type: ShipType.Medium, length: 2 },
        { position: { x: 2, y: 8 }, direction: true, type: ShipType.Medium, length: 2 },
        { position: { x: 0, y: 4 }, direction: false, type: ShipType.Medium, length: 2 },
        { position: { x: 4, y: 1 }, direction: true, type: ShipType.Small, length: 1 },
        { position: { x: 3, y: 4 }, direction: false, type: ShipType.Small, length: 1 },
        { position: { x: 7, y: 5 }, direction: false, type: ShipType.Small, length: 1 },
        { position: { x: 0, y: 9 }, direction: false, type: ShipType.Small, length: 1 }
      ],
      gameId: gameIndex,
      indexPlayer: indexPlayer
    },
    {
      ships: [
        { position: { x: 5, y: 9 }, direction: false, type: ShipType.Huge, length: 4 },
        { position: { x: 0, y: 8 }, direction: false, type: ShipType.Large, length: 3 },
        { position: { x: 2, y: 2 }, direction: false, type: ShipType.Large, length: 3 },
        { position: { x: 3, y: 6 }, direction: false, type: ShipType.Medium, length: 2 },
        { position: { x: 8, y: 5 }, direction: true, type: ShipType.Medium, length: 2 },
        { position: { x: 2, y: 0 }, direction: false, type: ShipType.Medium, length: 2 },
        { position: { x: 0, y: 2 }, direction: false, type: ShipType.Small, length: 1 },
        { position: { x: 6, y: 3 }, direction: false, type: ShipType.Small, length: 1 },
        { position: { x: 0, y: 5 }, direction: false, type: ShipType.Small, length: 1 },
        { position: { x: 7, y: 0 }, direction: true, type: ShipType.Small, length: 1 }
      ],
      gameId: gameIndex,
      indexPlayer: indexPlayer
    },
  ];

  const randomIndex = Math.floor(Math.random() * templates.length);

  return templates[randomIndex];
}







