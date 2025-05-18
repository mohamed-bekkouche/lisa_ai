"use client"

import { useEffect, useState, useRef } from "react"
import {
  Typography,
  Box,
  Select,
  IconButton,
  Fab,
  InputAdornment,
  Table,
  TableContainer,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  MenuItem,
  FormControl,
  Chip,
  Divider,
  Avatar,
  Button,
  useTheme,
  Tooltip,
  Grid,
  TablePagination,
  Card,
  CardContent,
  Badge,
  TextField,
  InputLabel,
} from "@mui/material"

import StarIcon from "@mui/icons-material/Star"
import DoneIcon from "@mui/icons-material/Done"
import CloseIcon from "@mui/icons-material/Close"
import AddIcon from "@mui/icons-material/Add"
import PersonIcon from "@mui/icons-material/Person"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import FilterAltIcon from "@mui/icons-material/FilterAlt"
import RefreshIcon from "@mui/icons-material/Refresh"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import SearchIcon from "@mui/icons-material/Search"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import EventAvailableIcon from "@mui/icons-material/EventAvailable"
import EventBusyIcon from "@mui/icons-material/EventBusy"
import PendingIcon from "@mui/icons-material/Pending"
import TuneIcon from "@mui/icons-material/Tune"
import {
  AsyncGetAppointments,
  AsyncGetPatientAppointments,
  AsyncDeleteAppointment,
  AsyncAdminApproveAppointment,
  AsyncAdminRefuseAppointment,
} from "./AppointmentSlice"
import { AsyncGetUsers } from "../User/UserSlice"
import { useDispatch, useSelector } from "react-redux"

import AppointmentEditDialog from "./Dialogs/AppointmentEditDialog"
import dayjs from "dayjs"

import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

