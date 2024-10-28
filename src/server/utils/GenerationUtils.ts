// src\server\utils\GenerationUtils.ts

export function generateUniqueIndex(): string {
    return Math.random().toString(36).substring(2, 11);
}
