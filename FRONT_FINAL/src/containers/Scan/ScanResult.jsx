"use client";

import {
  Container,
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
  Tooltip,
  TablePagination,
  Button,
  Card,
  Fade,
  Grow,
  Chip,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Zoom,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Divider,
} from "@mui/material";

import StarIcon from "@mui/icons-material/Star";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import DescriptionIcon from "@mui/icons-material/Description";
import ImageIcon from "@mui/icons-material/Image";

import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { AsyncGetScans, AsyncRequstScan } from "./ScanSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../configs";
import { useTranslation } from "react-i18next";
import axios from "../../helpers/axios";

export default function ScanResult() {
  const [scanResults, setScanResults] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const canvasRef = useRef(null);
  const { scans } = useSelector((state) => state.scan);
  const [scanDialogOpen, setScanDialogOpen] = useState(false);
  const { name, role, id } = useSelector((state) => state.login);
  const { isPatientPremium } = useSelector((state) => state.payment);
  const { t } = useTranslation();
  const [loaded, setLoaded] = useState(false);
  const [selectedScan, setSelectedScan] = useState(null);
  const [uploadType, setUploadType] = useState("existing");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(
    isPatientPremium ? false : true
  );
  const [analysisResult, setAnalysisResult] = useState(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const getScanResult = async () => {
    try {
      const response = await axios.get("/patient/scanResults");
      setScanResults(response?.data?.scanResults);
      console.log("scanResult : ", response.data.scanResults);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getScanResult();
  }, []);

  // Background animation effect
  useEffect(() => {
    setLoaded(true);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    // Create particles for the background
    const particles = [];
    const numParticles = 100;
    const particleColors = ["#ec4899", "#d946ef", "#a855f7", "#c026d3"];

    // Initialize particles
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        color:
          particleColors[Math.floor(Math.random() * particleColors.length)],
        vx: Math.random() * 0.4 - 0.2,
        vy: Math.random() * 0.4 - 0.2,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    // Animation function
    function animate() {
      // Create a gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#0f172a");
      gradient.addColorStop(1, "#1e1b4b");
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

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color
          .replace(")", `, ${particle.opacity})`)
          .replace("rgb", "rgba");
        ctx.fill();
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
      radialGradient.addColorStop(0, "rgba(217, 70, 239, 0.03)");
      radialGradient.addColorStop(1, "rgba(15, 23, 42, 0)");
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

  const handleGoToDocument = (document_id) => {
    navigate(`/document/${document_id}`);
  };

  const handleDownload = async (url_file, path) => {
    const file = `${url_file}${path}`;
    const fileName = file.split("/").pop();
    const response = await fetch(file);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleOpenScanDialog = () => {
    // setSelectedScan(null);
    // setUploadType("existing");
    // setUploadedFile(null);
    // setPreviewUrl("");
    // setSuccess(false);
    // setScanDialogOpen(true);
  };

  const handleCloseScanDialog = () => {
    setScanDialogOpen(false);
    setIsSubmitting(false);
    setSuccess(false);
  };

  const handleUploadTypeChange = (event) => {
    setUploadType(event.target.value);
    if (event.target.value === "existing") {
      setSelectedScan(scans.length > 0 ? scans[0] : null);
    } else {
      setSelectedScan(null);
    }
    setUploadedFile(null);
    setPreviewUrl("");
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setUploadedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setUploadedFile(null);
        setPreviewUrl("");
      }
    }
  };

  const handleSubmitScan = () => {
    setIsSubmitting(true);

    if (uploadType === "existing" && selectedScan) {
      // Use the existing AsyncRequstScan function for existing scans
      dispatch(AsyncRequstScan(selectedScan._id))
        .then(() => {
          setSuccess(true);
          setIsSubmitting(false);
          setSelectedScan(null);
          dispatch(AsyncGetScans());
          getScanResult();
          // Close dialog after a short delay
          setTimeout(() => {
            handleCloseScanDialog();
          }, 1500);
        })
        .catch((err) => {
          setIsSubmitting(false);
        });
    } else if (uploadType === "upload" && isPatientPremium && uploadedFile) {
      // For premium users uploading new scans
      // Simulate API call for file upload and instant analysis
      setIsAnalyzing(true);

      // Simulate analysis delay (1-2 seconds for premium users)
      setTimeout(
        () => {
          // Mock analysis result
          const mockResult = {
            _id: `result_${Date.now()}`,
            scanName: uploadedFile.name,
            scanType: "X-Ray",
            createdAt: new Date().toISOString(),
            status: "Completed",
            finding:
              Math.random() > 0.7
                ? "Possible abnormality detected in lower region"
                : "No abnormalities detected",
            confidence: Math.floor(Math.random() * 20 + 80), // 80-99% confidence
            imageUrl: previewUrl,
          };

          setAnalysisResult(mockResult);
          setIsAnalyzing(false);
          setSuccess(true);

          // Add the result to the list
          dispatch(AsyncGetScans());

          // Close dialog after a short delay
          setTimeout(() => {
            handleCloseScanDialog();
          }, 2000);
        },
        isPatientPremium ? 1500 : 3000
      );
    }
  };

  const handleViewResult = (result) => {
    setSelectedResult(result);
    setResultDialogOpen(true);
  };

  useEffect(() => {
    dispatch(AsyncGetScans());
  }, [dispatch]);

  // const paginatedScans = scanResults;
  const paginatedScanResults = scanResults.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const paginatedScanIds = new Set(
    paginatedScanResults.map((result) => result.scanID._id)
  );

  const scansNotInPaginatedResults = scans.filter(
    (scan) => !paginatedScanIds.has(scan._id)
  );

  const paginatedScans = scansNotInPaginatedResults.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // FAQ items
  const faqItems = [
    {
      question: t("How does the AI scan analysis work?"),
      answer: t(
        "Our AI system analyzes medical scans to detect potential health issues. It uses advanced machine learning algorithms trained on thousands of medical images to identify patterns associated with various conditions."
      ),
    },
    {
      question: t(
        "Why do regular patients have to wait 24-48 hours for results?"
      ),
      answer: t(
        "Regular patient scans undergo a thorough review process that includes both AI analysis and human verification by medical professionals to ensure accuracy, which takes 24-48 hours to complete."
      ),
    },
    {
      question: t("How accurate are the AI results?"),
      answer: t(
        "Our AI system has a high accuracy rate of over 90% for most common conditions. However, all results should be confirmed by a healthcare professional as part of a complete diagnosis."
      ),
    },
    {
      question: t("Can I upload my own scans as a premium member?"),
      answer: t(
        "Yes, premium members can upload their own scans in addition to using scans provided by administrators. This allows for more flexibility and immediate results."
      ),
    },
    {
      question: t("What file formats are supported for scan uploads?"),
      answer: t(
        "We support common medical imaging formats including DICOM, JPEG, PNG, and TIFF files. Files should be clear and high-resolution for best results."
      ),
    },
  ];

  // Get status chip color and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case "Completed":
        return {
          color: "#10b981",
          bgColor: "rgba(16, 185, 129, 0.1)",
          borderColor: "rgba(16, 185, 129, 0.3)",
          icon: <CheckCircleOutlineIcon fontSize="small" />,
        };
      case "Processing":
        return {
          color: "#f59e0b",
          bgColor: "rgba(245, 158, 11, 0.1)",
          borderColor: "rgba(245, 158, 11, 0.3)",
          icon: <AccessTimeIcon fontSize="small" />,
        };
      case "Error":
        return {
          color: "#ef4444",
          bgColor: "rgba(239, 68, 68, 0.1)",
          borderColor: "rgba(239, 68, 68, 0.3)",
          icon: <ErrorOutlineIcon fontSize="small" />,
        };
      default:
        return {
          color: "#d946ef",
          bgColor: "rgba(217, 70, 239, 0.1)",
          borderColor: "rgba(217, 70, 239, 0.3)",
          icon: <HealthAndSafetyIcon fontSize="small" />,
        };
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
        pt: { xs: 4, md: 6 },
        pb: 8,
      }}
    >
      {/* Background Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />

      <Container
        maxWidth="xl"
        sx={{
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header Section */}
        <Fade in={loaded} timeout={800}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              mb: 4,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "20px",
                  background:
                    "linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(217, 70, 239, 0.2))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow:
                    "0 10px 20px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.05)",
                  mr: 3,
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: -100,
                    width: "100%",
                    height: "100%",
                    background:
                      "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
                    animation: "shimmer 2s infinite",
                  },
                  "@keyframes shimmer": {
                    "0%": { transform: "translateX(0)" },
                    "100%": { transform: "translateX(200%)" },
                  },
                }}
              >
                <HealthAndSafetyIcon sx={{ color: "#ec4899", fontSize: 32 }} />
              </Box>
              <Box>
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    background: "linear-gradient(to right, #ffffff, #fbcfe8)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: "-0.02em",
                    mb: 0.5,
                  }}
                >
                  {t("AI Scan Analysis")}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    fontWeight: 500,
                  }}
                >
                  {t("Get AI-powered analysis of your medical scans")}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 2, mt: { xs: 3, md: 0 } }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                sx={{
                  borderRadius: "14px",
                  borderColor: "rgba(217, 70, 239, 0.3)",
                  color: "#ec4899",
                  backgroundColor: "rgba(217, 70, 239, 0.05)",
                  px: 3,
                  py: 1.2,
                  "&:hover": {
                    borderColor: "#ec4899",
                    backgroundColor: "rgba(217, 70, 239, 0.1)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 15px rgba(217, 70, 239, 0.15)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                {t("Refresh")}
              </Button>
              {/* <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenScanDialog}
                sx={{
                  borderRadius: "14px",
                  backgroundColor: "#d946ef",
                  color: "white",
                  px: 3,
                  py: 1.2,
                  boxShadow: "0 8px 16px rgba(217, 70, 239, 0.3)",
                  "&:hover": {
                    backgroundColor: "#c026d3",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 20px rgba(217, 70, 239, 0.4)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                {t("New Analysis")}
              </Button> */}
            </Box>
          </Box>
        </Fade>

        {/* Premium Alert */}
        {!isPatientPremium && role === "Patient" && (
          <Zoom in={loaded} timeout={800} style={{ transitionDelay: "200ms" }}>
            <Card
              sx={{
                borderRadius: "24px",
                overflow: "hidden",
                background:
                  "linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05))",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(245, 158, 11, 0.2)",
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)",
                position: "relative",
                mb: 4,
                p: 0,
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: "-1px",
                  borderRadius: "25px",
                  padding: "1px",
                  background:
                    "linear-gradient(130deg, #f59e0b, transparent, #f59e0b)",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  pointerEvents: "none",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: { xs: "flex-start", md: "center" },
                  justifyContent: "space-between",
                  p: 4,
                  gap: 3,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Decorative elements */}
                <Box
                  sx={{
                    position: "absolute",
                    top: -20,
                    right: -20,
                    width: 150,
                    height: 150,
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, transparent 70%)",
                    zIndex: 0,
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: -30,
                    left: -30,
                    width: 180,
                    height: 180,
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%)",
                    zIndex: 0,
                  }}
                />

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    zIndex: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 70,
                      height: 70,
                      borderRadius: "20px",
                      background:
                        "linear-gradient(130deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.1))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow:
                        "0 10px 20px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(245, 158, 11, 0.2)",
                      position: "relative",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        inset: "-3px",
                        borderRadius: "23px",
                        padding: "3px",
                        background:
                          "linear-gradient(130deg, rgba(245, 158, 11, 0.5), transparent)",
                        WebkitMask:
                          "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                        WebkitMaskComposite: "xor",
                        maskComposite: "exclude",
                        opacity: 0.5,
                      },
                    }}
                  >
                    <StarIcon sx={{ color: "#f59e0b", fontSize: 36 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: "#f59e0b",
                        mb: 1,
                      }}
                    >
                      {t("Premium Feature")}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "rgba(255, 255, 255, 0.8)",
                        maxWidth: "600px",
                        lineHeight: 1.6,
                      }}
                    >
                      {t(
                        "Upgrade to Premium for instant AI analysis results and the ability to upload your own scans. Regular patients receive results within 24-48 hours and can only analyze scans provided by administrators."
                      )}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<StarIcon />}
                  onClick={() => {
                    navigate("/subscription");
                  }}
                  sx={{
                    borderRadius: "16px",
                    backgroundColor: "#f59e0b",
                    color: "white",
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    boxShadow: "0 10px 25px rgba(245, 158, 11, 0.3)",
                    "&:hover": {
                      backgroundColor: "#d97706",
                      transform: "translateY(-3px)",
                      boxShadow: "0 15px 30px rgba(245, 158, 11, 0.4)",
                    },
                    transition: "all 0.3s ease",
                    alignSelf: { xs: "stretch", md: "center" },
                    zIndex: 1,
                  }}
                >
                  {t("Upgrade to Premium")}
                </Button>
              </Box>
            </Card>
          </Zoom>
        )}

        {/* Feature Comparison */}
        <Fade in={loaded} timeout={800} style={{ transitionDelay: "300ms" }}>
          <Card
            sx={{
              borderRadius: "24px",
              overflow: "hidden",
              background: "rgba(255, 255, 255, 0.03)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)",
              position: "relative",
              mb: 4,
              "&::before": {
                content: '""',
                position: "absolute",
                inset: "-1px",
                borderRadius: "25px",
                padding: "1px",
                background:
                  "linear-gradient(130deg, #ec4899, transparent, #d946ef)",
                WebkitMask:
                  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                pointerEvents: "none",
              },
            }}
          >
            <Box sx={{ p: 3 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "#ffffff",
                  mb: 3,
                }}
              >
                {t("How It Works")}
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: "16px",
                      background: "rgba(255, 255, 255, 0.03)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      height: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "12px",
                          background: "rgba(255, 255, 255, 0.05)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mr: 2,
                        }}
                      >
                        <PersonIcon
                          sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                        />
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: "rgba(255, 255, 255, 0.9)",
                        }}
                      >
                        {t("Regular Patient")}
                      </Typography>
                    </Box>

                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            background: "rgba(255, 255, 255, 0.05)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mt: 0.5,
                          }}
                        >
                          <Typography
                            sx={{
                              color: "rgba(255, 255, 255, 0.7)",
                              fontWeight: 600,
                            }}
                          >
                            1
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            lineHeight: 1.6,
                          }}
                        >
                          {t(
                            "Submit scans provided by administrators for AI analysis"
                          )}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            background: "rgba(255, 255, 255, 0.05)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mt: 0.5,
                          }}
                        >
                          <Typography
                            sx={{
                              color: "rgba(255, 255, 255, 0.7)",
                              fontWeight: 600,
                            }}
                          >
                            2
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            lineHeight: 1.6,
                          }}
                        >
                          {t(
                            "Wait 24-48 hours for results as they undergo thorough review"
                          )}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            background: "rgba(255, 255, 255, 0.05)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mt: 0.5,
                          }}
                        >
                          <Typography
                            sx={{
                              color: "rgba(255, 255, 255, 0.7)",
                              fontWeight: 600,
                            }}
                          >
                            3
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            lineHeight: 1.6,
                          }}
                        >
                          {t(
                            "Receive detailed analysis with professional verification"
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: "16px",
                      background:
                        "linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05))",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(245, 158, 11, 0.2)",
                      height: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "12px",
                          background: "rgba(245, 158, 11, 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mr: 2,
                        }}
                      >
                        <StarIcon sx={{ color: "#f59e0b" }} />
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: "#f59e0b",
                        }}
                      >
                        {t("Premium Patient")}
                      </Typography>
                    </Box>

                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            background: "rgba(245, 158, 11, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mt: 0.5,
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#f59e0b",
                              fontWeight: 600,
                            }}
                          >
                            1
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(255, 255, 255, 0.8)",
                            lineHeight: 1.6,
                          }}
                        >
                          {t(
                            "Submit scans provided by administrators OR upload your own scans"
                          )}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            background: "rgba(245, 158, 11, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mt: 0.5,
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#f59e0b",
                              fontWeight: 600,
                            }}
                          >
                            2
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(255, 255, 255, 0.8)",
                            lineHeight: 1.6,
                          }}
                        >
                          {t(
                            "Receive instant AI analysis results without waiting"
                          )}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            background: "rgba(245, 158, 11, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mt: 0.5,
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#f59e0b",
                              fontWeight: 600,
                            }}
                          >
                            3
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(255, 255, 255, 0.8)",
                            lineHeight: 1.6,
                          }}
                        >
                          {t(
                            "Access advanced analysis features and priority support"
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Fade>

        {/* Results Content */}
        <Grow in={loaded} timeout={800} style={{ transitionDelay: "400ms" }}>
          <Card
            sx={{
              borderRadius: "24px",
              overflow: "hidden",
              background: "rgba(255, 255, 255, 0.03)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)",
              position: "relative",
              mb: 4,
              "&::before": {
                content: '""',
                position: "absolute",
                inset: "-1px",
                borderRadius: "25px",
                padding: "1px",
                background:
                  "linear-gradient(130deg, #ec4899, transparent, #d946ef)",
                WebkitMask:
                  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                pointerEvents: "none",
              },
            }}
          >
            <Box sx={{ p: 4 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "#ffffff",
                  mb: 3,
                }}
              >
                {t("Your AI Analysis Results")}
              </Typography>

              {scans.length === 0 ? (
                <Box
                  sx={{
                    p: 6,
                    borderRadius: "20px",
                    background: "rgba(255, 255, 255, 0.03)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "24px",
                      background:
                        "linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(217, 70, 239, 0.1))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 3,
                    }}
                  >
                    <HealthAndSafetyIcon
                      sx={{ color: "#ec4899", fontSize: 40, opacity: 0.8 }}
                    />
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "rgba(255, 255, 255, 0.9)",
                      fontWeight: 600,
                      mb: 1,
                    }}
                  >
                    {t("No analysis results found")}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "rgba(255, 255, 255, 0.6)",
                      maxWidth: "500px",
                      mx: "auto",
                      mb: 3,
                    }}
                  >
                    {t(
                      "You haven't submitted any scans for AI analysis yet. Click the button below to get started."
                    )}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenScanDialog}
                    sx={{
                      borderRadius: "14px",
                      backgroundColor: "#d946ef",
                      color: "white",
                      px: 3,
                      py: 1.2,
                      boxShadow: "0 8px 16px rgba(217, 70, 239, 0.3)",
                      "&:hover": {
                        backgroundColor: "#c026d3",
                        transform: "translateY(-2px)",
                        boxShadow: "0 12px 20px rgba(217, 70, 239, 0.4)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    {t("Submit Scan for Analysis")}
                  </Button>
                </Box>
              ) : (
                <>
                  {/* Scan Selection Section - Similar to New Analysis Dialog */}
                  <Box sx={{ mb: 4 }}>
                    <FormControl component="fieldset" sx={{ width: "100%" }}>
                      <FormLabel
                        component="legend"
                        sx={{
                          color: "rgba(255, 255, 255, 0.7)",
                          fontWeight: 600,
                          mb: 2,
                        }}
                      >
                        {t("Select a scan to analyze")}
                      </FormLabel>
                      <Grid container spacing={2}>
                        {paginatedScans.map((scanResult) => (
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            key={scanResult._id}
                          >
                            <Box
                              onClick={() => setSelectedScan(scanResult)}
                              sx={{
                                p: 2,
                                borderRadius: "16px",
                                border: "1px solid",
                                borderColor:
                                  selectedScan &&
                                  selectedScan._id === scanResult._id
                                    ? "rgba(236, 72, 153, 0.5)"
                                    : "rgba(255, 255, 255, 0.1)",
                                background:
                                  selectedScan &&
                                  selectedScan._id === scanResult._id
                                    ? "rgba(236, 72, 153, 0.1)"
                                    : "rgba(255, 255, 255, 0.03)",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  borderColor: "rgba(236, 72, 153, 0.3)",
                                  background: "rgba(236, 72, 153, 0.05)",
                                  transform: "translateY(-2px)",
                                },
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                textAlign: "center",
                                height: "100%",
                              }}
                            >
                              <Box
                                sx={{
                                  width: "100%",
                                  height: 120,
                                  borderRadius: "8px",
                                  overflow: "hidden",
                                  mb: 2,
                                  position: "relative",
                                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                                }}
                              >
                                <Box
                                  component="img"
                                  src={`${BASE_URL}${scanResult?.imageURL}`}
                                  alt={scanResult?.imageURL?.split("/").pop()}
                                  sx={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                                {selectedScan &&
                                  selectedScan._id === scanResult._id && (
                                    <Box
                                      sx={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        backgroundColor:
                                          "rgba(236, 72, 153, 0.2)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <CheckCircleOutlineIcon
                                        sx={{ color: "white", fontSize: 40 }}
                                      />
                                    </Box>
                                  )}
                              </Box>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "rgba(255, 255, 255, 0.9)",
                                  fontWeight: 600,
                                  mb: 0.5,
                                }}
                              >
                                {scanResult.imageURL?.split("/").pop()}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "rgba(255, 255, 255, 0.6)",
                                }}
                              >
                                {dayjs(scanResult.createdAt).format("DD-MM-YY")}
                              </Typography>
                              <Chip
                                icon={
                                  getStatusInfo(
                                    scanResult.status || "Processing"
                                  ).icon
                                }
                                label={t(scanResult.status || "Processing")}
                                size="small"
                                sx={{
                                  backgroundColor: getStatusInfo(
                                    scanResult.status || "Processing"
                                  ).bgColor,
                                  color: getStatusInfo(
                                    scanResult.status || "Processing"
                                  ).color,
                                  border: `1px solid ${
                                    getStatusInfo(
                                      scanResult.status || "Processing"
                                    ).borderColor
                                  }`,
                                  fontWeight: 600,
                                  px: 0.5,
                                  mt: 1,
                                }}
                              />
                            </Box>
                          </Grid>
                        ))}
                      </Grid>

                      {/* {addd. it } */}
                      {selectedScan && (
                        <DialogActions sx={{ p: 2.5 }}>
                          <Button
                            variant="outlined"
                            startIcon={<CloseIcon />}
                            disabled={isSubmitting}
                            onClick={() => {
                              setSelectedScan(null);
                              setUploadType("existing");
                              setUploadedFile(null);
                              setPreviewUrl("");
                              setSuccess(false);
                            }}
                            sx={{
                              borderRadius: "12px",
                              borderColor: "rgba(255, 255, 255, 0.2)",
                              color: "rgba(255, 255, 255, 0.8)",
                              "&:hover": {
                                borderColor: "rgba(255, 255, 255, 0.3)",
                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                              },
                              py: 1,
                              px: 2,
                            }}
                          >
                            {t("Cancel")}
                          </Button>

                          <Button
                            variant="contained"
                            startIcon={
                              isSubmitting ? (
                                <CircularProgress size={20} color="inherit" />
                              ) : (
                                <HealthAndSafetyIcon />
                              )
                            }
                            onClick={handleSubmitScan}
                            disabled={
                              isSubmitting ||
                              success ||
                              (uploadType === "existing" && !selectedScan) ||
                              (uploadType === "upload" && !uploadedFile)
                            }
                            sx={{
                              borderRadius: "12px",
                              backgroundColor: "#d946ef",
                              color: "white",
                              "&:hover": {
                                backgroundColor: "#c026d3",
                                transform: "translateY(-2px)",
                                boxShadow: "0 6px 15px rgba(217, 70, 239, 0.3)",
                              },
                              "&:disabled": {
                                backgroundColor: "rgba(217, 70, 239, 0.3)",
                                color: "rgba(255, 255, 255, 0.5)",
                              },
                              transition: "all 0.2s ease",
                              py: 1,
                              px: 2,
                            }}
                          >
                            {isSubmitting
                              ? t("Submitting...")
                              : t("Submit for Analysis")}
                          </Button>
                        </DialogActions>
                      )}
                    </FormControl>
                  </Box>

                  {/* Upload New Scan Section for Premium Users */}
                  {/* {isPatientPremium && (
                    <Box sx={{ mb: 4 }}>
                      <Divider
                        sx={{ borderColor: "rgba(255, 255, 255, 0.1)", my: 3 }}
                      />

                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "12px",
                            background: "rgba(245, 158, 11, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mr: 2,
                          }}
                        >
                          <StarIcon sx={{ color: "#f59e0b" }} />
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: "#f59e0b",
                          }}
                        >
                          {t("Premium Feature: Upload New Scan")}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          border: "2px dashed rgba(255, 255, 255, 0.2)",
                          borderRadius: "16px",
                          p: 3,
                          textAlign: "center",
                          backgroundColor: "rgba(255, 255, 255, 0.03)",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                        }}
                      >
                        {!previewUrl ? (
                          <Box>
                            <input
                              accept="image/*"
                              style={{ display: "none" }}
                              id="scan-upload-button-inline"
                              type="file"
                              onChange={handleFileChange}
                            />
                            <label htmlFor="scan-upload-button-inline">
                              <Button
                                component="span"
                                startIcon={<CloudUploadIcon />}
                                variant="outlined"
                                sx={{
                                  borderRadius: "12px",
                                  borderColor: "rgba(236, 72, 153, 0.3)",
                                  color: "#ec4899",
                                  backgroundColor: "rgba(236, 72, 153, 0.05)",
                                  px: 3,
                                  py: 1.2,
                                  mb: 2,
                                  "&:hover": {
                                    borderColor: "#ec4899",
                                    backgroundColor: "rgba(236, 72, 153, 0.1)",
                                  },
                                }}
                              >
                                {t("Choose File")}
                              </Button>
                            </label>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "rgba(255, 255, 255, 0.6)",
                              }}
                            >
                              {t("Supported formats: JPEG, PNG, TIFF, DICOM")}
                            </Typography>
                          </Box>
                        ) : (
                          <Box>
                            <Box
                              sx={{
                                position: "relative",
                                width: "100%",
                                maxHeight: "300px",
                                overflow: "hidden",
                                borderRadius: "8px",
                                mb: 2,
                              }}
                            >
                              <Box
                                component="img"
                                src={previewUrl}
                                alt="Scan preview"
                                sx={{
                                  width: "100%",
                                  maxHeight: "300px",
                                  objectFit: "contain",
                                }}
                              />
                              <IconButton
                                onClick={() => {
                                  setUploadedFile(null);
                                  setPreviewUrl("");
                                }}
                                sx={{
                                  position: "absolute",
                                  top: 8,
                                  right: 8,
                                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                                  color: "white",
                                  "&:hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                                  },
                                }}
                              >
                                <CloseIcon />
                              </IconButton>
                            </Box>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "rgba(255, 255, 255, 0.9)",
                                fontWeight: 600,
                                mb: 2,
                              }}
                            >
                              {uploadedFile?.name}
                            </Typography>
                            <Button
                              variant="contained"
                              startIcon={
                                isAnalyzing ? (
                                  <CircularProgress size={20} color="inherit" />
                                ) : (
                                  <AnalyticsIcon />
                                )
                              }
                              onClick={handleSubmitScan}
                              disabled={isAnalyzing}
                              sx={{
                                borderRadius: "12px",
                                backgroundColor: "#d946ef",
                                color: "white",
                                "&:hover": {
                                  backgroundColor: "#c026d3",
                                  transform: "translateY(-2px)",
                                  boxShadow:
                                    "0 6px 15px rgba(217, 70, 239, 0.3)",
                                },
                                "&:disabled": {
                                  backgroundColor: "rgba(217, 70, 239, 0.3)",
                                  color: "rgba(255, 255, 255, 0.5)",
                                },
                                transition: "all 0.2s ease",
                                py: 1,
                                px: 3,
                              }}
                            >
                              {isAnalyzing
                                ? t("Analyzing...")
                                : t("Analyze Now")}
                            </Button>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  )} */}

                  {/* Analysis Results Table */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: "rgba(255, 255, 255, 0.9)",
                        mb: 2,
                      }}
                    >
                      {t("Analysis History")}
                    </Typography>

                    <TableContainer
                      sx={{
                        borderRadius: "20px",
                        background: "rgba(255, 255, 255, 0.02)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                        mb: 3,
                        overflow: "hidden",
                      }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow
                            sx={{
                              background:
                                "linear-gradient(90deg, rgba(236, 72, 153, 0.1), rgba(217, 70, 239, 0.1))",
                              "& th": {
                                color: "rgba(255, 255, 255, 0.9)",
                                fontWeight: 600,
                                fontSize: "0.9rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                borderBottom: "none",
                                py: 2.5,
                              },
                            }}
                          >
                            <TableCell>{t("Scan")}</TableCell>
                            <TableCell>{t("Submitted")}</TableCell>
                            <TableCell>{t("Status")}</TableCell>
                            <TableCell>{t("Result")}</TableCell>
                            <TableCell align="right">{t("Actions")}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {paginatedScanResults.map((scanResult) => {
                            const formattedDate = dayjs(
                              scanResult.createdAt
                            ).format("DD-MM-YY HH:mm");
                            const statusInfo = getStatusInfo(
                              scanResult.resultState || "Processing"
                            );

                            return (
                              <TableRow
                                key={scanResult._id}
                                sx={{
                                  "&:hover": {
                                    backgroundColor:
                                      "rgba(255, 255, 255, 0.05)",
                                  },
                                  "& td": {
                                    borderBottom:
                                      "1px solid rgba(255, 255, 255, 0.05)",
                                    color: "rgba(255, 255, 255, 0.8)",
                                    py: 2,
                                  },
                                  transition: "background-color 0.2s ease",
                                }}
                              >
                                <TableCell>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Avatar
                                      variant="rounded"
                                      sx={{
                                        bgcolor: "rgba(217, 70, 239, 0.2)",
                                        color: "#ec4899",
                                        mr: 2,
                                        width: 48,
                                        height: 48,
                                        borderRadius: "12px",
                                        boxShadow:
                                          "0 4px 12px rgba(0, 0, 0, 0.1)",
                                      }}
                                    >
                                      <MedicalServicesIcon />
                                    </Avatar>
                                    <Box>
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontWeight: 600,
                                          color: "rgba(255, 255, 255, 0.9)",
                                        }}
                                      >
                                        {scanResult?.scanID?.imageURL
                                          .split("/")
                                          .pop() || t("Medical Scan")}
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          color: "rgba(255, 255, 255, 0.6)",
                                        }}
                                      >
                                        {t("X-Ray")}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <CalendarMonthIcon
                                      fontSize="small"
                                      sx={{
                                        color: "#ec4899",
                                        mr: 1,
                                        opacity: 0.8,
                                      }}
                                    />
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        color: "rgba(255, 255, 255, 0.8)",
                                      }}
                                    >
                                      {formattedDate}
                                    </Typography>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    icon={statusInfo.icon}
                                    label={t(
                                      scanResult.resultState
                                        ? "Processed"
                                        : "Unprocessed"
                                    )}
                                    size="small"
                                    sx={{
                                      backgroundColor: statusInfo.bgColor,
                                      color: statusInfo.color,
                                      border: `1px solid ${statusInfo.borderColor}`,
                                      fontWeight: 600,
                                      px: 0.5,
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: "rgba(255, 255, 255, 0.8)",
                                      fontWeight: "400",
                                    }}
                                  >
                                    {scanResult?.resultClass}
                                    {/* {t("No findings")} */}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "flex-end",
                                      gap: 1,
                                    }}
                                  >
                                    <Tooltip title={t("View details")}>
                                      <IconButton
                                        onClick={() =>
                                          handleGoToDocument(scanResult._id)
                                        }
                                        size="small"
                                        sx={{
                                          color: "#ec4899",
                                          backgroundColor:
                                            "rgba(236, 72, 153, 0.1)",
                                          borderRadius: "12px",
                                          p: 1,
                                          "&:hover": {
                                            backgroundColor:
                                              "rgba(236, 72, 153, 0.2)",
                                            transform: "translateY(-2px)",
                                            boxShadow:
                                              "0 4px 12px rgba(236, 72, 153, 0.2)",
                                          },
                                          transition: "all 0.2s ease",
                                        }}
                                      >
                                        <VisibilityIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title={t("Download report")}>
                                      <IconButton
                                        onClick={() =>
                                          handleDownload(
                                            BASE_URL,
                                            scanResult?.scanID?.imageURL
                                          )
                                        }
                                        size="small"
                                        sx={{
                                          color: "#ec4899",
                                          backgroundColor:
                                            "rgba(236, 72, 153, 0.1)",
                                          borderRadius: "12px",
                                          p: 1,
                                          "&:hover": {
                                            backgroundColor:
                                              "rgba(236, 72, 153, 0.2)",
                                            transform: "translateY(-2px)",
                                            boxShadow:
                                              "0 4px 12px rgba(236, 72, 153, 0.2)",
                                          },
                                          transition: "all 0.2s ease",
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
                  </Box>

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
                        color: "rgba(255, 255, 255, 0.9)",
                      },
                      ".MuiTablePagination-selectIcon": {
                        color: "#ec4899",
                      },
                      ".MuiTablePagination-actions": {
                        "& .MuiIconButton-root": {
                          color: "rgba(255, 255, 255, 0.7)",
                          "&:hover": {
                            backgroundColor: "rgba(236, 72, 153, 0.1)",
                          },
                          "&.Mui-disabled": {
                            color: "rgba(255, 255, 255, 0.3)",
                          },
                        },
                      },
                    }}
                  />
                </>
              )}
            </Box>
          </Card>
        </Grow>

        {/* FAQ Section */}
        <Fade in={loaded} timeout={800} style={{ transitionDelay: "500ms" }}>
          <Card
            sx={{
              borderRadius: "24px",
              overflow: "hidden",
              background: "rgba(255, 255, 255, 0.03)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                inset: "-1px",
                borderRadius: "25px",
                padding: "1px",
                background:
                  "linear-gradient(130deg, #ec4899, transparent, #d946ef)",
                WebkitMask:
                  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                pointerEvents: "none",
              },
            }}
          >
            <Box sx={{ p: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "12px",
                    background:
                      "linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(217, 70, 239, 0.2))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 2,
                  }}
                >
                  <HelpOutlineIcon sx={{ color: "#ec4899" }} />
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: "#ffffff",
                  }}
                >
                  {t("Frequently Asked Questions")}
                </Typography>
              </Box>

              <Box sx={{ mt: 2 }}>
                {faqItems.map((item, index) => (
                  <Accordion
                    key={index}
                    sx={{
                      background: "rgba(255, 255, 255, 0.03)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      borderRadius: "16px !important",
                      mb: 2,
                      "&:before": {
                        display: "none",
                      },
                      "&.Mui-expanded": {
                        margin: "0 0 16px 0",
                      },
                      boxShadow: "none",
                      overflow: "hidden",
                    }}
                  >
                    <AccordionSummary
                      expandIcon={
                        <ExpandMoreIcon
                          sx={{
                            color: "#ec4899",
                          }}
                        />
                      }
                      sx={{
                        borderRadius: "16px",
                        "&.Mui-expanded": {
                          borderBottomLeftRadius: 0,
                          borderBottomRightRadius: 0,
                        },
                        "& .MuiAccordionSummary-content": {
                          margin: "12px 0",
                        },
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          color: "rgba(255, 255, 255, 0.9)",
                        }}
                      >
                        {item.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{
                        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                        p: 3,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(255, 255, 255, 0.7)",
                          lineHeight: 1.6,
                        }}
                      >
                        {item.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </Box>
          </Card>
        </Fade>
      </Container>

      {/* Scan Upload Dialog */}
      <Dialog
        open={scanDialogOpen}
        onClose={handleCloseScanDialog}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: "24px",
            background: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: "-1px",
              borderRadius: "25px",
              padding: "1px",
              background:
                "linear-gradient(130deg, #ec4899, transparent, #d946ef)",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              pointerEvents: "none",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            p: 3,
            pb: 2,
            color: "#ffffff",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "12px",
                background:
                  "linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(217, 70, 239, 0.2))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow:
                  "0 8px 16px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.05)",
              }}
            >
              <HealthAndSafetyIcon sx={{ color: "#ec4899", fontSize: 24 }} />
            </Box>
            {t("Submit Scan for AI Analysis")}
          </Box>
          <IconButton
            onClick={handleCloseScanDialog}
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />

        <DialogContent sx={{ p: 3 }}>
          {!isPatientPremium && (
            <Alert
              severity="info"
              icon={<AccessTimeIcon />}
              sx={{
                mb: 3,
                backgroundColor: "rgba(236, 72, 153, 0.1)",
                color: "rgba(255, 255, 255, 0.9)",
                border: "1px solid rgba(236, 72, 153, 0.2)",
                "& .MuiAlert-icon": {
                  color: "#ec4899",
                },
              }}
            >
              {t(
                "As a regular patient, your analysis results will be available within 24-48 hours."
              )}
            </Alert>
          )}

          {isPatientPremium && (
            <Alert
              severity="success"
              icon={<StarIcon />}
              sx={{
                mb: 3,
                backgroundColor: "rgba(245, 158, 11, 0.1)",
                color: "rgba(255, 255, 255, 0.9)",
                border: "1px solid rgba(245, 158, 11, 0.2)",
                "& .MuiAlert-icon": {
                  color: "#f59e0b",
                },
              }}
            >
              {t(
                "As a premium patient, your analysis results will be available instantly."
              )}
            </Alert>
          )}

          <Box sx={{ mb: 3 }}>
            <FormControl component="fieldset">
              <FormLabel
                component="legend"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                {t("Select Scan Source")}
              </FormLabel>
              <RadioGroup
                aria-label="upload-type"
                name="upload-type"
                value={uploadType}
                onChange={handleUploadTypeChange}
                sx={{
                  "& .MuiFormControlLabel-root": {
                    marginRight: 4,
                  },
                }}
                row
              >
                <FormControlLabel
                  value="existing"
                  control={
                    <Radio
                      sx={{
                        color: "rgba(255, 255, 255, 0.6)",
                        "&.Mui-checked": {
                          color: "#ec4899",
                        },
                      }}
                    />
                  }
                  label={t("Use existing scan")}
                  sx={{
                    color: "rgba(255, 255, 255, 0.9)",
                  }}
                />
                {isPatientPremium && (
                  <FormControlLabel
                    value="upload"
                    control={
                      <Radio
                        sx={{
                          color: "rgba(255, 255, 255, 0.6)",
                          "&.Mui-checked": {
                            color: "#ec4899",
                          },
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {t("Upload New Scan")}
                        <Chip
                          size="small"
                          icon={
                            <StarIcon sx={{ fontSize: "0.8rem !important" }} />
                          }
                          label={t("Premium")}
                          sx={{
                            ml: 1,
                            backgroundColor: "rgba(245, 158, 11, 0.1)",
                            color: "#f59e0b",
                            border: "1px solid rgba(245, 158, 11, 0.3)",
                            height: 20,
                            "& .MuiChip-label": {
                              px: 1,
                              fontSize: "0.7rem",
                              fontWeight: 600,
                            },
                          }}
                        />
                      </Box>
                    }
                    sx={{
                      color: "rgba(255, 255, 255, 0.9)",
                    }}
                  />
                )}
              </RadioGroup>
            </FormControl>
          </Box>

          {uploadType === "existing" && (
            <Box sx={{ mb: 3 }}>
              <FormLabel
                component="legend"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                {t("Select a scan from your records")}
              </FormLabel>
              {scans.length > 0 ? (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {scans.map((scan) => (
                    <Grid item xs={12} sm={6} md={4} key={scan._id}>
                      <Box
                        onClick={() => setSelectedScan(scan)}
                        sx={{
                          p: 2,
                          borderRadius: "16px",
                          border: "1px solid",
                          borderColor:
                            selectedScan && selectedScan._id === scan._id
                              ? "rgba(236, 72, 153, 0.5)"
                              : "rgba(255, 255, 255, 0.1)",
                          background:
                            selectedScan && selectedScan._id === scan._id
                              ? "rgba(236, 72, 153, 0.1)"
                              : "rgba(255, 255, 255, 0.03)",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            borderColor: "rgba(236, 72, 153, 0.3)",
                            background: "rgba(236, 72, 153, 0.05)",
                            transform: "translateY(-2px)",
                          },
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          textAlign: "center",
                        }}
                      >
                        <Box
                          sx={{
                            width: "100%",
                            height: 120,
                            borderRadius: "8px",
                            overflow: "hidden",
                            mb: 2,
                            position: "relative",
                            backgroundColor: "rgba(0, 0, 0, 0.2)",
                          }}
                        >
                          <Box
                            component="img"
                            src={`${BASE_URL}${scan.imageURL}`}
                            alt={scan.imageURL.split("/").pop()}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          {selectedScan && selectedScan._id === scan._id && (
                            <Box
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                backgroundColor: "rgba(236, 72, 153, 0.2)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <CheckCircleOutlineIcon
                                sx={{ color: "white", fontSize: 40 }}
                              />
                            </Box>
                          )}
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(255, 255, 255, 0.9)",
                            fontWeight: 600,
                            mb: 0.5,
                          }}
                        >
                          {scan.imageURL.split("/").pop()}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "rgba(255, 255, 255, 0.6)",
                          }}
                        >
                          {dayjs(scan.createdAt).format("DD-MM-YY")}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Alert
                  severity="warning"
                  sx={{
                    backgroundColor: "rgba(245, 158, 11, 0.1)",
                    color: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid rgba(245, 158, 11, 0.2)",
                  }}
                >
                  {t("No scans available. Please contact your administrator.")}
                </Alert>
              )}
            </Box>
          )}

          {uploadType === "upload" && isPatientPremium && (
            <Box sx={{ mb: 3 }}>
              <FormLabel
                component="legend"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                {t("Upload a new scan image")}
              </FormLabel>
              <Box
                sx={{
                  border: "2px dashed rgba(255, 255, 255, 0.2)",
                  borderRadius: "16px",
                  p: 3,
                  textAlign: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                }}
              >
                {!previewUrl ? (
                  <Box>
                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id="scan-upload-button"
                      type="file"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="scan-upload-button">
                      <Button
                        component="span"
                        startIcon={<CloudUploadIcon />}
                        variant="outlined"
                        sx={{
                          borderRadius: "12px",
                          borderColor: "rgba(236, 72, 153, 0.3)",
                          color: "#ec4899",
                          backgroundColor: "rgba(236, 72, 153, 0.05)",
                          px: 3,
                          py: 1.2,
                          mb: 2,
                          "&:hover": {
                            borderColor: "#ec4899",
                            backgroundColor: "rgba(236, 72, 153, 0.1)",
                          },
                        }}
                      >
                        {t("Choose File")}
                      </Button>
                    </label>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(255, 255, 255, 0.6)",
                      }}
                    >
                      {t("Supported formats: JPEG, PNG, TIFF, DICOM")}
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        maxHeight: "300px",
                        overflow: "hidden",
                        borderRadius: "8px",
                        mb: 2,
                      }}
                    >
                      <Box
                        component="img"
                        src={previewUrl}
                        alt="Scan preview"
                        sx={{
                          width: "100%",
                          maxHeight: "300px",
                          objectFit: "contain",
                        }}
                      />
                      <IconButton
                        onClick={() => {
                          setUploadedFile(null);
                          setPreviewUrl("");
                        }}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.7)",
                          },
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(255, 255, 255, 0.9)",
                        fontWeight: 600,
                      }}
                    >
                      {uploadedFile?.name}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}

          {success && (
            <Alert
              severity="success"
              sx={{
                mb: 3,
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                color: "#10b981",
                border: "1px solid rgba(16, 185, 129, 0.2)",
              }}
            >
              {isPatientPremium
                ? t(
                    "Scan submitted successfully! Your results will be available shortly."
                  )
                : t(
                    "Scan submitted successfully! Your results will be available within 24-48 hours."
                  )}
            </Alert>
          )}

          <Box
            sx={{
              p: 2,
              borderRadius: "12px",
              backgroundColor: "rgba(236, 72, 153, 0.05)",
              border: "1px solid rgba(236, 72, 153, 0.1)",
              display: "flex",
              alignItems: "flex-start",
              gap: 2,
            }}
          >
            <InfoOutlinedIcon sx={{ color: "#ec4899", mt: 0.5 }} />
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                lineHeight: 1.6,
              }}
            >
              {t(
                "AI analysis is intended to assist healthcare professionals and should not replace professional medical advice. Always consult with your doctor regarding the results."
              )}
            </Typography>
          </Box>
        </DialogContent>

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />

        <DialogActions sx={{ p: 2.5 }}>
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            disabled={isSubmitting}
            onClick={handleCloseScanDialog}
            sx={{
              borderRadius: "12px",
              borderColor: "rgba(255, 255, 255, 0.2)",
              color: "rgba(255, 255, 255, 0.8)",
              "&:hover": {
                borderColor: "rgba(255, 255, 255, 0.3)",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              },
              py: 1,
              px: 2,
            }}
          >
            {t("Cancel")}
          </Button>

          <Button
            variant="contained"
            startIcon={
              isSubmitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <HealthAndSafetyIcon />
              )
            }
            onClick={handleSubmitScan}
            disabled={
              isSubmitting ||
              success ||
              (uploadType === "existing" && !selectedScan) ||
              (uploadType === "upload" && !uploadedFile)
            }
            sx={{
              borderRadius: "12px",
              backgroundColor: "#d946ef",
              color: "white",
              "&:hover": {
                backgroundColor: "#c026d3",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 15px rgba(217, 70, 239, 0.3)",
              },
              "&:disabled": {
                backgroundColor: "rgba(217, 70, 239, 0.3)",
                color: "rgba(255, 255, 255, 0.5)",
              },
              transition: "all 0.2s ease",
              py: 1,
              px: 2,
            }}
          >
            {isSubmitting ? t("Submitting...") : t("Submit for Analysis")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Result Details Dialog */}
      <Dialog
        open={resultDialogOpen}
        onClose={() => setResultDialogOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: "24px",
            background: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: "-1px",
              borderRadius: "25px",
              padding: "1px",
              background:
                "linear-gradient(130deg, #ec4899, transparent, #d946ef)",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              pointerEvents: "none",
            },
          },
        }}
      >
        {selectedResult && (
          <>
            <DialogTitle
              sx={{
                p: 3,
                pb: 2,
                color: "#ffffff",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "12px",
                    background:
                      "linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(217, 70, 239, 0.2))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow:
                      "0 8px 16px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <AnalyticsIcon sx={{ color: "#ec4899", fontSize: 24 }} />
                </Box>
                {t("Analysis Results")}
              </Box>
              <IconButton
                onClick={() => setResultDialogOpen(false)}
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />

            <DialogContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      borderRadius: "16px",
                      overflow: "hidden",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: "rgba(255, 255, 255, 0.03)",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <ImageIcon sx={{ color: "#ec4899" }} />
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: "rgba(255, 255, 255, 0.9)",
                        }}
                      >
                        {t("Scan Image")}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        p: 3,
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      {selectedResult.imageUrl ? (
                        <Box
                          component="img"
                          src={selectedResult.imageUrl}
                          alt={selectedResult.scanName || "Medical Scan"}
                          sx={{
                            maxWidth: "100%",
                            maxHeight: "300px",
                            objectFit: "contain",
                            borderRadius: "8px",
                          }}
                        />
                      ) : selectedResult.scanId ? (
                        <Box
                          component="img"
                          src={`${BASE_URL}/scans/${selectedResult.scanId}`}
                          alt={selectedResult.scanName || "Medical Scan"}
                          sx={{
                            maxWidth: "100%",
                            maxHeight: "300px",
                            objectFit: "contain",
                            borderRadius: "8px",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: "100%",
                            height: "300px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: "rgba(255, 255, 255, 0.5)",
                            }}
                          >
                            {t("Image not available")}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      borderRadius: "16px",
                      overflow: "hidden",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: "rgba(255, 255, 255, 0.03)",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <DescriptionIcon sx={{ color: "#ec4899" }} />
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: "rgba(255, 255, 255, 0.9)",
                        }}
                      >
                        {t("Analysis Details")}
                      </Typography>
                    </Box>
                    <Box sx={{ p: 3, flex: 1 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "rgba(255, 255, 255, 0.6)",
                              mb: 0.5,
                            }}
                          >
                            {t("Scan Name")}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              color: "rgba(255, 255, 255, 0.9)",
                              fontWeight: 600,
                              mb: 2,
                            }}
                          >
                            {selectedResult.scanName || t("Medical Scan")}
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "rgba(255, 255, 255, 0.6)",
                              mb: 0.5,
                            }}
                          >
                            {t("Scan Type")}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              color: "rgba(255, 255, 255, 0.9)",
                              fontWeight: 600,
                              mb: 2,
                            }}
                          >
                            {selectedResult.scanType || t("X-Ray")}
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "rgba(255, 255, 255, 0.6)",
                              mb: 0.5,
                            }}
                          >
                            {t("Submitted Date")}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              color: "rgba(255, 255, 255, 0.9)",
                              fontWeight: 600,
                              mb: 2,
                            }}
                          >
                            {dayjs(selectedResult.createdAt).format(
                              "DD-MM-YYYY HH:mm"
                            )}
                          </Typography>
                        </Grid>

                        <Grid item xs={12}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "rgba(255, 255, 255, 0.6)",
                              mb: 0.5,
                            }}
                          >
                            {t("Status")}
                          </Typography>
                          <Box sx={{ mb: 2 }}>
                            <Chip
                              icon={
                                getStatusInfo(
                                  selectedResult.status || "Processing"
                                ).icon
                              }
                              label={t(selectedResult.status || "Processing")}
                              size="small"
                              sx={{
                                backgroundColor: getStatusInfo(
                                  selectedResult.status || "Processing"
                                ).bgColor,
                                color: getStatusInfo(
                                  selectedResult.status || "Processing"
                                ).color,
                                border: `1px solid ${
                                  getStatusInfo(
                                    selectedResult.status || "Processing"
                                  ).borderColor
                                }`,
                                fontWeight: 600,
                                px: 0.5,
                              }}
                            />
                          </Box>
                        </Grid>

                        <Grid item xs={12}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "rgba(255, 255, 255, 0.6)",
                              mb: 0.5,
                            }}
                          >
                            {t("Findings")}
                          </Typography>
                          {selectedResult.status === "Completed" ? (
                            <Typography
                              variant="body1"
                              sx={{
                                color: "rgba(255, 255, 255, 0.9)",
                                fontWeight: 500,
                                p: 2,
                                borderRadius: "8px",
                                backgroundColor: "rgba(255, 255, 255, 0.03)",
                                border: "1px solid rgba(255, 255, 255, 0.05)",
                              }}
                            >
                              {selectedResult.finding ||
                                t("No abnormalities detected")}
                            </Typography>
                          ) : (
                            <Box
                              sx={{
                                p: 2,
                                borderRadius: "8px",
                                backgroundColor: "rgba(255, 255, 255, 0.03)",
                                border: "1px solid rgba(255, 255, 255, 0.05)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection: "column",
                                gap: 1,
                              }}
                            >
                              {isPatientPremium ? (
                                <>
                                  <CircularProgress
                                    size={24}
                                    sx={{ color: "#ec4899", mb: 1 }}
                                  />
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: "rgba(255, 255, 255, 0.7)",
                                    }}
                                  >
                                    {t("Analysis in progress...")}
                                  </Typography>
                                </>
                              ) : (
                                <>
                                  <AccessTimeIcon
                                    sx={{ color: "#f59e0b", mb: 1 }}
                                  />
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: "rgba(255, 255, 255, 0.7)",
                                    }}
                                  >
                                    {t(
                                      "Results will be available within 24-48 hours"
                                    )}
                                  </Typography>
                                </>
                              )}
                            </Box>
                          )}
                        </Grid>

                        {selectedResult.confidence && (
                          <Grid item xs={12} sx={{ mt: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "rgba(255, 255, 255, 0.6)",
                                mb: 0.5,
                              }}
                            >
                              {t("AI Confidence")}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                              }}
                            >
                              <Box
                                sx={{
                                  flex: 1,
                                  height: 8,
                                  borderRadius: 4,
                                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                                  overflow: "hidden",
                                }}
                              >
                                <Box
                                  sx={{
                                    height: "100%",
                                    width: `${selectedResult.confidence}%`,
                                    backgroundColor:
                                      selectedResult.confidence > 90
                                        ? "#10b981"
                                        : selectedResult.confidence > 70
                                        ? "#f59e0b"
                                        : "#ef4444",
                                    borderRadius: 4,
                                  }}
                                />
                              </Box>
                              <Typography
                                variant="body2"
                                sx={{
                                  color:
                                    selectedResult.confidence > 90
                                      ? "#10b981"
                                      : selectedResult.confidence > 70
                                      ? "#f59e0b"
                                      : "#ef4444",
                                  fontWeight: 600,
                                }}
                              >
                                {selectedResult.confidence}%
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: "12px",
                  backgroundColor: "rgba(236, 72, 153, 0.05)",
                  border: "1px solid rgba(236, 72, 153, 0.1)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                }}
              >
                <InfoOutlinedIcon sx={{ color: "#ec4899", mt: 0.5 }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 1.6,
                  }}
                >
                  {t(
                    "AI analysis is intended to assist healthcare professionals and should not replace professional medical advice. Always consult with your doctor regarding the results."
                  )}
                </Typography>
              </Box>
            </DialogContent>

            <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />

            <DialogActions sx={{ p: 2.5 }}>
              <Button
                variant="outlined"
                startIcon={<CloseIcon />}
                onClick={() => setResultDialogOpen(false)}
                sx={{
                  borderRadius: "12px",
                  borderColor: "rgba(255, 255, 255, 0.2)",
                  color: "rgba(255, 255, 255, 0.8)",
                  "&:hover": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                  },
                  py: 1,
                  px: 2,
                }}
              >
                {t("Close")}
              </Button>

              {selectedResult.reportUrl && (
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={() =>
                    handleDownload(BASE_URL, selectedResult.reportUrl)
                  }
                  sx={{
                    borderRadius: "12px",
                    backgroundColor: "#d946ef",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#c026d3",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 15px rgba(217, 70, 239, 0.3)",
                    },
                    transition: "all 0.2s ease",
                    py: 1,
                    px: 2,
                  }}
                >
                  {t("Download Report")}
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
