"use client"

import { useEffect, useState, useRef } from "react"
import {
  Typography,
  Box,
  Chip,
  Avatar,
  useTheme,
  alpha,
  TablePagination,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Divider,
} from "@mui/material"
import DoneIcon from "@mui/icons-material/Done"
import CloseIcon from "@mui/icons-material/Close"
import RefreshIcon from "@mui/icons-material/Refresh"
import EmailIcon from "@mui/icons-material/Email"
import PhoneIcon from "@mui/icons-material/Phone"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import StarIcon from "@mui/icons-material/Star"
import MedicalServicesIcon from "@mui/icons-material/MedicalServices"
import { useDispatch, useSelector } from "react-redux"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"

import dayjs from "dayjs"

import { useTranslation } from "react-i18next"
import { AsyncgetAllDoctors } from "./PaymentSlice"
import { useNavigate } from "react-router-dom"

export default function Doctors() {
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const [loaded, setLoaded] = useState(false)

  const { doctors, isPatientPremium } = useSelector((state) => state.payment)
  const [filteredUsers, setFilteredUsers] = useState(doctors)

  // Pagination state
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const { t } = useTranslation()

  useEffect(() => {
    setLoaded(true)
  }, [])

  // Beautiful background animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const width = (canvas.width = window.innerWidth)
    const height = (canvas.height = window.innerHeight)

    // Create particles for the neural network
    const particles = []
    const connections = []
    const numParticles = 120
    const connectionDistance = 150
    const particleColors = ["#4c1d95", "#5b21b6", "#7e22ce", "#8b5cf6", "#6d28d9", "#4338ca", "#ec4899", "#be185d"]

    // Initialize particles
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        vx: Math.random() * 0.5 - 0.25,
        vy: Math.random() * 0.5 - 0.25,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseSize: 0,
        pulseDirection: 1,
      })
    }

    // Animation function
    function animate() {
      // Create a gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, "#0f172a")
      gradient.addColorStop(0.5, "#1e1b4b")
      gradient.addColorStop(1, "#4a1d96")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Update and draw particles
      particles.forEach((particle) => {
        // Move particles
        particle.x += particle.vx
        particle.y += particle.vy

        // Bounce off edges
        if (particle.x < 0 || particle.x > width) particle.vx *= -1
        if (particle.y < 0 || particle.y > height) particle.vy *= -1

        // Pulse effect
        particle.pulseSize += particle.pulseSpeed * particle.pulseDirection
        if (particle.pulseSize > 1 || particle.pulseSize < 0) {
          particle.pulseDirection *= -1
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius + particle.pulseSize, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()
      })

      // Find and draw connections
      connections.length = 0
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            connections.push({
              p1: particles[i],
              p2: particles[j],
              opacity: 1 - distance / connectionDistance,
            })
          }
        }
      }

      // Draw connections
      connections.forEach((connection) => {
        ctx.beginPath()
        ctx.moveTo(connection.p1.x, connection.p1.y)
        ctx.lineTo(connection.p2.x, connection.p2.y)

        // Create gradient for connection
        const gradient = ctx.createLinearGradient(connection.p1.x, connection.p1.y, connection.p2.x, connection.p2.y)
        gradient.addColorStop(0, connection.p1.color.replace(")", `, ${connection.opacity})`).replace("rgb", "rgba"))
        gradient.addColorStop(1, connection.p2.color.replace(")", `, ${connection.opacity})`).replace("rgb", "rgba"))

        ctx.strokeStyle = gradient
        ctx.lineWidth = connection.opacity * 1.5
        ctx.stroke()
      })

      // Add subtle glow effect
      const radialGradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2)
      radialGradient.addColorStop(0, "rgba(139, 92, 246, 0.05)")
      radialGradient.addColorStop(0.5, "rgba(124, 58, 237, 0.03)")
      radialGradient.addColorStop(1, "rgba(109, 40, 217, 0)")
      ctx.fillStyle = radialGradient
      ctx.fillRect(0, 0, width, height)

      requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleRefresh = () => {
    if (isPatientPremium) {
      dispatch(AsyncgetAllDoctors())
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  useEffect(() => {
    if (isPatientPremium) {
      dispatch(AsyncgetAllDoctors())
    }
  }, [dispatch, isPatientPremium])

  useEffect(() => {
    setFilteredUsers(doctors)
  }, [doctors])

  // Apply pagination
  const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        // You could add a toast notification here if you have a toast system
        console.log("Copied to clipboard: " + text)
      },
      (err) => {
        console.error("Could not copy text: ", err)
      },
    )
  }

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
          background: "radial-gradient(circle at center, rgba(91, 33, 182, 0.2) 0%, rgba(49, 10, 101, 0.6) 100%)",
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
        {/* Header Section with Title and Status */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            mb: 4,
            mt: 4,
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: { xs: 2, md: 0 } }}>
            <Avatar
              sx={{
                width: 60,
                height: 60,
                bgcolor: "rgba(139, 92, 246, 0.1)",
                color: "#8b5cf6",
                mr: 3,
                boxShadow: "0 8px 16px rgba(139, 92, 246, 0.2)",
              }}
            >
              <MedicalServicesIcon sx={{ fontSize: 30 }} />
            </Avatar>
            <Box>
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
                {t("Doctors")}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                {isPatientPremium ? (
                  <Chip
                    icon={<StarIcon sx={{ color: "#f59e0b !important", fontSize: "1rem" }} />}
                    label={t("Premium Access")}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(245, 158, 11, 0.15)",
                      color: "#f59e0b",
                      fontWeight: "bold",
                      borderRadius: "8px",
                      border: "1px solid rgba(245, 158, 11, 0.3)",
                      "& .MuiChip-label": {
                        px: 1,
                      },
                    }}
                  />
                ) : (
                  <Chip
                    icon={<StarIcon sx={{ color: "rgba(255, 255, 255, 0.5) !important", fontSize: "1rem" }} />}
                    label={t("Limited Access")}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      color: "rgba(255, 255, 255, 0.7)",
                      fontWeight: "medium",
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      "& .MuiChip-label": {
                        px: 1,
                      },
                    }}
                  />
                )}
                {isPatientPremium && filteredUsers.length > 0 && (
                  <Chip
                    label={`${filteredUsers.length} ${t("doctors")}`}
                    size="small"
                    sx={{
                      ml: 2,
                      backgroundColor: "rgba(236, 72, 153, 0.15)",
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: "8px",
                      border: "1px solid rgba(236, 72, 153, 0.3)",
                    }}
                  />
                )}
              </Box>
            </Box>
          </Box>

          {isPatientPremium && (
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
                px: 3,
                py: 1.2,
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.1)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
                },
                transition: "all 0.3s ease",
              }}
            >
              {t("Refresh")}
            </Button>
          )}
        </Box>

        {/* Main Content */}
        {!isPatientPremium ? (
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
            <CardContent sx={{ p: 0 }}>
              <Grid container>
                <Grid item xs={12} md={5}>
                  <Box
                    sx={{
                      p: 4,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)",
                      borderRight: { xs: "none", md: "1px solid rgba(255, 255, 255, 0.1)" },
                      borderBottom: { xs: "1px solid rgba(255, 255, 255, 0.1)", md: "none" },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: "rgba(236, 72, 153, 0.1)",
                        color: "#ec4899",
                        mb: 3,
                        mx: "auto",
                      }}
                    >
                      <StarIcon sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant="h4" fontWeight="bold" color="white" gutterBottom align="center">
                      {t("Premium Feature")}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="rgba(255, 255, 255, 0.7)"
                      paragraph
                      sx={{ maxWidth: 500, mx: "auto", textAlign: "center" }}
                    >
                      {t("You need to upgrade to premium to access the complete list of doctors.")}
                    </Typography>
                    <Box sx={{ textAlign: "center", mt: 2 }}>
                      <Button
                        variant="contained"
                        startIcon={<StarIcon />}
                        onClick={() => {
                          navigate("/subscription")
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
                  </Box>
                </Grid>
                <Grid item xs={12} md={7}>
                  <Box sx={{ p: 4 }}>
                    <Typography variant="h5" fontWeight="bold" color="white" gutterBottom>
                      {t("Premium Benefits")}
                    </Typography>
                    <Divider sx={{ my: 2, borderColor: "rgba(255, 255, 255, 0.1)" }} />

                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={12} sm={6}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: "12px",
                            background: "rgba(255, 255, 255, 0.03)",
                            border: "1px solid rgba(139, 92, 246, 0.2)",
                            height: "100%",
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                            <Avatar
                              sx={{
                                width: 36,
                                height: 36,
                                bgcolor: "rgba(139, 92, 246, 0.1)",
                                color: "#8b5cf6",
                                mr: 2,
                              }}
                            >
                              <MedicalServicesIcon fontSize="small" />
                            </Avatar>
                            <Typography variant="subtitle1" fontWeight="medium" color="white">
                              {t("Full Doctor Directory")}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                            {t("Access our complete directory of qualified medical professionals")}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: "12px",
                            background: "rgba(255, 255, 255, 0.03)",
                            border: "1px solid rgba(236, 72, 153, 0.2)",
                            height: "100%",
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                            <Avatar
                              sx={{
                                width: 36,
                                height: 36,
                                bgcolor: "rgba(236, 72, 153, 0.1)",
                                color: "#ec4899",
                                mr: 2,
                              }}
                            >
                              <CalendarMonthIcon fontSize="small" />
                            </Avatar>
                            <Typography variant="subtitle1" fontWeight="medium" color="white">
                              {t("Immediate Results")}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                            {t("Get your scan results immediately instead of waiting 24-48 hours")}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: "12px",
                            background: "rgba(245, 158, 11, 0.05)",
                            border: "1px solid rgba(245, 158, 11, 0.2)",
                            mt: 1,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <StarIcon sx={{ color: "#f59e0b", mr: 2 }} />
                          <Typography color="rgba(255, 255, 255, 0.9)" variant="body2">
                            {t(
                              "The average patient gets the scan within 24/48 hours. Premium patients get it immediately.",
                            )}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ) : (
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
              {filteredUsers.length === 0 ? (
                <Box
                  sx={{
                    p: 6,
                    textAlign: "center",
                    background: alpha(theme.palette.common.white, 0.02),
                    borderRadius: "16px",
                    border: `1px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
                  }}
                >
                  <MedicalServicesIcon sx={{ fontSize: 64, color: "rgba(255, 255, 255, 0.2)", mb: 2 }} />
                  <Typography color="rgba(255, 255, 255, 0.7)" variant="h6" gutterBottom>
                    {t("No doctors found in the system.")}
                  </Typography>
                  <Typography
                    color="rgba(255, 255, 255, 0.5)"
                    variant="body2"
                    sx={{ maxWidth: 500, mx: "auto", mb: 3 }}
                  >
                    {t("Please try refreshing the page or check back later.")}
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={handleRefresh}
                    sx={{
                      borderColor: "rgba(139, 92, 246, 0.5)",
                      color: "white",
                      "&:hover": {
                        borderColor: "#8b5cf6",
                        background: "rgba(139, 92, 246, 0.1)",
                      },
                    }}
                  >
                    {t("Refresh")}
                  </Button>
                </Box>
              ) : (
                <>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold" color="white" sx={{ mb: 2 }}>
                      {t("Available Medical Professionals")}
                    </Typography>
                    <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />
                  </Box>

                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    {paginatedUsers.map((user) => {
                      const formattedDate = dayjs(user.createdAt).format("DD-MM-YY HH:mm")

                      return (
                        <Grid item xs={12} sm={6} md={4} key={user.id || user._id}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 3,
                              borderRadius: "16px",
                              background: alpha(theme.palette.common.white, 0.02),
                              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                              transition: "transform 0.3s ease, box-shadow 0.3s ease",
                              "&:hover": {
                                transform: "translateY(-5px)",
                                boxShadow: `0 10px 20px ${alpha(theme.palette.common.black, 0.2)}`,
                                borderColor: alpha(theme.palette.primary.main, 0.3),
                              },
                            }}
                          >
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
                              <Avatar
                                sx={{
                                  bgcolor: "rgba(139, 92, 246, 0.1)",
                                  color: "#8b5cf6",
                                  mb: 2,
                                  width: 80,
                                  height: 80,
                                  boxShadow: "0 4px 10px rgba(139, 92, 246, 0.2)",
                                }}
                              >
                                <MedicalServicesIcon sx={{ fontSize: 40 }} />
                              </Avatar>
                              <Typography variant="h6" fontWeight="medium" align="center">
                                {user.name}
                              </Typography>
                              <Typography variant="body2" color="rgba(255, 255, 255, 0.5)" align="center" gutterBottom>
                                {user.specialization || t("General Practitioner")}
                              </Typography>
                              {user.role === "Doctor" && (
                                <Chip
                                  icon={user.isActive ? <DoneIcon /> : <CloseIcon />}
                                  label={user.isActive ? t("Available") : t("Unavailable")}
                                  size="small"
                                  sx={{
                                    fontWeight: "medium",
                                    backgroundColor: user.isActive ? alpha("#10b981", 0.2) : alpha("#ef4444", 0.2),
                                    color: user.isActive ? "#10b981" : "#ef4444",
                                    borderRadius: "8px",
                                    border: `1px solid ${user.isActive ? alpha("#10b981", 0.3) : alpha("#ef4444", 0.3)}`,
                                    mt: 1,
                                  }}
                                />
                              )}
                            </Box>

                            <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", my: 2 }} />

                            <Box sx={{ mt: 2 }}>
                              <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                                <EmailIcon fontSize="small" sx={{ color: "#ec4899", mr: 2, opacity: 0.7 }} />
                                <Typography variant="body2" sx={{ wordBreak: "break-word", flex: 1 }}>
                                  {user.email}
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                                <PhoneIcon fontSize="small" sx={{ color: "#ec4899", mr: 2, opacity: 0.7 }} />
                                <Typography variant="body2" sx={{ flex: 1 }}>
                                  {user.p_phoneNum || user.phoneNum || t("Not provided")}
                                </Typography>
                                {(user.p_phoneNum || user.phoneNum) && (
                                  <Button
                                    size="small"
                                    sx={{
                                      minWidth: "auto",
                                      p: 0.5,
                                      color: "rgba(255, 255, 255, 0.7)",
                                      "&:hover": { color: "#ec4899" },
                                    }}
                                    onClick={() => copyToClipboard(user.p_phoneNum || user.phoneNum)}
                                    title={t("Copy phone number")}
                                  >
                                    <ContentCopyIcon fontSize="small" />
                                  </Button>
                                )}
                              </Box>
                              <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                                <LocationOnIcon fontSize="small" sx={{ color: "#ec4899", mr: 2, opacity: 0.7 }} />
                                <Typography variant="body2" sx={{ flex: 1 }}>
                                  {user.address || t("Address not provided")}
                                </Typography>
                                {user.address && (
                                  <Button
                                    size="small"
                                    sx={{
                                      minWidth: "auto",
                                      p: 0.5,
                                      color: "rgba(255, 255, 255, 0.7)",
                                      "&:hover": { color: "#ec4899" },
                                    }}
                                    onClick={() => copyToClipboard(user.address)}
                                    title={t("Copy address")}
                                  >
                                    <ContentCopyIcon fontSize="small" />
                                  </Button>
                                )}
                              </Box>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <CalendarMonthIcon fontSize="small" sx={{ color: "#ec4899", mr: 2, opacity: 0.7 }} />
                                <Typography variant="body2">{formattedDate}</Typography>
                              </Box>
                            </Box>
                          </Paper>
                        </Grid>
                      )
                    })}
                  </Grid>
                  <TablePagination
                    labelRowsPerPage={t("Rows per page")}
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredUsers.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                      ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
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
        )}
      </Box>
    </Box>
  )
}
