// src\server\dto\DefaultMessage.ts

export interface DefaultMessage<T = any> {
    type: string;
    data: T;
    id: number;
}