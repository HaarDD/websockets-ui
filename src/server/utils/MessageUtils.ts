// src\server\utils\MessageUtils.ts

import { DefaultMessage } from "../dto/DefaultMessage";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseMessage(jsonString: string): DefaultMessage<any> {

    const parsed = JSON.parse(jsonString);

    if (typeof parsed.type !== 'string') {
        throw new Error('Invalid message: type is not string');
    } else if (typeof parsed.id !== 'number') {
        throw new Error('Invalid message: id is not number');
    } else if (!('data' in parsed)) {
        throw new Error('Invalid message: data is not defined');
    }

    return parsed;

}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateData<T>(data: any): T {

    if (typeof data === 'string') {
        try {
            data = JSON.parse(data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            throw new Error('Invalid data format: Unable to parse JSON string');
        }
    }

    if (typeof data !== 'object' || !data) {
        throw new Error('Invalid data format');
    }

    for (const key in ({} as T)) {
        if (!(key in data)) {
            throw new Error(`Missing required field: ${key}`);
        }
    }

    return data as T;
}