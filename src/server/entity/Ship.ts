// src\server\entity\Ship.ts

export interface Ship {
    position: { x: number; y: number };
    direction: boolean;
    length: number;
    type: 'small' | 'medium' | 'large' | 'huge';
    hits: number;
}
