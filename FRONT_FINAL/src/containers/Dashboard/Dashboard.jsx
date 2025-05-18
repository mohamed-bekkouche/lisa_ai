"use client"

import React from "react"

import {
  Box,
  Typography,
  Grid,
  Button,
  useTheme,
  Divider,
  Avatar,
  IconButton,
  Tooltip,
  Chip,
  Card,
  CardContent,
} from "@mui/material"
import PersonIcon from "@mui/icons-material/Person"
import NotificationsIcon from "@mui/icons-material/Notifications"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import UploadFileIcon from "@mui/icons-material/UploadFile"
import RefreshIcon from "@mui/icons-material/Refresh"
import PendingIcon from "@mui/icons-material/Pending"
import CloseIcon from "@mui/icons-material/Close"
import DoneIcon from "@mui/icons-material/Done"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState, useRef } from "react"
import { AsyncGetAppointments } from "../Appointment/AppointmentSlice"
import { AsyncGetUsers } from "../User/UserSlice"
import { AsyncGetNotifications } from "../Notification/NotificationSlice"
import ScanUploadDialog from "./Dialogs/ScanUploadDialog"
import { useTranslation } from "react-i18next"
import dayjs from "dayjs"

export default function Dashboard() {
  const dispatch = useDispatch()
  const theme = useTheme()
  const canvasRef = useRef(null)

  const { users } = useSelector((state) => state.user)
  const { notifications } = useSelector((state) => state.notification)
  const { appointments } = useSelector((state) => state.appointment)

  const [scanDialogOpen, setScanDialogOpen] = useState(false)
  const { t } = useTranslation()
  const [loaded, setLoaded] = useState(false)

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

  useEffect(() => {
    dispatch(AsyncGetAppointments())
    dispatch(AsyncGetUsers())
    dispatch(AsyncGetNotifications())
  }, [dispatch])

  const handleRefresh = () => {
    dispatch(AsyncGetAppointments())
    dispatch(AsyncGetUsers())
    dispatch(AsyncGetNotifications())
  }

  // Get recent appointments (next 7 days)
  const recentAppointments = appointments
    .filter((a) => dayjs(a.date).isAfter(dayjs().subtract(7, "day")))
    .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())
    .slice(0, 5)

  // Get recent users
  const recentUsers = [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)

  // Get recent notifications
  const recentNotifications = [...notifications]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  // Card styles with gradients
  const cardStyles = [
    {
      icon: <PersonIcon />,
      title: t("Users"),
      count: users.length,
      gradient: "linear-gradient(to right, #6366f1, #8b5cf6)",
      color: "#8b5cf6",
      bgColor: "rgba(139, 92, 246, 0.1)",
    },
    {
      icon: <NotificationsIcon />,
      title: t("Notifications"),
      count: notifications.length,
      gradient: "linear-gradient(to right, #8b5cf6, #a855f7)",
      color: "#a855f7",
      bgColor: "rgba(168, 85, 247, 0.1)",
    },
    {
      icon: <CalendarMonthIcon />,
      title: t("Appointments"),
      count: appointments.length,
      gradient: "linear-gradient(to right, #a855f7, #d946ef)",
      color: "#d946ef",
      bgColor: "rgba(217, 70, 239, 0.1)",
    },
  ]

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
            {t("Dashboard")}
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
            <Button
              onClick={() => setScanDialogOpen(true)}
              variant="contained"
              startIcon={<UploadFileIcon />}
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
              {t("Upload scan")}
            </Button>
          </Box>
        </Box>

        {/* Dashboard Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {cardStyles.map((card, index) => (
            <Grid item xs={12} sm={6} lg={4} key={index}>
              <Card
                sx={{
                  borderRadius: "24px",
                  background: "rgba(15, 23, 42, 0.6)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 15px 40px rgba(0, 0, 0, 0.5)",
                  overflow: "hidden",
                  position: "relative",
                  border: `1px solid ${card.color}20`,
                  height: "100%",
                  opacity: loaded ? 1 : 0,
                  transform: loaded ? "translateY(0)" : "translateY(20px)",
                  transition: "opacity 0.5s ease, transform 0.5s ease",
                  transitionDelay: `${0.2 + index * 0.1}s`,
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
                    background: card.gradient,
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
                        background: card.bgColor,
                        mr: 2,
                      }}
                    >
                      {React.cloneElement(card.icon, { sx: { color: card.color } })}
                    </Box>
                    <Typography variant="h6" fontWeight="medium" color="white">
                      {t(card.title)}
                    </Typography>
                  </Box>
                  <Typography variant="h3" fontWeight="bold" color="white" sx={{ mb: 1 }}>
                    {card.count}
                  </Typography>
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">
                    {t(`Total ${card.title.toLowerCase()}`)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Recent Activity Section */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Recent Appointments */}
          <Grid item xs={12} md={6}>
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
                transitionDelay: "0.4s",
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
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      sx={{
                        bgcolor: "rgba(217, 70, 239, 0.1)",
                        color: "#d946ef",
                        mr: 2,
                      }}
                    >
                      <CalendarMonthIcon />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold" color="white">
                      {t("Recent Appointments")}
                    </Typography>
                  </Box>
                  <Tooltip title={t("View all appointments")}>
                    <IconButton
                      size="small"
                      sx={{
                        color: "white",
                        background: "rgba(217, 70, 239, 0.1)",
                        borderRadius: "12px",
                        "&:hover": {
                          background: "rgba(217, 70, 239, 0.2)",
                          transform: "scale(1.05)",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      <CalendarMonthIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Divider sx={{ mb: 3, borderColor: "rgba(139, 92, 246, 0.1)" }} />

                {recentAppointments.length === 0 ? (
                  <Box
                    sx={{
                      p: 4,
                      textAlign: "center",
                      background: "rgba(255, 255, 255, 0.02)",
                      borderRadius: "12px",
                      border: "1px dashed rgba(139, 92, 246, 0.2)",
                    }}
                  >
                    <CalendarMonthIcon sx={{ fontSize: 48, color: "rgba(255, 255, 255, 0.2)", mb: 2 }} />
                    <Typography color="rgba(255, 255, 255, 0.7)" variant="body1">
                      {t("No recent appointments")}
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    {recentAppointments.map((appointment, index) => {
                      const statusProps = {
                        Approved: {
                          color: "#10b981",
                          icon: <DoneIcon fontSize="small" />,
                          bgColor: "rgba(16, 185, 129, 0.1)",
                        },
                        Pending: {
                          color: "#a855f7",
                          icon: <PendingIcon fontSize="small" />,
                          bgColor: "rgba(168, 85, 247, 0.1)",
                        },
                        Refused: {
                          color: "#ef4444",
                          icon: <CloseIcon fontSize="small" />,
                          bgColor: "rgba(239, 68, 68, 0.1)",
                        },
                        Cancelled: {
                          color: "#6b7280",
                          icon: <CloseIcon fontSize="small" />,
                          bgColor: "rgba(107, 114, 128, 0.1)",
                        },
                      }[appointment.status] || {
                        color: "#a855f7",
                        icon: <CalendarMonthIcon fontSize="small" />,
                        bgColor: "rgba(168, 85, 247, 0.1)",
                      }

                      return (
                        <Box
                          key={appointment._id}
                          sx={{
                            p: 2,
                            mb: index < recentAppointments.length - 1 ? 2 : 0,
                            borderRadius: "12px",
                            background: "rgba(255, 255, 255, 0.02)",
                            border: "1px solid rgba(139, 92, 246, 0.2)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "translateY(-2px)",
                              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
                              background: "rgba(255, 255, 255, 0.03)",
                            },
                          }}
                        >
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Avatar
                                sx={{
                                  bgcolor: statusProps.bgColor,
                                  color: statusProps.color,
                                  width: 40,
                                  height: 40,
                                  mr: 2,
                                }}
                              >
                                {statusProps.icon}
                              </Avatar>
                              <Box>
                                <Typography variant="body1" fontWeight="medium" color="white">
                                  {dayjs(appointment.date).format("DD MMM YYYY, HH:mm")}
                                </Typography>
                                <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">
                                  {appointment.status === "Approved"
                                    ? t("Approved")
                                    : appointment.status === "Pending"
                                      ? t("Pending")
                                      : t("Refused")}
                                </Typography>
                              </Box>
                            </Box>
                            <Chip
                              label={appointment.status}
                              size="small"
                              sx={{
                                fontWeight: "medium",
                                bgcolor: statusProps.bgColor,
                                color: statusProps.color,
                                borderRadius: "8px",
                              }}
                            />
                          </Box>
                        </Box>
                      )
                    })}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Users */}
          <Grid item xs={12} md={6}>
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
                transitionDelay: "0.5s",
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
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
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
                    <Typography variant="h6" fontWeight="bold" color="white">
                      {t("Recent Users")}
                    </Typography>
                  </Box>
                  <Tooltip title={t("View all users")}>
                    <IconButton
                      size="small"
                      sx={{
                        color: "white",
                        background: "rgba(236, 72, 153, 0.1)",
                        borderRadius: "12px",
                        "&:hover": {
                          background: "rgba(236, 72, 153, 0.2)",
                          transform: "scale(1.05)",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      <PersonIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Divider sx={{ mb: 3, borderColor: "rgba(139, 92, 246, 0.1)" }} />

                {recentUsers.length === 0 ? (
                  <Box
                    sx={{
                      p: 4,
                      textAlign: "center",
                      background: "rgba(255, 255, 255, 0.02)",
                      borderRadius: "12px",
                      border: "1px dashed rgba(139, 92, 246, 0.2)",
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 48, color: "rgba(255, 255, 255, 0.2)", mb: 2 }} />
                    <Typography color="rgba(255, 255, 255, 0.7)" variant="body1">
                      {t("No recent users")}
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    {recentUsers.map((user, index) => (
                      <Box
                        key={user._id}
                        sx={{
                          p: 2,
                          mb: index < recentUsers.length - 1 ? 2 : 0,
                          borderRadius: "12px",
                          background: "rgba(255, 255, 255, 0.02)",
                          border: "1px solid rgba(139, 92, 246, 0.2)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
                            background: "rgba(255, 255, 255, 0.03)",
                          },
                        }}
                      >
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar
                              sx={{
                                bgcolor: "rgba(236, 72, 153, 0.1)",
                                color: "#ec4899",
                                width: 40,
                                height: 40,
                                mr: 2,
                              }}
                            >
                              <PersonIcon fontSize="small" />
                            </Avatar>
                            <Box>
                              <Typography variant="body1" fontWeight="medium" color="white">
                                {user.name}
                              </Typography>
                              <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">
                                {user.role}
                              </Typography>
                            </Box>
                          </Box>
                          <Chip
                            label={user.role}
                            size="small"
                            sx={{
                              fontWeight: "medium",
                              bgcolor:
                                user.role === "Admin"
                                  ? "rgba(139, 92, 246, 0.1)"
                                  : user.role === "Doctor"
                                    ? "rgba(168, 85, 247, 0.1)"
                                    : "rgba(236, 72, 153, 0.1)",
                              color: user.role === "Admin" ? "#8b5cf6" : user.role === "Doctor" ? "#a855f7" : "#ec4899",
                              borderRadius: "8px",
                            }}
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Notifications */}
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
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: "rgba(168, 85, 247, 0.1)",
                    color: "#a855f7",
                    mr: 2,
                  }}
                >
                  <NotificationsIcon />
                </Avatar>
                <Typography variant="h6" fontWeight="bold" color="white">
                  {t("Recent Notifications")}
                </Typography>
              </Box>
              <Tooltip title={t("View all notifications")}>
                <IconButton
                  size="small"
                  sx={{
                    color: "white",
                    background: "rgba(168, 85, 247, 0.1)",
                    borderRadius: "12px",
                    "&:hover": {
                      background: "rgba(168, 85, 247, 0.2)",
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <NotificationsIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            <Divider sx={{ mb: 3, borderColor: "rgba(139, 92, 246, 0.1)" }} />

            {recentNotifications.length === 0 ? (
              <Box
                sx={{
                  p: 4,
                  textAlign: "center",
                  background: "rgba(255, 255, 255, 0.02)",
                  borderRadius: "12px",
                  border: "1px dashed rgba(139, 92, 246, 0.2)",
                }}
              >
                <NotificationsIcon sx={{ fontSize: 48, color: "rgba(255, 255, 255, 0.2)", mb: 2 }} />
                <Typography color="rgba(255, 255, 255, 0.7)" variant="body1">
                  {t("No recent notifications")}
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {recentNotifications.map((notification) => (
                  <Grid item xs={12} sm={6} md={4} lg={2.4} key={notification._id}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: "12px",
                        background: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(139, 92, 246, 0.2)",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
                          background: "rgba(255, 255, 255, 0.03)",
                        },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: notification.read ? "rgba(139, 92, 246, 0.1)" : "rgba(236, 72, 153, 0.1)",
                            color: notification.read ? "#8b5cf6" : "#ec4899",
                            mr: 1.5,
                          }}
                        >
                          <NotificationsIcon fontSize="small" />
                        </Avatar>
                        <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">
                          {dayjs(notification.createdAt).fromNow()}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        color="white"
                        sx={{
                          fontWeight: notification.read ? "normal" : "medium",
                          mb: 1,
                          flexGrow: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {notification.content}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Scan Upload Dialog */}
      <ScanUploadDialog
        list={users.filter((user) => user.role === "Patient")}
        open={scanDialogOpen}
        handleClose={() => setScanDialogOpen(false)}
      />
    </Box>
  )
}
