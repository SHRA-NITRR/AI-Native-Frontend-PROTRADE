import { db } from "./db";
import { dummy } from "@shared/schema";

export interface IStorage {
  getDummy(): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  async getDummy(): Promise<any[]> {
    return await db.select().from(dummy);
  }
}

export const storage = new DatabaseStorage();