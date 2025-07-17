"use client";
import { Button, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

export default function ScanQRData() {
  const [qrData, setQrData] = useState<string>("");
  const [clientIsAuthenticated, setClientIsAuthenticated] = useState(false);
  const [qrExpired, setQrExpired] = useState(false);
  const [refreshClient, setRefreshClient] = useState(false);
  const { data } = useSession();

  const wwebjs_server =
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_WWEBJS_LOCAL_SERVER_URL
      : process.env.NEXT_PUBLIC_WWEBJS_LIVE_SERVER_URL;

  const clientId = "50823";

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;

    async function isClientAuthenticated() {
      try {
        const response = await fetch("/api/database");
        const { profile } = await response.json();

        if (profile?.connectedToWhatsapp) {
          setClientIsAuthenticated(true);
          return true;
        }
      } catch (error) {
        console.error("Failed to check client authentication:", error);
      }

      return false;
    }

    async function startPollingForClientReady() {
      async function checkStatus() {
        try {
          const response = await fetch(
            `${wwebjs_server}/is_client_created/${clientId}`
          );
          const { status } = await response.json();

          if (status === "client_created") {
            clearInterval(interval);
            clearTimeout(timeout);
            setClientIsAuthenticated(true);

            // Update DB in background
            fetch("/api/database", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                filter: { email: data?.user?.email ?? "" },
                document: { connectedToWhatsapp: true },
                collection: "Users",
              }),
            });
          }
        } catch (error) {
          console.error("Error polling client status:", error);
        }
      }

      // Start polling every 5 seconds
      interval = setInterval(checkStatus, 5000);
      checkStatus(); // immediate first call

      // Stop polling after 90 seconds (QR expired)
      timeout = setTimeout(() => {
        clearInterval(interval);
        console.warn("Polling stopped: QR expired.");
        setQrExpired(true); // 👈 mark QR as expired in UI
      }, 90000);
    }

    async function init() {
      const isAuthenticated = await isClientAuthenticated();

      if (!isAuthenticated) {
        try {
          const response = await fetch(
            `${wwebjs_server}/create_client/${clientId}`
          );
          const { status } = await response.json();
          setQrData(status);
          setQrExpired(false); // 👈 reset QR expired state if retrying

          startPollingForClientReady();
        } catch (error) {
          console.error("Error creating client:", error);
        }
      }
    }

    init();

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshClient]);

  return (
    <div>
      <Typography variant="h4" style={{ fontWeight: "bold" }}>
        Step 1: Connect AI to your WhatsApp
      </Typography>

      <Typography variant="h6" sx={{ mb: 3 }}>
        Open WhatsApp on your phone, go to the settings, and scan the QR code.
        You have 70 seconds before the qrcode becomes invalid
      </Typography>

      {clientIsAuthenticated ? (
        <>
          <Typography>
            AI has been successfully connected to your WhatsApp account.
          </Typography>
          <Link href="/dashboard?tab=create post">
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#0018FF",
                color: "#fff",
                textTransform: "none",
                fontWeight: 600,
                px: 4,
                py: 1.5,
                marginTop: "20px",
                borderRadius: "999px",
                fontSize: "1rem",
                "&:hover": {
                  backgroundColor: "#0012cc",
                },
              }}
            >
              Start creating your posts now.
            </Button>
          </Link>
        </>
      ) : qrExpired ? (
        <>
          <Typography>
            QRCode has expired you have to refresh to start again
          </Typography>
          <Button onClick={() => setRefreshClient(!refreshClient)}>
            Refresh
          </Button>
        </>
      ) : qrData ? (
        <QRCode value={qrData} size={300} />
      ) : (
        <p>Loading QR code...</p>
      )}
    </div>
  );
}
