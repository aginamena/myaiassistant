"use client";
import { Button, CircularProgress, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ConnectToWhatsapp() {
  const { data } = useSession();

  const previousSessionId = localStorage.getItem("sessionId");

  const [qrImg, setQrImg] = useState<string>("");
  const [clientIsAuthenticated, setClientIsAuthenticated] = useState(false);
  const [qrExpired, setQrExpired] = useState(false);
  const [sessionId, setSessionId] = useState(
    previousSessionId || Date.now().toString()
  );
  const [sessionStatus, setSessionStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const wwebjs_server =
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_WWEBJS_LOCAL_SERVER_URL
      : process.env.NEXT_PUBLIC_WWEBJS_LIVE_SERVER_URL;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;
    setLoading(true);
    async function isClientAuthenticated() {
      try {
        const response = await fetch("/api/users");
        const profile = await response.json();

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
            `${wwebjs_server}/client_status/${sessionId}`
          );
          const { status } = await response.json();
          setSessionStatus(status);
          if (status === "session_created" || status == "inChat") {
            clearInterval(interval);
            clearTimeout(timeout);
            setClientIsAuthenticated(true);
            localStorage.setItem("sessionId", sessionId);
            // Update DB in background
            fetch("/api/users", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                filter: { email: data?.user?.email ?? "" },
                document: { connectedToWhatsapp: true, id: sessionId },
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

      // Stop polling after 60 seconds (QR expired)
      timeout = setTimeout(() => {
        clearInterval(interval);
        console.warn("Polling stopped: QR expired.");
        setQrExpired(true); // 👈 mark QR as expired in UI
      }, 60000);
    }

    async function init() {
      try {
        const isAuthenticated = await isClientAuthenticated();

        if (!isAuthenticated) {
          const response = await fetch(
            `${wwebjs_server}/create_session/${sessionId}`
          );
          const { qrImg } = await response.json();
          setQrImg(qrImg);
          setQrExpired(false);

          startPollingForClientReady();
        }
      } catch (error) {
        console.error("Error creating client:", error);
        alert(
          "An error occurred. Pls reload the page and inform Mena about this"
        );
      }
      setLoading(false);
    }

    init();

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  if (loading) {
    return (
      <>
        <Typography variant="h4" style={{ fontWeight: "bold" }}>
          Step 1: Connect AI to your WhatsApp
        </Typography>

        <Typography variant="h6" sx={{ mb: 3 }}>
          Open WhatsApp on your phone, go to the settings, and scan the QR code.
          You have 60 seconds before the qrcode becomes invalid
        </Typography>
        <p>Loading QR code... Just a moment</p>
        <CircularProgress />
      </>
    );
  }

  return (
    <div>
      <Typography variant="h4" style={{ fontWeight: "bold" }}>
        Step 1: Connect to your WhatsApp
      </Typography>

      <Typography variant="h6" sx={{ mb: 3 }}>
        Open WhatsApp on your phone, go to the settings, and scan the QR code.
        You have 40 seconds before the qrcode becomes invalid
      </Typography>
      {sessionStatus && (
        <Typography style={{ marginBottom: "10px" }}>
          Current Status: {sessionStatus}
        </Typography>
      )}
      {clientIsAuthenticated ? (
        <>
          <Typography>
            You have successfully connected your Whatsapp account.
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
          <Button
            variant="contained"
            size="large"
            sx={{ mt: 5 }}
            onClick={() => {
              setLoading(true);
              setSessionId(previousSessionId || Date.now().toString());
            }}
          >
            Refresh
          </Button>
        </>
      ) : (
        qrImg && <Image src={qrImg} alt="qrcode" height={300} width={300} />
      )}
    </div>
  );
}
