import { Box, Drawer, Tab, Tabs, Toolbar } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function DrawerCmp({
  mobileOpen,
  handleDrawerToggle,
}: {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}) {
  const tabLabels = useMemo(
    () => ["create post", "automate post", "connect to whatsapp"],
    []
  );
  const [tabIndex, setTabIndex] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const drawerWidth = 240;

  useEffect(() => {
    const index = tabLabels.findIndex(
      (label) => label.toLowerCase() === String(tab).toLowerCase()
    );
    if (index >= 0) setTabIndex(index);
  }, [tab, tabLabels]);

  const handleTabChange = (event: unknown, newValue: number) => {
    console.log(event);
    setTabIndex(newValue);
    const selectedTab = tabLabels[newValue].toLowerCase();
    router.push(`/dashboard?tab=${selectedTab}`);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Tabs
        orientation="vertical"
        value={tabIndex}
        onChange={handleTabChange}
        sx={{ borderRight: 1, borderColor: "divider" }}
      >
        {tabLabels.map((label, index) => (
          <Tab key={index} label={label} />
        ))}
      </Tabs>
    </div>
  );

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: 0 }}>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