export default function Appointment() {
  const theme = useTheme()
  const dispatch = useDispatch()
  const [loaded, setLoaded] = useState(false)
  const canvasRef = useRef(null)

  const { isPatientPremium } = useSelector((state) => state.payment)
  const { role, name } = useSelector((state) => state.login)
  const { appointments } = useSelector((state) => state.appointment)
  const { users } = useSelector((state) => state.user)
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [model, setModel] = useState(null)
  const [isEditDialogModeUpdate, setEditDialogModeUpdate] = useState(false)
  const [filterValue, setFilterValue] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  const { t } = useTranslation()

  const [filteredAppointments, setFilteredAppointments] = useState(appointments)

  const navigate = useNavigate()

  // Pagination state
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Beautiful background animation
  useEffect(() => {
    setLoaded(true)

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
    const particleColors = ["#4c1d95", "#5b21b6", "#7e22ce", "#8b5cf6", "#6d28d9", "#4338ca"]

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

  const handleFilter = (value) => {
    setFilterValue(value)
    applyFilters(value, searchQuery)
    // Reset to first page when filtering
    setPage(0)
  }

  const handleSearch = (event) => {
    const query = event.target.value
    setSearchQuery(query)
    applyFilters(filterValue, query)
    // Reset to first page when searching
    setPage(0)
  }

  const applyFilters = (status, query) => {
    let filtered = [...appointments]

    // Apply status filter
    if (status !== "All") {
      filtered = filtered.filter((item) => item.status === status)
    }

    // Apply search filter if query exists
    if (query) {
      const lowerQuery = query.toLowerCase()
      filtered = filtered.filter((appointment) => {
        // Find user name for this appointment
        let userName = name
        if (role === "Admin") {
          const user = users.find((user) => user._id === appointment.patientID)
          userName = user?.name || "Unknown User"
        }

        // Search by name or date
        return (
          userName.toLowerCase().includes(lowerQuery) ||
          dayjs(appointment.date).format("DD-MM-YY HH:mm").includes(lowerQuery)
        )
      })
    }

    setFilteredAppointments(filtered)
  }

  const handleRefresh = () => {
    if (role === "Patient") {
      dispatch(AsyncGetPatientAppointments())
    } else {
      dispatch(AsyncGetAppointments())
    }
  }

  useEffect(() => {
    setFilteredAppointments(appointments)
  }, [appointments])

  const handleDeleteAppointment = (id) => {
    dispatch(AsyncDeleteAppointment(id))
    // Rafraîchir les données après suppression
    setTimeout(() => {
      handleRefresh()
    }, 500)
  }

  const handleOpenUpdateDialog = () => {
    setDeleteDialogOpen(true)
    setEditDialogModeUpdate(true)
  }

  const handleOpenDialog = () => {
    setDeleteDialogOpen(true)
    setEditDialogModeUpdate(false)
  }

  const handleCloseDeleteDialog = (result) => {
    setDeleteDialogOpen(false)
    // Rafraîchir les données après fermeture du dialogue
    handleRefresh()
  }

  const handleAdminRefuseAppointment = (id) => {
    dispatch(AsyncAdminRefuseAppointment(id))
    // Rafraîchir les données après refus
    setTimeout(() => {
      handleRefresh()
    }, 500)
  }

  const handleAdminApproveAppointment = (id) => {
    dispatch(AsyncAdminApproveAppointment(id))
    // Rafraîchir les données après approbation
    setTimeout(() => {
      handleRefresh()
    }, 500)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  useEffect(() => {
    if (role === "Patient") {
      dispatch(AsyncGetPatientAppointments())
    } else if (role === "Admin") {
      dispatch(AsyncGetUsers())
      dispatch(AsyncGetAppointments())
    } else {
      dispatch(AsyncGetAppointments())
    }
  }, [dispatch, role])

  // Apply pagination
  const paginatedAppointments = filteredAppointments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  // Get status chip color
  const getStatusChipProps = (status) => {
    switch (status) {
      case "Approved":
        return { color: "#10b981", icon: <DoneIcon fontSize="small" />, bgColor: "rgba(16, 185, 129, 0.1)" }
      case "Pending":
        return { color: "#a855f7", icon: <PendingIcon fontSize="small" />, bgColor: "rgba(168, 85, 247, 0.1)" }
      case "Refused":
        return { color: "#ef4444", icon: <CloseIcon fontSize="small" />, bgColor: "rgba(239, 68, 68, 0.1)" }
      case "Cancelled":
        return { color: "#6b7280", icon: <EventBusyIcon fontSize="small" />, bgColor: "rgba(107, 114, 128, 0.1)" }
      default:
        return { color: "#a855f7", icon: <CalendarMonthIcon fontSize="small" />, bgColor: "rgba(168, 85, 247, 0.1)" }
    }
  }

  // Count appointments by status
  const appointmentCounts  = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === "Pending").length,
    approved: appointments.filter((a) => a.status === "Approved").length,
    refused: appointments.filter((a) => a.status === "Refused").length,
    cancelled: appointments.filter((a) => a.status === "Cancelled").length,
  }

  // Get upcoming appointments (next 7 days)
  const upcomingAppointments = appointments
    .filter(
      (a) => a.status === "Approved" && dayjs(a.date).isAfter(dayjs()) && dayjs(a.date).isBefore(dayjs().add(7, "day")),
    )
    .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf())
    .slice(0, 3)

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
            {t("Appointment Management")}
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
            {role === "Patient" && (
              <Button
                onClick={handleOpenDialog}
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  background: "linear-gradient(45deg, #8b5cf6, #ec4899)",
                  color: "white",
                  borderRadius: "12px",
                  py: 1,
                  px: 3,
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
                {t("New appointment")}
              </Button>
            )}
          </Box>
        </Box>

        {/* Premium Feature Alert for Patients */}
        {!isPatientPremium && role === "Patient" && (
          <Card
            sx={{
              borderRadius: "24px",
              background: "rgba(255, 255, 255, 0.03)",
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
                background: "linear-gradient(to right, #8b5cf6, #ec4899, #f59e0b)",
              },
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(45deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))",
                    border: "1px solid rgba(236, 72, 153, 0.3)",
                  }}
                >
                  <StarIcon sx={{ color: "#ec4899", fontSize: 32 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" fontWeight="bold" color="white" gutterBottom>
                    {t("Premium Feature")}
                  </Typography>
                  <Typography variant="body1" color="rgba(255, 255, 255, 0.7)" sx={{ mb: 2 }}>
                    {t("Upgrade to premium to unlock appointment scheduling and get priority access to doctors.")}
                  </Typography>
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
                      boxShadow: "0 4px 15px rgba(236, 72, 153, 0.4)",
                      "&:hover": {
                        background: "linear-gradient(45deg, #7c3aed, #db2777)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 20px rgba(236, 72, 153, 0.5)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    {t("Upgrade to Premium")}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Dashboard Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Total Appointments */}
          <Grid item xs={12} sm={6} lg={3}>
            <Card
              sx={{
                borderRadius: "24px",
                background: "rgba(15, 23, 42, 0.6)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 15px 40px rgba(0, 0, 0, 0.5)",
                overflow: "hidden",
                position: "relative",
                border: "1px solid rgba(139, 92, 246, 0.2)",
                height: "100%",
                opacity: loaded ? 1 : 0,
                transform: loaded ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
                transitionDelay: "0.2s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: "linear-gradient(to right, #6366f1, #8b5cf6)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(139, 92, 246, 0.1)",
                      mr: 2,
                    }}
                  >
                    <CalendarMonthIcon sx={{ color: "#8b5cf6" }} />
                  </Box>
                  <Typography variant="h6" fontWeight="medium" color="white">
                    {t("Total")}
                  </Typography>
                </Box>
                <Typography variant="h3" fontWeight="bold" color="white" sx={{ mb: 1 }}>
                  {appointmentCounts.total}
                </Typography>
                <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">
                  {t("All Appointments")}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Pending Appointments */}
          <Grid item xs={12} sm={6} lg={3}>
            <Card
              sx={{
                borderRadius: "24px",
                background: "rgba(15, 23, 42, 0.6)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 15px 40px rgba(0, 0, 0, 0.5)",
                overflow: "hidden",
                position: "relative",
                border: "1px solid rgba(168, 85, 247, 0.2)",
                height: "100%",
                opacity: loaded ? 1 : 0,
                transform: loaded ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
                transitionDelay: "0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: "linear-gradient(to right, #8b5cf6, #a855f7)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(168, 85, 247, 0.1)",
                      mr: 2,
                    }}
                  >
                    <PendingIcon sx={{ color: "#a855f7" }} />
                  </Box>
                  <Typography variant="h6" fontWeight="medium" color="white">
                    {t("Pending")}
                  </Typography>
                </Box>
                <Typography variant="h3" fontWeight="bold" color="white" sx={{ mb: 1 }}>
                  {appointmentCounts.pending}
                </Typography>
                <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">
                  {t("Awaiting approval")}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Approved Appointments */}
          <Grid item xs={12} sm={6} lg={3}>
            <Card
              sx={{
                borderRadius: "24px",
                background: "rgba(15, 23, 42, 0.6)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 15px 40px rgba(0, 0, 0, 0.5)",
                overflow: "hidden",
                position: "relative",
                border: "1px solid rgba(217, 70, 239, 0.2)",
                height: "100%",
                opacity: loaded ? 1 : 0,
                transform: loaded ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
                transitionDelay: "0.4s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: "linear-gradient(to right, #a855f7, #d946ef)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(217, 70, 239, 0.1)",
                      mr: 2,
                    }}
                  >
                    <DoneIcon sx={{ color: "#d946ef" }} />
                  </Box>
                  <Typography variant="h6" fontWeight="medium" color="white">
                    {t("Approved")}
                  </Typography>
                </Box>
                <Typography variant="h3" fontWeight="bold" color="white" sx={{ mb: 1 }}>
                  {appointmentCounts.approved}
                </Typography>
                <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">
                  {t("Confirmed appointments")}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Refused/Cancelled Appointments */}
          <Grid item xs={12} sm={6} lg={3}>
            <Card
              sx={{
                borderRadius: "24px",
                background: "rgba(15, 23, 42, 0.6)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 15px 40px rgba(0, 0, 0, 0.5)",
                overflow: "hidden",
                position: "relative",
                border: "1px solid rgba(236, 72, 153, 0.2)",
                height: "100%",
                opacity: loaded ? 1 : 0,
                transform: loaded ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
                transitionDelay: "0.5s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: "linear-gradient(to right, #d946ef, #ec4899)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(236, 72, 153, 0.1)",
                      mr: 2,
                    }}
                  >
                    <CloseIcon sx={{ color: "#ec4899" }} />
                  </Box>
                  <Typography variant="h6" fontWeight="medium" color="white">
                    {t("Refused/Cancelled")}
                  </Typography>
                </Box>
                <Typography variant="h3" fontWeight="bold" color="white" sx={{ mb: 1 }}>
                  {appointmentCounts.refused + appointmentCounts.cancelled}
                </Typography>
                <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">
                  {t("Unavailable appointments")}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Filter Bar */}
        <Card
          sx={{
            borderRadius: "24px",
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 15px 40px rgba(0, 0, 0, 0.3)",
            overflow: "hidden",
            position: "relative",
            border: "1px solid rgba(139, 92, 246, 0.2)",
            mb: 4,
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            transitionDelay: "0.6s",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder={t("Search appointments...")}
                  value={searchQuery}
                  onChange={handleSearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "rgba(255, 255, 255, 0.5)" }} />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: "16px",
                      background: "rgba(255, 255, 255, 0.05)",
                      color: "white",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(139, 92, 246, 0.2)",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(139, 92, 246, 0.4)",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#a855f7",
                      },
                      "& input": {
                        color: "white",
                      },
                      height: 56,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="appointment-filter-label" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                    {t("Status")}
                  </InputLabel>
                  <Select
                    labelId="appointment-filter-label"
                    value={filterValue}
                    label={t("Status")}
                    onChange={(e) => handleFilter(e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <FilterAltIcon fontSize="small" sx={{ color: "rgba(255, 255, 255, 0.5)" }} />
                      </InputAdornment>
                    }
                    sx={{
                      borderRadius: "16px",
                      background: "rgba(255, 255, 255, 0.05)",
                      color: "white",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(139, 92, 246, 0.2)",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(139, 92, 246, 0.4)",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#a855f7",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "rgba(255, 255, 255, 0.7)",
                      },
                      height: 56,
                    }}
                  >
                    <MenuItem value="All">{t("All Appointments")}</MenuItem>
                    <MenuItem value="Pending">{t("Pending")}</MenuItem>
                    <MenuItem value="Cancelled">{t("Cancelled")}</MenuItem>
                    <MenuItem value="Approved">{t("Approved")}</MenuItem>
                    <MenuItem value="Refused">{t("Refused")}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<TuneIcon />}
                  sx={{
                    background: "linear-gradient(45deg, #8b5cf6, #ec4899)",
                    color: "white",
                    borderRadius: "16px",
                    height: 56,
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
                  {t("Filter")}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Main Appointments Table */}
        <Card
          sx={{
            borderRadius: "24px",
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 15px 40px rgba(0, 0, 0, 0.3)",
            overflow: "hidden",
            position: "relative",
            border: "1px solid rgba(139, 92, 246, 0.2)",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            transitionDelay: "0.7s",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "linear-gradient(to right, #6366f1, #a855f7, #ec4899)",
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" color="white">
                {t("Appointments")}
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Tooltip title={t("Refresh appointments")}>
                  <IconButton
                    onClick={handleRefresh}
                    sx={{
                      color: "white",
                      background: "rgba(139, 92, 246, 0.1)",
                      borderRadius: "12px",
                      "&:hover": {
                        background: "rgba(139, 92, 246, 0.2)",
                      },
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
                {role === "Patient" && (
                  <Button
                    onClick={handleOpenDialog}
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{
                      background: "linear-gradient(45deg, #8b5cf6, #ec4899)",
                      color: "white",
                      borderRadius: "12px",
                      py: 1,
                      px: 3,
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
                    {t("New appointment")}
                  </Button>
                )}
              </Box>
            </Box>

            {filteredAppointments.length === 0 ? (
              <Box
                sx={{
                  p: 6,
                  textAlign: "center",
                  background: "rgba(255, 255, 255, 0.02)",
                  borderRadius: "16px",
                  border: "1px dashed rgba(139, 92, 246, 0.2)",
                }}
              >
                <CalendarMonthIcon sx={{ fontSize: 64, color: "rgba(255, 255, 255, 0.2)", mb: 2 }} />
                <Typography color="rgba(255, 255, 255, 0.7)" variant="h6" gutterBottom>
                  {filterValue === "All"
                    ? t("You don't have any appointments yet.")
                    : t(`You don't have any ${filterValue.toLowerCase()} appointments.`)}
                </Typography>
                {role === "Patient" && (
                  <Button
                    onClick={handleOpenDialog}
                    variant="outlined"
                    startIcon={<AddIcon />}
                    sx={{
                      mt: 3,
                      borderColor: "rgba(236, 72, 153, 0.4)",
                      color: "#ec4899",
                      borderRadius: "12px",
                      py: 1.5,
                      px: 4,
                      "&:hover": {
                        borderColor: "#ec4899",
                        background: "rgba(236, 72, 153, 0.1)",
                      },
                    }}
                  >
                    {t("Schedule your first appointment")}
                  </Button>
                )}
              </Box>
            ) : (
              <>
                <TableContainer
                  sx={{
                    borderRadius: "16px",
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid rgba(139, 92, 246, 0.1)",
                    mb: 2,
                    "&::-webkit-scrollbar": {
                      width: "8px",
                      height: "8px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "rgba(139, 92, 246, 0.2)",
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
                            borderBottom: "1px solid rgba(139, 92, 246, 0.1)",
                            fontSize: "0.9rem",
                          }}
                        >
                          {t("Patient")}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            fontWeight: "bold",
                            borderBottom: "1px solid rgba(139, 92, 246, 0.1)",
                            fontSize: "0.9rem",
                          }}
                        >
                          {t("Date & Time")}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            fontWeight: "bold",
                            borderBottom: "1px solid rgba(139, 92, 246, 0.1)",
                            fontSize: "0.9rem",
                          }}
                        >
                          {t("Status")}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            fontWeight: "bold",
                            borderBottom: "1px solid rgba(139, 92, 246, 0.1)",
                            fontSize: "0.9rem",
                          }}
                        >
                          {t("Actions")}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedAppointments.map((appointment) => {
                        const formattedDate = dayjs(appointment.date).format("DD-MM-YY HH:mm")
                        let user
                        if (role === "Admin") {
                          const users_list = users.filter((element) => element._id === appointment.patientID)
                          user = users_list.length === 1 ? users_list[0] : null
                        } else {
                          user = { name, role }
                        }

                        const { color, icon, bgColor } = getStatusChipProps(appointment.status)

                        return (
                          <TableRow
                            key={appointment._id}
                            hover
                            sx={{
                              transition: "background-color 0.3s ease",
                              "&:hover": {
                                backgroundColor: "rgba(139, 92, 246, 0.05)",
                              },
                              "& td": {
                                borderBottom: "1px solid rgba(139, 92, 246, 0.1)",
                                color: "white",
                                py: 2,
                              },
                            }}
                          >
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Avatar
                                  sx={{
                                    bgcolor: "rgba(236, 72, 153, 0.1)",
                                    color: "#ec4899",
                                    mr: 2,
                                  }}
                                >
                                  <PersonIcon />
                                </Avatar>
                                <Box>
                                  <Typography variant="body2" fontWeight="medium" color="white">
                                    {user?.name || t("Unknown User")}
                                  </Typography>
                                  <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">
                                    {user?.role || ""}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <AccessTimeIcon fontSize="small" sx={{ color: "#ec4899", mr: 1, opacity: 0.7 }} />
                                <Typography color="white">{formattedDate}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                icon={icon}
                                label={t(appointment.status)}
                                size="small"
                                sx={{
                                  fontWeight: "medium",
                                  color: color,
                                  backgroundColor: bgColor,
                                  borderRadius: "10px",
                                  border: `1px solid ${color}20`,
                                  px: 1,
                                }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                                {role === "Admin" && appointment.status === "Pending" && (
                                  <>
                                    <Tooltip title={t("Approve")}>
                                      <IconButton
                                        onClick={() => handleAdminApproveAppointment(appointment._id)}
                                        size="small"
                                        sx={{
                                          color: "#d946ef",
                                          backgroundColor: "rgba(217, 70, 239, 0.1)",
                                          mr: 1,
                                          borderRadius: "10px",
                                          transition: "all 0.2s ease",
                                          "&:hover": {
                                            transform: "scale(1.1)",
                                            backgroundColor: "rgba(217, 70, 239, 0.2)",
                                          },
                                        }}
                                      >
                                        <DoneIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title={t("Refuse")}>
                                      <IconButton
                                        onClick={() => handleAdminRefuseAppointment(appointment._id)}
                                        size="small"
                                        sx={{
                                          color: "#ec4899",
                                          backgroundColor: "rgba(236, 72, 153, 0.1)",
                                          mr: 1,
                                          borderRadius: "10px",
                                          transition: "all 0.2s ease",
                                          "&:hover": {
                                            transform: "scale(1.1)",
                                            backgroundColor: "rgba(236, 72, 153, 0.2)",
                                          },
                                        }}
                                      >
                                        <CloseIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </>
                                )}
                                {appointment.status !== "Refused" &&
                                  appointment.status !== "Approved" &&
                                  appointment.status !== "Cancelled" && (
                                    <Tooltip title={t("Delete")}>
                                      <IconButton
                                        onClick={() => {
                                          handleDeleteAppointment(appointment._id)
                                        }}
                                        size="small"
                                        sx={{
                                          color: "#ec4899",
                                          backgroundColor: "rgba(236, 72, 153, 0.1)",
                                          mr: 1,
                                          borderRadius: "10px",
                                          transition: "all 0.2s ease",
                                          "&:hover": {
                                            transform: "scale(1.1)",
                                            backgroundColor: "rgba(236, 72, 153, 0.2)",
                                          },
                                        }}
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                {appointment.status !== "Refused" && appointment.status !== "Approved" && (
                                  <Tooltip title={t("Edit")}>
                                    <IconButton
                                      onClick={() => {
                                        handleOpenUpdateDialog()
                                        setModel(appointment)
                                      }}
                                      size="small"
                                      sx={{
                                        color: "#a855f7",
                                        backgroundColor: "rgba(168, 85, 247, 0.1)",
                                        borderRadius: "10px",
                                        transition: "all 0.2s ease",
                                        "&:hover": {
                                          transform: "scale(1.1)",
                                          backgroundColor: "rgba(168, 85, 247, 0.2)",
                                        },
                                      }}
                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </Box>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  labelRowsPerPage={t("Rows per page")}
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredAppointments.length}
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

        {/* Upcoming Appointments Section */}
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              color: "white",
              fontWeight: 700,
              mb: 3,
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.5s ease, transform 0.5s ease",
              transitionDelay: "0.8s",
            }}
          >
            {t("Upcoming Appointments")}
          </Typography>
          <Grid container spacing={3}>
            {upcomingAppointments.length === 0 ? (
              <Grid item xs={12}>
                <Card
                  sx={{
                    borderRadius: "24px",
                    background: "rgba(255, 255, 255, 0.03)",
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 15px 40px rgba(0, 0, 0, 0.3)",
                    overflow: "hidden",
                    position: "relative",
                    border: "1px solid rgba(139, 92, 246, 0.2)",
                    p: 4,
                    textAlign: "center",
                    opacity: loaded ? 1 : 0,
                    transform: loaded ? "translateY(0)" : "translateY(20px)",
                    transition: "opacity 0.5s ease, transform 0.5s ease",
                    transitionDelay: "0.9s",
                  }}
                >
                  <EventAvailableIcon sx={{ fontSize: 48, color: "rgba(255, 255, 255, 0.2)", mb: 2 }} />
                  <Typography color="rgba(255, 255, 255, 0.7)" variant="h6">
                    {t("No upcoming appointments in the next 7 days")}
                  </Typography>
                </Card>
              </Grid>
            ) : (
              upcomingAppointments.map((appointment, index) => (
                <Grid item xs={12} md={4} key={appointment._id}>
                  <Card
                    sx={{
                      borderRadius: "24px",
                      background: "rgba(255, 255, 255, 0.03)",
                      backdropFilter: "blur(20px)",
                      boxShadow: "0 15px 40px rgba(0, 0, 0, 0.3)",
                      overflow: "hidden",
                      position: "relative",
                      border: "1px solid rgba(139, 92, 246, 0.2)",
                      height: "100%",
                      opacity: loaded ? 1 : 0,
                      transform: loaded ? "translateY(0)" : "translateY(20px)",
                      transition: "opacity 0.5s ease, transform 0.5s ease",
                      transitionDelay: `${0.9 + index * 0.1}s`,
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
                      },
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "4px",
                        background: "linear-gradient(to right, #a855f7, #ec4899)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Badge
                          color="success"
                          variant="dot"
                          sx={{
                            "& .MuiBadge-badge": {
                              backgroundColor: "#d946ef",
                            },
                          }}
                        >
                          <EventAvailableIcon sx={{ color: "#d946ef", mr: 1 }} />
                        </Badge>
                        <Typography variant="subtitle1" fontWeight="bold" color="white">
                          {dayjs(appointment.date).format("dddd, MMMM D")}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", ml: 4, mb: 2 }}>
                        <AccessTimeIcon sx={{ fontSize: 16, color: "#ec4899", mr: 1 }} />
                        <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                          {dayjs(appointment.date).format("h:mm A")}
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 2, borderColor: "rgba(139, 92, 246, 0.1)" }} />
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: "rgba(236, 72, 153, 0.1)",
                            color: "#ec4899",
                            mr: 1.5,
                            fontSize: 16,
                          }}
                        >
                          <PersonIcon fontSize="inherit" />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium" color="white">
                            {role === "Admin"
                              ? users.find((user) => user._id === appointment.patientID)?.name || t("Unknown User")
                              : name}
                          </Typography>
                          <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">
                            {t("Patient")}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Box>
      </Box>

      {/* Floating Action Button for SuperAdmin */}
      {role === "SuperAdmin" && (
        <Fab
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: "linear-gradient(45deg, #8b5cf6, #ec4899)",
            color: "white",
            boxShadow: "0 4px 20px rgba(236, 72, 153, 0.5)",
            transition: "all 0.2s ease",
            width: 64,
            height: 64,
            "&:hover": {
              transform: "translateY(-4px) scale(1.05)",
              boxShadow: "0 8px 25px rgba(236, 72, 153, 0.6)",
              background: "linear-gradient(45deg, #7c3aed, #db2777)",
            },
          }}
          aria-label="add"
          onClick={handleOpenDialog}
        >
          <AddIcon sx={{ fontSize: 28 }} />
        </Fab>
      )}

      {/* Appointment Edit Dialog */}
      {isDeleteDialogOpen && (
        <AppointmentEditDialog
          isUpdate={isEditDialogModeUpdate}
          model={model}
          open={isDeleteDialogOpen}
          handleClose={handleCloseDeleteDialog}
        />
      )}
    </Box>
  )
}
















/*"use client";

import { useEffect, useState } from "react";
import {
  Typography,
  InputLabel,
  Container,
  Box,
  Select,
  IconButton,
  Fab,
  InputAdornment,
  Paper,
  Table,
  TableContainer,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  MenuItem,
  FormControl,
  Chip,
  Divider,
  Avatar,
  Button,
  useTheme,
  alpha,
  Tooltip,
  Alert,
  Grid,
  TablePagination,
} from "@mui/material";

import StarIcon from "@mui/icons-material/Star";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import {
  AsyncGetAppointments,
  AsyncGetPatientAppointments,
  AsyncDeleteAppointment,
  AsyncAdminApproveAppointment,
  AsyncAdminRefuseAppointment,
} from "./AppointmentSlice";
import { AsyncGetUsers } from "../User/UserSlice";
import { useDispatch, useSelector } from "react-redux";

import AppointmentEditDialog from "./Dialogs/AppointmentEditDialog";
import dayjs from "dayjs";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function Appointment() {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { isPatientPremium } = useSelector((state) => state.payment);
  const { role, name } = useSelector((state) => state.login);
  const { appointments } = useSelector((state) => state.appointment);
  const { users } = useSelector((state) => state.user);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [model, setModel] = useState(null);
  const [isEditDialogModeUpdate, setEditDialogModeUpdate] = useState(false);
  const [filterValue, setFilterValue] = useState("All");

  const { t } = useTranslation();

  const [filteredAppointments, setFilteredAppointments] =
    useState(appointments);

  const navigate = useNavigate();

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleFilter = (value) => {
    setFilterValue(value);
    if (value !== "All") {
      const data = appointments.filter((item) => item?.status === value);
      setFilteredAppointments(data);
    } else {
      setFilteredAppointments(appointments);
    }
    // Reset to first page when filtering
    setPage(0);
  };

  const handleRefresh = () => {
    if (role === "Patient") {
      dispatch(AsyncGetPatientAppointments());
    } else {
      dispatch(AsyncGetAppointments());
    }
  };

  useEffect(() => {
    setFilteredAppointments(appointments);
  }, [appointments]);

  const handleDeleteAppointment = (id) => {
    dispatch(AsyncDeleteAppointment(id));
  };

  const handleOpenUpdateDialog = () => {
    setDeleteDialogOpen(true);
    setEditDialogModeUpdate(true);
  };

  const handleOpenDialog = () => {
    setDeleteDialogOpen(true);
    setEditDialogModeUpdate(false);
  };

  const handleCloseDeleteDialog = (result) => {
    setDeleteDialogOpen(false);
  };

  const handleAdminRefuseAppointment = (id) => {
    dispatch(AsyncAdminRefuseAppointment(id));
  };

  const handleAdminApproveAppointment = (id) => {
    dispatch(AsyncAdminApproveAppointment(id));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    if (role === "Patient") {
      dispatch(AsyncGetPatientAppointments());
    } else if (role === "Admin") {
      dispatch(AsyncGetUsers());
      dispatch(AsyncGetAppointments());
    } else {
      dispatch(AsyncGetAppointments());
    }
  }, [dispatch, role]);

  // Apply pagination
  const paginatedAppointments = filteredAppointments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Get status chip color
  const getStatusChipProps = (status) => {
    switch (status) {
      case "Approved":
        return { color: "success", icon: <DoneIcon fontSize="small" /> };
      case "Pending":
        return {
          color: "inherit",
          icon: <CalendarMonthIcon fontSize="small" />,
        };
      case "Refused":
        return { color: "error", icon: <CloseIcon fontSize="small" /> };
      case "Cancelled":
        return { color: "default", icon: <CloseIcon fontSize="small" /> };
      default:
        return {
          color: "primary",
          icon: <CalendarMonthIcon fontSize="small" />,
        };
    }
  };

  return (
    <Container maxWidth="lg">
      {role === "SuperAdmin" && (
        <Fab
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            boxShadow: "0 4px 14px 0 rgba(0,118,255,0.39)",
            transition: "all 0.2s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 6px 20px rgba(0,118,255,0.39)",
            },
          }}
          color="primary"
          aria-label="add"
          onClick={handleOpenDialog}
        >
          <AddIcon />
        </Fab>
      )}
      {!isPatientPremium && role === "Patient" && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mt: 3,
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: "blur(8px)",
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {t("Premium Feature")}
          </Typography>
          <Button
            variant="contained"
            color="warning"
            startIcon={<StarIcon />}
            onClick={() => {
              navigate("/subscription");
            }}
            sx={{
              mt: 2,
              borderRadius: "8px",
              boxShadow: "0 4px 14px 0 rgba(255,152,0,0.39)",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(255,152,0,0.39)",
              },
            }}
          >
            {t("Upgrade to Premium")}
          </Button>
        </Paper>
      )}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mt: 3,
          borderRadius: 2,
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: "blur(8px)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="700"
              color="primary.main"
              sx={{
                position: "relative",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  width: "40%",
                  height: "4px",
                  bottom: "-8px",
                  left: 0,
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: "2px",
                },
              }}
            >
              {t("Appointments")}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Tooltip title={t("Refresh appointments")}>
              <IconButton onClick={handleRefresh} color="primary">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            {role === "Patient" && (
              <Button
                onClick={handleOpenDialog}
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  borderRadius: "8px",
                  boxShadow: "0 4px 14px 0 rgba(0,118,255,0.39)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(0,118,255,0.39)",
                  },
                }}
              >
                {t("New appointment")}
              </Button>
            )}
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="appointment-filter-label">
                {t("Status")}
              </InputLabel>
              <Select
                labelId="appointment-filter-label"
                value={filterValue}
                label={t("Status")}
                onChange={(e) => handleFilter(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterAltIcon fontSize="small" />
                  </InputAdornment>
                }
                sx={{
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                <MenuItem value="All">{t("All Appointments")}</MenuItem>
                <MenuItem value="Pending">{t("Pending")}</MenuItem>
                <MenuItem value="Cancelled">{t("Cancelled")}</MenuItem>
                <MenuItem value="Approved">{t("Approved")}</MenuItem>
                <MenuItem value="Refused">{t("Refused")}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {filteredAppointments.length === 0 ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            {filterValue === "All"
              ? t("You don't have any appointments yet.")
              : t(
                  `You don't have any ${filterValue.toLowerCase()} appointments.`
                )}
          </Alert>
        ) : (
          <>
            <TableContainer
              component={Paper}
              elevation={2}
              sx={{ borderRadius: 2, mb: 2, overflow: "hidden" }}
            >
              <Table sx={{ minWidth: 650 }}>
                <TableHead
                  sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  }}
                >
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {t("Patient")}
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {t("Date & Time")}
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {t("Status")}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      {t("Actions")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedAppointments.map((appointment) => {
                    const formattedDate = dayjs(appointment?.date).format(
                      "DD-MM-YY HH:mm"
                    );
                    let user;
                    if (role === "Admin") {
                      const users_list = users.filter(
                        (element) => element?._id === appointment.patientID
                      );
                      user = users_list.length === 1 ? users_list[0] : null;
                    } else {
                      user = { name, role };
                    }

                    const { color, icon } = getStatusChipProps(
                      appointment?.status
                    );

                    return (
                      <TableRow
                        key={appointment?._id}
                        hover
                        sx={{
                          transition: "background-color 0.3s ease",
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar
                              sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                                mr: 2,
                              }}
                            >
                              <PersonIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {user?.name || t("Unknown User")}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {user?.role || ""}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <CalendarMonthIcon
                              fontSize="small"
                              sx={{
                                color: theme.palette.primary.main,
                                mr: 1,
                                opacity: 0.7,
                              }}
                            />
                            {formattedDate}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={icon}
                            label={t(appointment?.status)}
                            color={color}
                            size="small"
                            sx={{ fontWeight: "medium" }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Box
                            sx={{ display: "flex", justifyContent: "flex-end" }}
                          >
                            {role === "Admin" &&
                              appointment?.status === "Pending" && (
                                <>
                                  <Tooltip title={t("Approve")}>
                                    <IconButton
                                      onClick={() =>
                                        handleAdminApproveAppointment(
                                          appointment?._id
                                        )
                                      }
                                      size="small"
                                      color="success"
                                      sx={{
                                        transition: "transform 0.2s ease",
                                        "&:hover": {
                                          transform: "scale(1.1)",
                                        },
                                      }}
                                    >
                                      <DoneIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title={t("Refuse")}>
                                    <IconButton
                                      onClick={() =>
                                        handleAdminRefuseAppointment(
                                          appointment?._id
                                        )
                                      }
                                      size="small"
                                      color="error"
                                      sx={{
                                        transition: "transform 0.2s ease",
                                        "&:hover": {
                                          transform: "scale(1.1)",
                                        },
                                      }}
                                    >
                                      <CloseIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              )}
                            {appointment?.status !== "Refused" &&
                              appointment?.status !== "Approved" &&
                              appointment?.status !== "Cancelled" && (
                                <Tooltip title={t("Delete")}>
                                  <IconButton
                                    onClick={() => {
                                      handleDeleteAppointment(appointment?._id);
                                    }}
                                    size="small"
                                    color="error"
                                    sx={{
                                      transition: "transform 0.2s ease",
                                      "&:hover": {
                                        transform: "scale(1.1)",
                                      },
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            {appointment?.status !== "Refused" &&
                              appointment?.status !== "Approved" && (
                                <Tooltip title={t("Edit")}>
                                  <IconButton
                                    onClick={() => {
                                      handleOpenUpdateDialog();
                                      setModel(appointment);
                                    }}
                                    size="small"
                                    color="primary"
                                    sx={{
                                      transition: "transform 0.2s ease",
                                      "&:hover": {
                                        transform: "scale(1.1)",
                                      },
                                    }}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
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
              count={filteredAppointments.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                  {
                    margin: 0,
                  },
              }}
            />
          </>
        )}
      </Paper>
      {isDeleteDialogOpen && (
        <AppointmentEditDialog
          isUpdate={isEditDialogModeUpdate}
          model={model}
          open={isDeleteDialogOpen}
          handleClose={handleCloseDeleteDialog}
        />
      )}
    </Container>
  );
}*/