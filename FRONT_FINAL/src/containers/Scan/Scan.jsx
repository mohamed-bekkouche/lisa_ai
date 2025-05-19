"use client";

import {
  Box,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  IconButton,
  Avatar,
  useTheme,
  alpha,
  Tooltip,
  TablePagination,
  Button,
  Card,
  CardContent,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SpeedIcon from "@mui/icons-material/Speed";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import ImageIcon from "@mui/icons-material/Image";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { AsyncGetScans } from "./ScanSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../configs";

import { useTranslation } from "react-i18next";
import ScanUpload from "./ScanUpload";

export default function Scan() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const canvasRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  const { scans } = useSelector((state) => state.scan);
  const { name, role, id } = useSelector((state) => state.login);
  const { isPatientPremium } = useSelector((state) => state.payment);

  const { t } = useTranslation();

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setLoaded(true);
  }, []);

  // Beautiful background animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    // Create particles for the neural network
    const particles = [];
    const connections = [];
    const numParticles = 120;
    const connectionDistance = 150;
    const particleColors = [
      "#4c1d95",
      "#5b21b6",
      "#7e22ce",
      "#8b5cf6",
      "#6d28d9",
      "#4338ca",
      "#ec4899",
      "#be185d",
    ];

    // Initialize particles
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        color:
          particleColors[Math.floor(Math.random() * particleColors.length)],
        vx: Math.random() * 0.5 - 0.25,
        vy: Math.random() * 0.5 - 0.25,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseSize: 0,
        pulseDirection: 1,
      });
    }

    // Animation function
    function animate() {
      // Create a gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#0f172a");
      gradient.addColorStop(0.5, "#1e1b4b");
      gradient.addColorStop(1, "#4a1d96");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Update and draw particles
      particles.forEach((particle) => {
        // Move particles
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;

        // Pulse effect
        particle.pulseSize += particle.pulseSpeed * particle.pulseDirection;
        if (particle.pulseSize > 1 || particle.pulseSize < 0) {
          particle.pulseDirection *= -1;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(
          particle.x,
          particle.y,
          particle.radius + particle.pulseSize,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = particle.color;
        ctx.fill();
      });

      // Find and draw connections
      connections.length = 0;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            connections.push({
              p1: particles[i],
              p2: particles[j],
              opacity: 1 - distance / connectionDistance,
            });
          }
        }
      }

      // Draw connections
      connections.forEach((connection) => {
        ctx.beginPath();
        ctx.moveTo(connection.p1.x, connection.p1.y);
        ctx.lineTo(connection.p2.x, connection.p2.y);

        // Create gradient for connection
        const gradient = ctx.createLinearGradient(
          connection.p1.x,
          connection.p1.y,
          connection.p2.x,
          connection.p2.y
        );
        gradient.addColorStop(
          0,
          connection.p1.color
            .replace(")", `, ${connection.opacity})`)
            .replace("rgb", "rgba")
        );
        gradient.addColorStop(
          1,
          connection.p2.color
            .replace(")", `, ${connection.opacity})`)
            .replace("rgb", "rgba")
        );

        ctx.strokeStyle = gradient;
        ctx.lineWidth = connection.opacity * 1.5;
        ctx.stroke();
      });

      // Add subtle glow effect
      const radialGradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        width / 2
      );
      radialGradient.addColorStop(0, "rgba(139, 92, 246, 0.05)");
      radialGradient.addColorStop(0.5, "rgba(124, 58, 237, 0.03)");
      radialGradient.addColorStop(1, "rgba(109, 40, 217, 0)");
      ctx.fillStyle = radialGradient;
      ctx.fillRect(0, 0, width, height);

      requestAnimationFrame(animate);
    }

    // Start animation
    animate();

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleGoToDocument = (document_id) => {
    navigate(`/document/${document_id}`);
  };

  const handleRefresh = () => {
    dispatch(AsyncGetScans());
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    dispatch(AsyncGetScans());
  }, [dispatch]);

  const handleDownload = async (url_file, path) => {
    const file = `${url_file}${path}`;
    const fileName = file.split("/").pop();
    const response = await fetch(file); // Replace with your file URL
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName; // Specify the file name
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url); // Clean up
  };

  const paginatedScans = scans.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // FAQ items
  const faqItems = [
    {
      question: t("What types of scans are supported?"),
      answer: t(
        "Our platform supports various medical imaging formats including X-rays and ultrasounds. All images are stored securely and can be viewed in high resolution."
      ),
    },
    {
      question: t("How long are my scans stored?"),
      answer: t(
        "Your scans are securely stored on our platform indefinitely. You can access them anytime from your account. Premium members get additional backup options and export features."
      ),
    },
    {
      question: t("Can I share my scans with my doctor?"),
      answer: t(
        "No, you can't, but Premium members have advanced sharing options including direct integration with healthcare systems."
      ),
    },
    {
      question: t("How secure is my scan data?"),
      answer: t(
        "We use industry-leading encryption and security protocols to protect your medical data. All scans are stored in compliance with healthcare privacy regulations."
      ),
    },
  ];

  // Premium benefits
  const premiumBenefits = [
    {
      icon: <SpeedIcon />,
      title: t("Immediate Access"),
      description: t(
        "Get your scan results immediately after they're uploaded, no waiting period."
      ),
      color: "#8b5cf6",
    },
    {
      icon: <VerifiedUserIcon />,
      title: t("Priority Analysis"),
      description: t(
        "Your scans are analyzed by our medical professionals with top priority."
      ),
      color: "#ec4899",
    },
    {
      icon: <AccessTimeIcon />,
      title: t("24/7 Support"),
      description: t(
        "Access to round-the-clock support for any questions about your scans."
      ),
      color: "#8b5cf6",
    },
    {
      icon: <MedicalServicesIcon />,
      title: t("Expert Consultation"),
      description: t(
        "Direct consultation with specialists about your scan results."
      ),
      color: "#ec4899",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        pb: 6,
      }}
    >
      {/* Beautiful Neural Network Background Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />

      {/* Background Overlay with more purple tint */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at center, rgba(91, 33, 182, 0.2) 0%, rgba(49, 10, 101, 0.6) 100%)",
          zIndex: 1,
        }}
      />

      {/* Main Content */}
      <Box
        sx={{
          pt: { xs: 4, sm: 6 },
          position: "relative",
          zIndex: 2,
          px: { xs: 2, sm: 4, md: 6 },
          width: "100%",
        }}
      >
        {isPatientPremium && role === "Patient" && (
          <ScanUpload onUploadSuccess={handleRefresh} />
        )}
        {/* Page Title */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            mt: 4,
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              color: "white",
              fontWeight: 700,
              textShadow: "0 2px 10px rgba(0,0,0,0.3)",
              background: "linear-gradient(to right, #ffffff, #ec4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t("Medical Scans")}
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              sx={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                color: "white",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              {t("Refresh")}
            </Button>
          </Box>
        </Box>

        {/* Premium Feature Card */}
        {!isPatientPremium && role === "Patient" && (
          <Card
            sx={{
              borderRadius: "24px",
              background: "rgba(15, 23, 42, 0.6)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 15px 40px rgba(0, 0, 0, 0.3)",
              overflow: "hidden",
              position: "relative",
              border: "1px solid rgba(236, 72, 153, 0.2)",
              mb: 4,
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.5s ease, transform 0.5s ease",
              transitionDelay: "0.1s",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                background: "linear-gradient(to right, #8b5cf6, #ec4899)",
              },
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: "rgba(236, 72, 153, 0.1)",
                    color: "#ec4899",
                    mr: 3,
                  }}
                >
                  <StarIcon sx={{ fontSize: 30 }} />
                </Avatar>
                <Box>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="white"
                    gutterBottom
                  >
                    {t("Premium Feature")}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="rgba(255, 255, 255, 0.7)"
                  >
                    {t(
                      "Upgrade to premium for immediate access to your scan results"
                    )}
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={3} sx={{ mb: 3 }}>
                {premiumBenefits.map((benefit, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box
                      sx={{
                        display: "flex",
                        p: 2,
                        borderRadius: "12px",
                        background: "rgba(255, 255, 255, 0.03)",
                        border: `1px solid ${benefit.color}30`,
                        transition: "all 0.3s ease",
                        height: "100%",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                          background: "rgba(255, 255, 255, 0.05)",
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: `${benefit.color}20`,
                          color: benefit.color,
                          mr: 2,
                        }}
                      >
                        {benefit.icon}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight="medium"
                          color="white"
                          gutterBottom
                        >
                          {benefit.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="rgba(255, 255, 255, 0.7)"
                        >
                          {benefit.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Box
                sx={{
                  p: 3,
                  borderRadius: "12px",
                  background:
                    "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)",
                  border: "1px solid rgba(236, 72, 153, 0.2)",
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <PriorityHighIcon
                  sx={{ color: "#ec4899", mr: 2, fontSize: 24 }}
                />
                <Typography color="rgba(255, 255, 255, 0.9)">
                  {t(
                    "The average patient gets the scan within 24/48 hours. Premium patients get it immediately."
                  )}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  startIcon={<StarIcon />}
                  onClick={() => {
                    navigate("/subscription");
                  }}
                  sx={{
                    background: "linear-gradient(45deg, #8b5cf6, #ec4899)",
                    color: "white",
                    borderRadius: "12px",
                    py: 1.5,
                    px: 4,
                    fontWeight: 600,
                    boxShadow: "0 4px 15px rgba(236, 72, 153, 0.3)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #7c3aed, #db2777)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(236, 72, 153, 0.4)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {t("Upgrade to Premium")}
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Scans Table Card */}
        <Card
          sx={{
            borderRadius: "24px",
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 15px 40px rgba(0, 0, 0, 0.3)",
            overflow: "hidden",
            position: "relative",
            border: "1px solid rgba(139, 92, 246, 0.2)",
            mb: 4,
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            transitionDelay: "0.2s",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "linear-gradient(to right, #8b5cf6, #ec4899)",
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="h5" fontWeight="bold" color="white">
                  {t("Your Scans")}
                </Typography>
                <Chip
                  label={`${scans.length} ${t("scans")}`}
                  size="small"
                  sx={{
                    ml: 2,
                    backgroundColor: "rgba(236, 72, 153, 0.15)",
                    color: "white",
                    fontWeight: "bold",
                    borderRadius: "8px",
                  }}
                />
              </Box>
            </Box>

            {scans.length === 0 ? (
              <Box
                sx={{
                  p: 6,
                  textAlign: "center",
                  background: alpha(theme.palette.common.white, 0.02),
                  borderRadius: "8px",
                  border: `1px dashed ${alpha(
                    theme.palette.primary.main,
                    0.2
                  )}`,
                }}
              >
                <ImageIcon
                  sx={{
                    fontSize: 64,
                    color: "rgba(255, 255, 255, 0.2)",
                    mb: 2,
                  }}
                />
                <Typography
                  color="rgba(255, 255, 255, 0.7)"
                  variant="h6"
                  gutterBottom
                >
                  {t("No scans found.")}
                </Typography>
                <Typography
                  color="rgba(255, 255, 255, 0.5)"
                  variant="body2"
                  sx={{ maxWidth: 500, mx: "auto", mb: 3 }}
                >
                  {role === "Admin"
                    ? t(
                        "Upload your first medical scan to get started. Our system will securely store and analyze it."
                      )
                    : t(
                        "No scans have been uploaded for you yet. Please contact your administrator."
                      )}
                </Typography>
                {role === "Admin" && (
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    sx={{
                      borderColor: "rgba(139, 92, 246, 0.5)",
                      color: "white",
                      "&:hover": {
                        borderColor: "#8b5cf6",
                        background: "rgba(139, 92, 246, 0.1)",
                      },
                    }}
                  >
                    {t("Upload Your First Scan")}
                  </Button>
                )}
              </Box>
            ) : (
              <>
                <TableContainer
                  sx={{
                    borderRadius: "8px",
                    background: alpha(theme.palette.common.white, 0.02),
                    border: `1px solid ${alpha(
                      theme.palette.primary.main,
                      0.1
                    )}`,
                    mb: 2,
                    "&::-webkit-scrollbar": {
                      width: "8px",
                      height: "8px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.2),
                      borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: "rgba(0, 0, 0, 0.1)",
                    },
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            fontWeight: "bold",
                            borderBottom: `1px solid ${alpha(
                              theme.palette.primary.main,
                              0.1
                            )}`,
                            fontSize: "0.9rem",
                          }}
                        >
                          {t("Patient")}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            fontWeight: "bold",
                            borderBottom: `1px solid ${alpha(
                              theme.palette.primary.main,
                              0.1
                            )}`,
                            fontSize: "0.9rem",
                          }}
                        >
                          {t("Created at")}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            fontWeight: "bold",
                            borderBottom: `1px solid ${alpha(
                              theme.palette.primary.main,
                              0.1
                            )}`,
                            fontSize: "0.9rem",
                          }}
                        >
                          {t("Actions")}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedScans.map((scan) => {
                        const formattedDate = dayjs(scan.createdAt).format(
                          "DD-MM-YY HH:mm"
                        );
                        return (
                          <TableRow
                            key={scan._id}
                            hover
                            sx={{
                              transition: "background-color 0.3s ease",
                              "&:hover": {
                                backgroundColor: alpha(
                                  theme.palette.primary.main,
                                  0.05
                                ),
                              },
                              "& td": {
                                borderBottom: `1px solid ${alpha(
                                  theme.palette.primary.main,
                                  0.1
                                )}`,
                                color: "white",
                                py: 2,
                              },
                            }}
                          >
                            <TableCell>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <Avatar
                                  sx={{
                                    bgcolor: "rgba(139, 92, 246, 0.1)",
                                    color: "#8b5cf6",
                                    mr: 2,
                                  }}
                                >
                                  <PersonIcon />
                                </Avatar>
                                <Box>
                                  <Typography
                                    variant="body2"
                                    fontWeight="medium"
                                  >
                                    {name}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="rgba(255, 255, 255, 0.5)"
                                  >
                                    {role}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <CalendarMonthIcon
                                  fontSize="small"
                                  sx={{ color: "#ec4899", mr: 1, opacity: 0.7 }}
                                />
                                <Typography>{formattedDate}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  gap: 1,
                                }}
                              >
                                <Tooltip title={t("View scan")}>
                                  <IconButton
                                    onClick={() => handleGoToDocument(scan._id)}
                                    size="small"
                                    sx={{
                                      color: "rgba(255, 255, 255, 0.7)",
                                      backgroundColor: alpha("#8b5cf6", 0.1),
                                      borderRadius: "4px",
                                      transition: "all 0.2s ease",
                                      "&:hover": {
                                        transform: "scale(1.1)",
                                        backgroundColor: alpha("#8b5cf6", 0.2),
                                        color: "#8b5cf6",
                                      },
                                    }}
                                  >
                                    <VisibilityIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title={t("Download scan")}>
                                  <IconButton
                                    onClick={() => {
                                      handleDownload(BASE_URL, scan.imageURL);
                                    }}
                                    size="small"
                                    sx={{
                                      color: "rgba(255, 255, 255, 0.7)",
                                      backgroundColor: alpha("#ec4899", 0.1),
                                      borderRadius: "4px",
                                      transition: "all 0.2s ease",
                                      "&:hover": {
                                        transform: "scale(1.1)",
                                        backgroundColor: alpha("#ec4899", 0.2),
                                        color: "#ec4899",
                                      },
                                    }}
                                  >
                                    <DownloadIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  labelRowsPerPage={t("Rows per page")}
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={scans.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                    ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                      {
                        margin: 0,
                        color: "rgba(255, 255, 255, 0.7)",
                      },
                    ".MuiTablePagination-select": {
                      color: "white",
                    },
                    ".MuiSvgIcon-root": {
                      color: "rgba(255, 255, 255, 0.7)",
                    },
                  }}
                />
              </>
            )}
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card
          sx={{
            borderRadius: "24px",
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 15px 40px rgba(0, 0, 0, 0.3)",
            overflow: "hidden",
            position: "relative",
            border: "1px solid rgba(139, 92, 246, 0.2)",
            mb: 4,
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            transitionDelay: "0.3s",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "linear-gradient(to right, #ec4899, #8b5cf6)",
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Avatar
                sx={{
                  bgcolor: "rgba(139, 92, 246, 0.1)",
                  color: "#8b5cf6",
                  mr: 2,
                }}
              >
                <HelpOutlineIcon />
              </Avatar>
              <Typography variant="h5" fontWeight="bold" color="white">
                {t("Frequently Asked Questions")}
              </Typography>
            </Box>

            {faqItems.map((item, index) => (
              <Accordion
                key={index}
                sx={{
                  background: "rgba(255, 255, 255, 0.03)",
                  color: "white",
                  borderRadius: "8px !important",
                  mb: 2,
                  border: "1px solid rgba(139, 92, 246, 0.1)",
                  "&:before": {
                    display: "none",
                  },
                  "&.Mui-expanded": {
                    margin: "0 0 16px 0",
                  },
                  overflow: "hidden",
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon
                      sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                    />
                  }
                  sx={{
                    "& .MuiAccordionSummary-content": {
                      margin: "12px 0",
                    },
                  }}
                >
                  <Typography fontWeight="medium">{item.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="rgba(255, 255, 255, 0.7)">
                    {item.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
