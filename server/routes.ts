import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.dummy.get.path, async (req, res) => {
    const data = await storage.getDummy();
    res.json({ status: "ok" });
  });

  return httpServer;
}