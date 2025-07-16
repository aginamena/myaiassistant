import mongoose from "mongoose";
import { Client, RemoteAuth } from "whatsapp-web.js";
import { MongoStore } from "wwebjs-mongo";


let client: Client;
let qrData = "";
let clientIsAuthenticated = false;

export async function initializeClient(clientId:string) {
  if (client) return;

  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log("Connected to MongoDB");

  const store = new MongoStore({ mongoose });

  client = new Client({
    authStrategy: new RemoteAuth({
      store,
      backupSyncIntervalMs:604800000, //updates every 1 week
      clientId:clientId,
    }),
  });

  client.on("qr", (qr) => {
    qrData = qr;
  });

  client.on("authenticated", async () => {
    clientIsAuthenticated = true;
  });

  client.initialize();
}

export const getQRData = () => qrData;
export const getClient = () => client;
export const isClientAuthenticated = () => clientIsAuthenticated;
