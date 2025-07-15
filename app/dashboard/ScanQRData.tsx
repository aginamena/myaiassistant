"use client";
import { Button, Typography } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

export default function ScanQRData() {
  const [qrData, setQrData] = useState<string>("");
  const [clientIsAuthenticated, setClientIsAuthenticated] =
    useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("/api/client_data")
        .then((res) => res.json())
        .then((data) => {
          setQrData(data.qrData);
          if (data.clientIsAuthenticated) {
            setClientIsAuthenticated(true);
            clearInterval(interval);
          }
        });
    }, 5000); // poll every 5 seconds

    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      <h1>Connect AI to your WhatsApp</h1>
      <p>
        Open WhatsApp on your phone, go to the settings, and scan the QR code.
      </p>

      {clientIsAuthenticated ? (
        <>
          <Typography>
            AI has been successfully connected to your WhatsApp account.
          </Typography>
          <Link href="/dashboard?tab=automate-post">
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
              Start automating your posts now.
            </Button>
          </Link>
        </>
      ) : qrData ? (
        <QRCode value={qrData} size={256} />
      ) : (
        <p>Loading QR code...</p>
      )}
    </div>
  );
}
