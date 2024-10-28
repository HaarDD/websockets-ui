// src\server\entity\Player.ts

export class Player {
    constructor(
        public name: string = '',
        public password: string = '',
        public index: string = '',
        public wins: number = 0
    ) {}
}