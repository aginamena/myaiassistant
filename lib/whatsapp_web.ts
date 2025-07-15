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
      backupSyncIntervalMs: 300000, // syncs every 5 minutes
      clientId:clientId,
    }),
  });

  client.on("qr", (qr) => {
    qrData = qr;
    console.log("QR Code received", qr);
  });

  client.on("ready", () => {
    console.log("WhatsApp client is ready");
  });
    client.on("authenticated", () => {
    console.log("Client is authenticated");
    clientIsAuthenticated = true;
  });

  client.on("message", async (message) => {
    if (message.from === "16134628836@c.us") {
      await client.sendMessage(message.from, "Hello Divine!");
    }
  });

  client.initialize();
}

export const getQRData = () => qrData;
export const getClient = () => client;
export const isClientAuthenticated = () => clientIsAuthenticated;
