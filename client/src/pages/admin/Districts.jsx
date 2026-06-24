// Districts.jsx — Admin manage districts (list + add + delete)
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  IconButton as MuiIconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EventNoteIcon from "@mui/icons-material/EventNote";
import LogoutIcon from "@mui/icons-material/Logout";
import { getDistricts, createDistrict, deleteDistrict } from "../../api/axios";

const Districts = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getDistricts();
        setItems(res.data);
      } catch {
        setError(t("common.error"));
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleAdd = async () => {
    if (!name.trim()) return;
    try {
      const res = await createDistrict({
        name: name.trim(),
        state: "Tamil Nadu",
      });
      setItems((prev) => [...prev, res.data]);
      setName("");
    } catch {
      setError("Failed to create district.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDistrict(id);
      setItems((prev) => prev.filter((x) => x._id !== id));
    } catch {
      setError("Failed to delete.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f4f5" }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "#1a0a0e",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <EventNoteIcon sx={{ color: "#c4576a", mr: 1 }} />
            <Typography
              sx={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: "1.3rem",
                fontWeight: 700,
                color: "#fff",
                flexGrow: 1,
              }}
            >
              Vizha Admin
            </Typography>
            <Button
              onClick={() => navigate("/admin/dashboard")}
              sx={{
                color: "rgba(255,255,255,0.6)",
                fontFamily: '"Lato", sans-serif',
                textTransform: "none",
                mr: 1,
              }}
            >
              Dashboard
            </Button>
            <MuiIconButton onClick={handleLogout} sx={{ color: "#c4576a" }}>
              <LogoutIcon />
            </MuiIconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 5 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/admin/dashboard")}
          sx={{ color: "#888", textTransform: "none", mb: 2 }}
        >
          Back
        </Button>
        <Typography
          sx={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: "2rem",
            fontWeight: 700,
            mb: 3,
          }}
        >
          Manage Districts
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Paper sx={{ p: 3, mb: 3 }} elevation={0}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              placeholder="New district name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={handleAdd}
              sx={{ backgroundColor: "#7a1c2e" }}
            >
              Add
            </Button>
          </Box>
        </Paper>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper elevation={0} sx={{ p: 2 }}>
            <List>
              {items.map((d) => (
                <React.Fragment key={d._id}>
                  <ListItem
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() => handleDelete(d._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText primary={d.name} secondary={d.state || ""} />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default Districts;
