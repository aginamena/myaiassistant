"use client";
import { Box, Typography } from "@mui/material";
import { useEffect } from "react";

export default function Contacts() {
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/all_whatsapp_contacts/88367"
        );
        const contacts = await response.json();
        console.log(contacts);
        if (contacts?.status === "client created") {
        }
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      }
    };

    fetchContacts();
  }, []);
  return (
    <Box>
      <Typography>Choose the contacts you want to send this post to</Typography>
      Contacts
    </Box>
  );
}
