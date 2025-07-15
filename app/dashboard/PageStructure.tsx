"use client";
import DrawerCmp from "@/components/DrawerCmp";
import Header from "@/components/Header";
import { useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";

export default function PageStructure() {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  return (
    <>
      <Header isMobile={isMobile} handleDrawerToggle={handleDrawerToggle} />
      <DrawerCmp
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
    </>
  );
}
