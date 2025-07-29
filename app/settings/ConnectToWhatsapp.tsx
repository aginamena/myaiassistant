"use client";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";

export default function ConnectToWhatsapp() {
  const [qrImg, setQrImg] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [qrExpired, setQrExpired] = useState(false);
  const [isClientConnected, setIsClientConnected] = useState(false);
  const [clientId, setClientId] = useState(
    Date.now().toString() + Math.random().toString(36).substring(2, 15)
  );

  const interval = useRef<NodeJS.Timeout | null>(null);
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const { data } = useSession();

  const wwebjs_server =
    process.env.NODE_ENV === "development"
      ? "http://localhost:5000"
      : process.env.NEXT_PUBLIC_WWEBJS_LIVE_SERVER_URL;

  async function connectToWhatsapp() {
    try {
      const req = await fetch(
        `${wwebjs_server}/connect-to-whatsapp/${clientId}`
      );
      const res = await req.json();

      if (res.qrImg) {
        setLoading(false);
        setQrImg(res.qrImg);
        interval.current = setInterval(clientIsConnected, 2000); // runs every 2 seconds
        timeout.current = setTimeout(() => {
          clearInterval(interval.current as NodeJS.Timeout);
          setQrExpired(true); // mark QR as expired in UI
        }, 60000); // 40 seconds timeout
      } else if (res.error) {
        console.error(res.error);
      }
    } catch (error) {
      console.error("Error connecting to WhatsApp:", error);
    }
  }

  async function clientIsConnected() {
    try {
      const { status } = await (
        await fetch(`${wwebjs_server}/is-connected/${clientId}`)
      ).json();
      if (status === "client_authenticated") {
        sessionStorage.setItem("clientId", clientId);
        fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filter: { email: data?.user?.email },
            document: { connectedToWhatsapp: true, id: clientId },
          }),
        });
      } else if (status === "client_ready") {
        clearInterval(interval.current as NodeJS.Timeout);
        clearTimeout(timeout.current as NodeJS.Timeout);
        setQrImg("");
        setIsClientConnected(true);
      } else {
        console.log("Not connected yet");
      }
    } catch (error) {
      console.error("Error checking WhatsApp connection:", error);
    }
  }

  useEffect(() => {
    async function init() {
      setLoading(true);
      setQrExpired(false);
      try {
        const profile = await (await fetch("api/users")).json();
        if (profile.connectedToWhatsapp) {
          sessionStorage.setItem("clientId", profile.id);
          clearInterval(interval.current as NodeJS.Timeout);
          clearTimeout(timeout.current as NodeJS.Timeout);
          setLoading(false);
          setIsClientConnected(true);
          setQrImg("");
        } else {
          connectToWhatsapp();
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }

    init();

    return () => {
      clearInterval(interval.current as NodeJS.Timeout);
      clearTimeout(timeout.current as NodeJS.Timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  if (loading) {
    return (
      <>
        <Typography sx={{ mb: 3 }}>
          Setting things up... Please wait a moment
        </Typography>
        <CircularProgress />
      </>
    );
  }

  if (qrExpired) {
    return (
      <Box>
        <Typography sx={{ mb: 3 }}>
          The QR code has expired. Please restart the connection process.
        </Typography>
        <Button
          variant="contained"
          onClick={() =>
            setClientId(
              Date.now().toString() +
                Math.random().toString(36).substring(2, 15)
            )
          }
        >
          Try Again
        </Button>
      </Box>
    );
  }

  if (qrImg) {
    return (
      <>
        <Typography variant="body1" sx={{ whiteSpace: "pre-line", mb: 2 }}>
          Open WhatsApp on your phone.{"\n"}• On <strong>Android</strong>: Tap
          the <em>three vertical dots</em> in the top-right corner →{" "}
          <strong>Linked devices</strong> → <strong>Link a device</strong>
          {"\n"}• On <strong>iOS</strong>: Go to <strong>Settings</strong> →{" "}
          <strong>Linked Devices</strong> → <strong>Link a Device</strong>
          <br />
          <br />
          ⚠️ This QR code is valid for only <strong>60 seconds</strong>.
        </Typography>
        <QRCode value={qrImg} size={350} />
      </>
    );
  }

  return (
    <Box>
      {isClientConnected && (
        <>
          <Typography sx={{ mb: 3 }}>
            ✅ You are successfully connected to WhatsApp!
            <br />
            Now, select the WhatsApp groups where you would like your posts to
            be sent.
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push("settings?step=1")}
            sx={{
              backgroundColor: "#0018FF",
              color: "#fff",
              textTransform: "none",
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: "999px",
              fontSize: "1rem",
              "&:hover": {
                backgroundColor: "#0012cc",
              },
            }}
          >
            Select Groups
          </Button>
        </>
      )}
    </Box>
  );
}
