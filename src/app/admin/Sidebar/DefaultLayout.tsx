import React from "react";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import StoreIcon from "@mui/icons-material/Store";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

interface AdminLayoutProps {
  children: React.ReactNode;
  sectionTitle?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  sectionTitle = "PRODUCTOS",
}) => {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar active={sectionTitle} onSelect={function (section: string): void {
        throw new Error("Function not implemented.");
      } } />
      <Box sx={{ flexGrow: 1, backgroundColor: "#fff", height: "100vh", p: 3 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <StoreIcon sx={{ color: "green" }} />
            <h2 style={{ margin: 0, color: "green" }}>{sectionTitle}</h2>
          </Box>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1, color: "green" }}
          >
            <span>Admin</span>
            <AccountCircleIcon />
          </Box>
        </Box>

        {/* Contenido */}
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
