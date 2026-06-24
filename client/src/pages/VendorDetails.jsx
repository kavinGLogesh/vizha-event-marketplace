// VendorDetails.jsx — Full vendor profile page with gallery and contact actions
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Rating,
  Divider,
  Paper,
  Avatar,
  TextField,
  Stack,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import TranslateIcon from "@mui/icons-material/Translate";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { getVendorById, sendVendorEmail } from "../api/axios";

const PLACEHOLDER =
  "https://via.placeholder.com/800x400/f5e8e8/7a1c2e?text=No+Image";

const VendorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImg, setActiveImg] = useState(0);
  const [emailForm, setEmailForm] = useState({
    name: "",
    email: "",
    subject: "",
    appointmentDate: "",
    appointmentTime: "",
    message: "",
  });
  const [emailErrors, setEmailErrors] = useState({
    name: "",
    email: "",
    appointmentDate: "",
    appointmentTime: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState("");
  const [sendError, setSendError] = useState("");

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const res = await getVendorById(id);
        setVendor(res.data);
      } catch {
        setError(t("common.error"));
      } finally {
        setLoading(false);
      }
    };
    fetchVendor();
  }, [id]);

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailForm((prev) => ({ ...prev, [name]: value }));
    setEmailErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateEmailForm = () => {
    const errors = {
      name: "",
      email: "",
      appointmentDate: "",
      appointmentTime: "",
      subject: "",
      message: "",
    };

    if (!emailForm.name.trim()) {
      errors.name = "Your name is required.";
    }

    if (!emailForm.email.trim()) {
      errors.email = "Your email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailForm.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!emailForm.appointmentDate) {
      errors.appointmentDate = "Appointment date is required.";
    }

    if (!emailForm.appointmentTime) {
      errors.appointmentTime = "Appointment time is required.";
    }

    if (emailForm.subject && emailForm.subject.trim().length < 3) {
      errors.subject = "Subject must be at least 3 characters.";
    }

    if (!emailForm.message.trim()) {
      errors.message = "A description is required.";
    } else if (emailForm.message.trim().length < 5) {
      errors.message = "Description must be at least 5 characters.";
    }

    setEmailErrors(errors);
    return Object.values(errors).every((error) => !error);
  };

  const handleSendEmail = async () => {
    setSendSuccess("");
    setSendError("");
    if (!vendor?.email) {
      setSendError("Vendor email is not available.");
      return;
    }

    if (!validateEmailForm()) {
      setSendError("Please fix the highlighted fields before sending.");
      return;
    }

    setSending(true);
    try {
      await sendVendorEmail({
        vendor_id: vendor._id,
        from_name: emailForm.name,
        from_email: emailForm.email,
        subject: emailForm.subject || `Booking request for ${vendor.shop_name}`,
        message: emailForm.message,
        appointment_date: emailForm.appointmentDate,
        appointment_time: emailForm.appointmentTime,
      });
      setSendSuccess(
        "Your message was sent successfully. The vendor can reply to your email.",
      );
      setEmailForm({
        name: "",
        email: "",
        subject: "",
        appointmentDate: "",
        appointmentTime: "",
        message: "",
      });
      setEmailErrors({
        name: "",
        email: "",
        appointmentDate: "",
        appointmentTime: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setSendError(err.response?.data?.detail || "Failed to send email.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress sx={{ color: "#7a1c2e" }} />
      </Box>
    );
  }

  if (error || !vendor) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error">{error || "Vendor not found"}</Alert>
        <Button
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
          startIcon={<ArrowBackIcon />}
        >
          {t("common.back")}
        </Button>
      </Container>
    );
  }

  const images = vendor.images?.length > 0 ? vendor.images : [PLACEHOLDER];

  return (
    <Box>
      {/* Image Gallery */}
      <Box sx={{ backgroundColor: "#1a0a0e", pb: 4, pt: { xs: 2, md: 4 } }}>
        <Container maxWidth="xl">
          <Button
            onClick={() => navigate(-1)}
            startIcon={<ArrowBackIcon />}
            sx={{
              color: "rgba(255,255,255,0.7)",
              mb: 3,
              textTransform: "none",
              fontFamily: '"Lato", sans-serif',
            }}
          >
            {t("common.back")}
          </Button>

          {/* Main Image */}
          <Box
            component="img"
            src={images[activeImg]}
            alt={vendor.shop_name}
            sx={{
              width: "100%",
              height: { xs: 240, md: 420 },
              objectFit: "cover",
              borderRadius: 3,
              display: "block",
            }}
          />

          {/* Thumbnails */}
          {images.length > 1 && (
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                mt: 2,
                overflowX: "auto",
                pb: 1,
              }}
            >
              {images.map((img, i) => (
                <Box
                  key={i}
                  component="img"
                  src={img}
                  onClick={() => setActiveImg(i)}
                  sx={{
                    width: 80,
                    height: 60,
                    objectFit: "cover",
                    borderRadius: 1.5,
                    cursor: "pointer",
                    flexShrink: 0,
                    border:
                      i === activeImg
                        ? "2px solid #c4576a"
                        : "2px solid transparent",
                    opacity: i === activeImg ? 1 : 0.6,
                    transition: "all 0.2s",
                    "&:hover": { opacity: 1 },
                  }}
                />
              ))}
            </Box>
          )}
        </Container>
      </Box>

      {/* Details */}
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 7 } }}>
        <Grid container spacing={5}>
          {/* Left — Main Info */}
          <Grid item xs={12} md={8}>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
                mb: 3,
              }}
            >
              <Box>
                <Chip
                  label={vendor.category}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(122,28,46,0.08)",
                    color: "#7a1c2e",
                    fontFamily: '"Lato", sans-serif',
                    mb: 1,
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontSize: { xs: "1.8rem", md: "2.5rem" },
                    fontWeight: 700,
                    color: "#1a0a0e",
                    lineHeight: 1.2,
                  }}
                >
                  {vendor.shop_name}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Lato", sans-serif',
                    color: "#888",
                    mt: 0.5,
                  }}
                >
                  {vendor.district}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Rating
                  value={vendor.rating || 0}
                  readOnly
                  precision={0.5}
                  sx={{ color: "#c4576a" }}
                />
                <Typography
                  sx={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontSize: "1.3rem",
                    fontWeight: 700,
                  }}
                >
                  {(vendor.rating || 0).toFixed(1)}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Description */}
            <Box sx={{ mb: 4 }}>
              <Typography
                sx={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  color: "#1a0a0e",
                  mb: 1.5,
                }}
              >
                {t("vendor.description")}
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Lato", sans-serif',
                  color: "#555",
                  lineHeight: 1.8,
                  fontSize: "0.95rem",
                }}
              >
                {vendor.description || "No description provided."}
              </Typography>
            </Box>

            {/* Services */}
            {vendor.services && vendor.services.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography
                  sx={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    color: "#1a0a0e",
                    mb: 1.5,
                  }}
                >
                  {t("vendor.services")}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {vendor.services.map((s, i) => (
                    <Chip
                      key={i}
                      label={s}
                      sx={{
                        backgroundColor: "#faf0f1",
                        color: "#7a1c2e",
                        fontFamily: '"Lato", sans-serif',
                        border: "1px solid rgba(122,28,46,0.2)",
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Grid>

          {/* Right — Booking Info */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                border: "1px solid rgba(122,28,46,0.15)",
                borderRadius: 3,
                p: 3,
                position: "sticky",
                top: 80,
              }}
            >
              {/* Price */}
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 3 }}
              >
                <CurrencyRupeeIcon sx={{ color: "#7a1c2e", fontSize: 22 }} />
                <Typography
                  sx={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontSize: "1.6rem",
                    fontWeight: 700,
                    color: "#7a1c2e",
                  }}
                >
                  {vendor.price_range || "On Request"}
                </Typography>
              </Box>

              {/* Stats */}
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}
              >
                {vendor.owner_name && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: "rgba(122,28,46,0.1)",
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 16, color: "#7a1c2e" }} />
                    </Avatar>
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: '"Lato", sans-serif',
                          fontSize: "0.75rem",
                          color: "#888",
                        }}
                      >
                        {t("vendor.owner")}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: '"Lato", sans-serif',
                          fontWeight: 600,
                          fontSize: "0.9rem",
                        }}
                      >
                        {vendor.owner_name}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {vendor.experience && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: "rgba(122,28,46,0.1)",
                      }}
                    >
                      <WorkHistoryIcon
                        sx={{ fontSize: 16, color: "#7a1c2e" }}
                      />
                    </Avatar>
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: '"Lato", sans-serif',
                          fontSize: "0.75rem",
                          color: "#888",
                        }}
                      >
                        {t("vendor.experience")}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: '"Lato", sans-serif',
                          fontWeight: 600,
                          fontSize: "0.9rem",
                        }}
                      >
                        {vendor.experience} years
                      </Typography>
                    </Box>
                  </Box>
                )}

                {vendor.languages?.length > 0 && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: "rgba(122,28,46,0.1)",
                      }}
                    >
                      <TranslateIcon sx={{ fontSize: 16, color: "#7a1c2e" }} />
                    </Avatar>
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: '"Lato", sans-serif',
                          fontSize: "0.75rem",
                          color: "#888",
                        }}
                      >
                        {t("vendor.languages")}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: '"Lato", sans-serif',
                          fontWeight: 600,
                          fontSize: "0.9rem",
                        }}
                      >
                        {vendor.languages.join(", ")}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* CTA Buttons */}
              <Button
                fullWidth
                variant="contained"
                startIcon={<PhoneIcon />}
                href={`tel:${vendor.phone}`}
                sx={{
                  backgroundColor: "#7a1c2e",
                  fontFamily: '"Lato", sans-serif',
                  textTransform: "none",
                  fontSize: "1rem",
                  py: 1.5,
                  borderRadius: 2,
                  mb: 2,
                  "&:hover": { backgroundColor: "#6a1826" },
                }}
              >
                {t("vendor.call")} — {vendor.phone}
              </Button>

              <Button
                fullWidth
                variant="contained"
                startIcon={<WhatsAppIcon />}
                href={`https://wa.me/91${vendor.whatsapp}?text=Hi, I found you on Vizha. I'm interested in your services.`}
                target="_blank"
                sx={{
                  backgroundColor: "#25D366",
                  fontFamily: '"Lato", sans-serif',
                  textTransform: "none",
                  fontSize: "1rem",
                  py: 1.5,
                  borderRadius: 2,
                  "&:hover": { backgroundColor: "#1ebe5d" },
                }}
              >
                {t("vendor.whatsapp")}
              </Button>

              <Box sx={{ mt: 4 }}>
                <Typography
                  sx={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    mb: 2,
                  }}
                >
                  Email the Vendor
                </Typography>

                {sendSuccess && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {sendSuccess}
                  </Alert>
                )}
                {sendError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {sendError}
                  </Alert>
                )}
                {!vendor.email && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    Vendor email is not available for direct email contact.
                  </Alert>
                )}

                <Stack spacing={2}>
                  <TextField
                    label="Your Name"
                    name="name"
                    value={emailForm.name}
                    onChange={handleEmailChange}
                    error={!!emailErrors.name}
                    helperText={emailErrors.name}
                    fullWidth
                  />
                  <TextField
                    label="Your Email"
                    name="email"
                    type="email"
                    value={emailForm.email}
                    onChange={handleEmailChange}
                    error={!!emailErrors.email}
                    helperText={emailErrors.email}
                    fullWidth
                  />
                  <TextField
                    label="Appointment Date"
                    name="appointmentDate"
                    type="date"
                    value={emailForm.appointmentDate}
                    onChange={handleEmailChange}
                    InputLabelProps={{ shrink: true }}
                    error={!!emailErrors.appointmentDate}
                    helperText={emailErrors.appointmentDate}
                    fullWidth
                  />
                  <TextField
                    label="Appointment Time"
                    name="appointmentTime"
                    type="time"
                    value={emailForm.appointmentTime}
                    onChange={handleEmailChange}
                    InputLabelProps={{ shrink: true }}
                    error={!!emailErrors.appointmentTime}
                    helperText={emailErrors.appointmentTime}
                    fullWidth
                  />
                  <TextField
                    label="Subject"
                    name="subject"
                    value={emailForm.subject}
                    onChange={handleEmailChange}
                    error={!!emailErrors.subject}
                    helperText={
                      emailErrors.subject ||
                      "Optional, or leave blank for default subject."
                    }
                    fullWidth
                  />
                  <TextField
                    label="Description"
                    name="message"
                    value={emailForm.message}
                    onChange={handleEmailChange}
                    fullWidth
                    multiline
                    rows={4}
                    error={!!emailErrors.message}
                    helperText={emailErrors.message}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    disabled={sending || !vendor.email}
                    onClick={handleSendEmail}
                    sx={{
                      backgroundColor: "#7a1c2e",
                      fontFamily: '"Lato", sans-serif',
                      textTransform: "none",
                      py: 1.5,
                      borderRadius: 2,
                      "&:hover": { backgroundColor: "#6a1826" },
                    }}
                  >
                    {sending ? "Sending..." : "Send Email"}
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default VendorDetails;
