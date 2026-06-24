// Vendors.jsx — Admin vendor management table
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  TextField,
  InputAdornment,
  AppBar,
  Toolbar,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EventNoteIcon from "@mui/icons-material/EventNote";
import LogoutIcon from "@mui/icons-material/Logout";
import { getVendors, deleteVendor } from "../../api/axios";

const Vendors = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchVendors = async () => {
    try {
      const res = await getVendors();
      setVendors(res.data);
      setFiltered(res.data);
    } catch {
      setError(t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      vendors.filter(
        (v) =>
          v.shop_name.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q) ||
          v.district.toLowerCase().includes(q),
      ),
    );
  }, [search, vendors]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteVendor(deleteId);
      setVendors((prev) => prev.filter((v) => v._id !== deleteId));
    } catch {
      setError("Failed to delete vendor.");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f4f5" }}>
      {/* Admin Top Bar */}
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
              component={Link}
              to="/admin/dashboard"
              sx={{
                color: "rgba(255,255,255,0.6)",
                fontFamily: '"Lato", sans-serif',
                textTransform: "none",
                mr: 1,
              }}
            >
              Dashboard
            </Button>
            <IconButton onClick={handleLogout} sx={{ color: "#c4576a" }}>
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 5 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 4,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/admin/dashboard")}
              sx={{
                color: "#888",
                fontFamily: '"Lato", sans-serif',
                textTransform: "none",
                mb: 1,
                pl: 0,
              }}
            >
              Back
            </Button>
            <Typography
              sx={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: "2rem",
                fontWeight: 700,
              }}
            >
              {t("admin.manage_vendors")}
            </Typography>
          </Box>
          <Button
            component={Link}
            to="/admin/vendors/add"
            variant="contained"
            startIcon={<AddCircleIcon />}
            sx={{
              backgroundColor: "#7a1c2e",
              fontFamily: '"Lato", sans-serif',
              textTransform: "none",
              borderRadius: 2,
              px: 3,
              "&:hover": { backgroundColor: "#6a1826" },
            }}
          >
            {t("admin.add_vendor")}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Search */}
        <TextField
          size="small"
          placeholder={t("common.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: "#888" }} />
              </InputAdornment>
            ),
            sx: { fontFamily: '"Lato", sans-serif', borderRadius: 2 },
          }}
          sx={{ mb: 3, width: { xs: "100%", sm: 300 } }}
        />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress sx={{ color: "#7a1c2e" }} />
          </Box>
        ) : (
          <Paper
            elevation={0}
            sx={{
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#faf7f7" }}>
                    {[
                      "Shop Name",
                      "Category",
                      "District",
                      "Phone",
                      "Email",
                      "Rating",
                      "Featured",
                      t("admin.actions"),
                    ].map((h) => (
                      <TableCell
                        key={h}
                        sx={{
                          fontFamily: '"Lato", sans-serif',
                          fontWeight: 700,
                          fontSize: "0.8rem",
                          color: "#555",
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((vendor) => (
                    <TableRow
                      key={vendor._id}
                      hover
                      sx={{ "&:hover": { backgroundColor: "#fdf5f6" } }}
                    >
                      <TableCell
                        sx={{
                          fontFamily: '"Lato", sans-serif',
                          fontWeight: 600,
                        }}
                      >
                        {vendor.shop_name}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={vendor.category}
                          size="small"
                          sx={{
                            backgroundColor: "rgba(122,28,46,0.08)",
                            color: "#7a1c2e",
                            fontFamily: '"Lato", sans-serif',
                            fontSize: "0.72rem",
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{ fontFamily: '"Lato", sans-serif', color: "#555" }}
                      >
                        {vendor.district}
                      </TableCell>
                      <TableCell
                        sx={{ fontFamily: '"Lato", sans-serif', color: "#555" }}
                      >
                        {vendor.phone}
                      </TableCell>
                      <TableCell
                        sx={{ fontFamily: '"Lato", sans-serif', color: "#555" }}
                      >
                        {vendor.email || "—"}
                      </TableCell>
                      <TableCell sx={{ fontFamily: '"Lato", sans-serif' }}>
                        {vendor.rating || "—"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={vendor.featured ? "Yes" : "No"}
                          size="small"
                          sx={{
                            backgroundColor: vendor.featured
                              ? "rgba(5,150,105,0.1)"
                              : "rgba(0,0,0,0.06)",
                            color: vendor.featured ? "#059669" : "#888",
                            fontFamily: '"Lato", sans-serif',
                            fontSize: "0.7rem",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <Tooltip title={t("admin.edit_vendor")}>
                            <IconButton
                              size="small"
                              onClick={() =>
                                navigate(`/admin/vendors/edit/${vendor._id}`)
                              }
                              sx={{ color: "#2563eb" }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t("admin.delete_vendor")}>
                            <IconButton
                              size="small"
                              onClick={() => setDeleteId(vendor._id)}
                              sx={{ color: "#dc2626" }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        align="center"
                        sx={{
                          py: 6,
                          fontFamily: '"Lato", sans-serif',
                          color: "#888",
                        }}
                      >
                        {t("common.no_results")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Container>

      {/* Delete Confirm Dialog */}
      <Dialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle
          sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: "1.4rem" }}
        >
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: '"Lato", sans-serif' }}>
            {t("admin.confirm_delete")}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteId(null)}
            sx={{
              fontFamily: '"Lato", sans-serif',
              textTransform: "none",
              color: "#555",
            }}
          >
            {t("admin.cancel")}
          </Button>
          <Button
            onClick={handleDelete}
            disabled={deleting}
            variant="contained"
            sx={{
              backgroundColor: "#dc2626",
              fontFamily: '"Lato", sans-serif',
              textTransform: "none",
              borderRadius: 2,
              "&:hover": { backgroundColor: "#b91c1c" },
            }}
          >
            {deleting ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              t("admin.delete_vendor")
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Vendors;
