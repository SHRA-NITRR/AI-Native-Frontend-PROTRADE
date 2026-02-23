import type { Express } from "express";
import { createServer, type Server } from "http";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Dummy route removed: no storage implementation.

  return httpServer;
}