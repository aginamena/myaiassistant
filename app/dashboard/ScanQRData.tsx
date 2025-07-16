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
    const fetchClientData = async () => {
      try {
        const res = await fetch("/api/client_data");
        const data = await res.json();
        console.log(data);
        setQrData(data.qrData);
        // Check if the client is authenticated
        if (data.clientIsAuthenticated) {
          setClientIsAuthenticated(true);
          // If authenticated, clear the interval
          clearInterval(interval);
          // Update the database
          fetch("/api/update_database", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ connectedToWhatsapp: true }),
          });
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };
    // Fetch data immediately
    fetchClientData();
    // Set the interval to poll every 5 seconds
    const interval = setInterval(fetchClientData, 5000);
    // Cleanup interval when the component is unmounted or client is authenticated
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Typography variant="h4" style={{ fontWeight: "bold" }}>
        Step1: Connect AI to your WhatsApp
      </Typography>

      <Typography variant="h6" sx={{ mb: 3 }}>
        Open WhatsApp on your phone, go to the settings, and scan the QR code.
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
      ) : qrData ? (
        <QRCode value={qrData} size={300} />
      ) : (
        <p>Loading QR code...</p>
      )}
    </div>
  );
}
