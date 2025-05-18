"use client"
import {
  Avatar,
  Box,
  Container,
  Grid,
  List,
  ListItem,
  Typography,
  useTheme,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material"
import { Email, LocationOn, Phone, Cake, ContentCopy } from "@mui/icons-material"
import GradeIcon from "@mui/icons-material/Grade"
import AccessTimeIcon from "@mui/icons-material/AccessTime"

// Après les imports existants, ajoutez ces nouveaux imports
import StarIcon from "@mui/icons-material/Star"

import { useSelector } from "react-redux"
import { useTranslation } from "react-i18next"
import dayjs from "dayjs"
import { useEffect, useRef, useState } from "react"

export default function Profile() {
  const { t } = useTranslation()
  const theme = useTheme()
  const [loaded, setLoaded] = useState(false)
  const canvasRef = useRef(null)

  const avatarUrl = "/placeholder.svg?height=150&width=150"

  const { role, name, email, phoneNum, avatar, address, createdAt, specialization, schedule } = useSelector(
    (state) => state.login,
  )

  // Add this line after the existing useSelector statement to get the premium status
  const { isPatientPremium } = useSelector((state) => state.payment)

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  // Dans le composant Profile, ajoutez ces états pour les toggles

  // Ajoutez ces données fictives pour l'exemple

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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
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

      {/* Background Overlay */}
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
      <Container
        maxWidth="lg"
        sx={{
          mt: 4,
          mb: 4,
          pt: { xs: 10, sm: 12 },
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Profile Header Card */}
        <Card
          sx={{
            mb: 4,
            borderRadius: "16px",
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 15px 40px rgba(0, 0, 0, 0.3)",
            overflow: "hidden",
            position: "relative",
            border: "1px solid rgba(236, 72, 153, 0.2)",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: "linear-gradient(to right, #8b5cf6, #ec4899)",
            },
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          <Box
            sx={{
              height: "120px",
              width: "100%",
              background: "linear-gradient(135deg, rgba(139, 92, 246, 0.8) 0%, rgba(236, 72, 153, 0.8) 100%)",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 0,
            }}
          />

          <Box sx={{ p: 3, pb: 4, position: "relative", zIndex: 1, pt: { xs: 16, sm: 3 } }}>
            <Avatar
              src={avatarUrl}
              sx={{
                width: { xs: 100, sm: 140 },
                height: { xs: 100, sm: 140 },
                border: "4px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                position: { xs: "absolute", sm: "absolute" },
                top: { xs: "-50px", sm: "40px" },
                left: { xs: "calc(50% - 50px)", sm: "40px" },
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 12px 28px rgba(0,0,0,0.25)",
                },
              }}
            />

            <Box
              sx={{
                ml: { xs: 0, sm: 22 },
                mt: { xs: 0, sm: 0 },
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: { xs: "center", sm: "space-between" },
                alignItems: { xs: "center", sm: "flex-start" },
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  fontWeight="bold"
                  color="white"
                  sx={{
                    textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                    background: "linear-gradient(to right, #ffffff, #ec4899)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {name}
                </Typography>
                <Chip
                  label={role}
                  sx={{
                    mt: 1,
                    mb: 2,
                    fontWeight: "medium",
                    backgroundColor: "rgba(236, 72, 153, 0.15)",
                    color: "white",
                    borderRadius: "8px",
                    backdropFilter: "blur(4px)",
                    border: "1px solid rgba(236, 72, 153, 0.2)",
                    "& .MuiChip-label": {
                      px: 2,
                    },
                  }}
                />
                {role === "Patient" && (
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    {isPatientPremium ? (
                      <Chip
                        icon={<StarIcon />}
                        label={t("Premium Member")}
                        sx={{
                          fontWeight: "medium",
                          backgroundColor: "rgba(245, 158, 11, 0.2)",
                          color: "#f59e0b",
                          borderRadius: "8px",
                          backdropFilter: "blur(4px)",
                          border: "1px solid rgba(245, 158, 11, 0.3)",
                          "& .MuiChip-label": {
                            px: 2,
                          },
                          "& .MuiChip-icon": {
                            color: "#f59e0b",
                          },
                        }}
                      />
                    ) : (
                      <Chip
                        label={t("Regular Member")}
                        sx={{
                          fontWeight: "medium",
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          color: "rgba(255, 255, 255, 0.8)",
                          borderRadius: "8px",
                          backdropFilter: "blur(4px)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          "& .MuiChip-label": {
                            px: 2,
                          },
                        }}
                      />
                    )}
                  </Box>
                )}
                <Box sx={{ display: "flex", alignItems: "center", mb: 1, color: "rgba(255, 255, 255, 0.9)", mt: 2 }}>
                  <LocationOn sx={{ color: "#ec4899", fontSize: "1rem", mr: 1 }} />
                  <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.9)" }}>
                    {address}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Card>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: "16px",
                background: "rgba(15, 23, 42, 0.6)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 15px 40px rgba(0, 0, 0, 0.3)",
                overflow: "hidden",
                position: "relative",
                border: "1px solid rgba(236, 72, 153, 0.2)",
                height: "100%",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
                },
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
                  height: "3px",
                  background: "linear-gradient(to right, #8b5cf6, #ec4899)",
                },
              }}
            >
              <Box
                sx={{
                  p: 2,
                  borderBottom: "1px solid rgba(236, 72, 153, 0.2)",
                  background: "rgba(139, 92, 246, 0.1)",
                }}
              >
                <Typography variant="h6" fontWeight="bold" color="white">
                  {t("Contact Information")}
                </Typography>
              </Box>
              <CardContent sx={{ p: 0 }}>
                <List>
                  <ListItem
                    sx={{
                      py: 2,
                      px: 3,
                      borderBottom: "1px solid rgba(236, 72, 153, 0.1)",
                      "&:hover": {
                        background: "rgba(236, 72, 153, 0.05)",
                      },
                    }}
                  >
                    <Email sx={{ color: "#ec4899", mr: 2 }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" color="rgba(255, 255, 255, 0.6)" fontSize="0.75rem">
                        {t("Email")}
                      </Typography>
                      <Typography variant="body1" color="white">
                        {email}
                      </Typography>
                    </Box>
                    <Tooltip title={t("Copy Email")}>
                      <IconButton size="small" onClick={() => copyToClipboard(email)} sx={{ color: "#ec4899" }}>
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </ListItem>

                  <ListItem
                    sx={{
                      py: 2,
                      px: 3,
                      borderBottom: "1px solid rgba(236, 72, 153, 0.1)",
                      "&:hover": {
                        background: "rgba(236, 72, 153, 0.05)",
                      },
                    }}
                  >
                    <Phone sx={{ color: "#ec4899", mr: 2 }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" color="rgba(255, 255, 255, 0.6)" fontSize="0.75rem">
                        {t("Phone")}
                      </Typography>
                      <Typography variant="body1" color="white">
                        {phoneNum}
                      </Typography>
                    </Box>
                    <Tooltip title={t("Copy Phone")}>
                      <IconButton size="small" onClick={() => copyToClipboard(phoneNum)} sx={{ color: "#ec4899" }}>
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </ListItem>

                  <ListItem
                    sx={{
                      py: 2,
                      px: 3,
                      "&:hover": {
                        background: "rgba(236, 72, 153, 0.05)",
                      },
                    }}
                  >
                    <Cake sx={{ color: "#ec4899", mr: 2 }} />
                    <Box>
                      <Typography variant="body2" color="rgba(255, 255, 255, 0.6)" fontSize="0.75rem">
                        {t("Member since")}
                      </Typography>
                      <Typography variant="body1" color="white">
                        {dayjs(createdAt).format("DD-MM-YYYY")}
                      </Typography>
                    </Box>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {(specialization || schedule) && (
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  borderRadius: "16px",
                  background: "rgba(15, 23, 42, 0.6)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 15px 40px rgba(0, 0, 0, 0.3)",
                  overflow: "hidden",
                  position: "relative",
                  border: "1px solid rgba(236, 72, 153, 0.2)",
                  height: "100%",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
                  },
                  opacity: loaded ? 1 : 0,
                  transform: "translateY(0)",
                  transition: "opacity 0.5s ease, transform 0.5s ease",
                  transitionDelay: "0.2s",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: "linear-gradient(to right, #ec4899, #8b5cf6)",
                  },
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderBottom: "1px solid rgba(236, 72, 153, 0.2)",
                    background: "rgba(139, 92, 246, 0.1)",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" color="white">
                    {t("Professional Details")}
                  </Typography>
                </Box>
                <CardContent sx={{ p: 0 }}>
                  <List>
                    {specialization && (
                      <ListItem
                        sx={{
                          py: 2,
                          px: 3,
                          borderBottom: specialization && schedule ? "1px solid rgba(236, 72, 153, 0.1)" : "none",
                          "&:hover": {
                            background: "rgba(236, 72, 153, 0.05)",
                          },
                        }}
                      >
                        <GradeIcon sx={{ color: "#ec4899", mr: 2 }} />
                        <Box>
                          <Typography variant="body2" color="rgba(255, 255, 255, 0.6)" fontSize="0.75rem">
                            {t("Specialization")}
                          </Typography>
                          <Typography variant="body1" color="white">
                            {specialization}
                          </Typography>
                        </Box>
                      </ListItem>
                    )}

                    {schedule && (
                      <ListItem
                        sx={{
                          py: 2,
                          px: 3,
                          "&:hover": {
                            background: "rgba(236, 72, 153, 0.05)",
                          },
                        }}
                      >
                        <AccessTimeIcon sx={{ color: "#ec4899", mr: 2 }} />
                        <Box>
                          <Typography variant="body2" color="rgba(255, 255, 255, 0.6)" fontSize="0.75rem">
                            {t("Schedule")}
                          </Typography>
                          <Typography variant="body1" color="white">
                            {schedule}
                          </Typography>
                        </Box>
                      </ListItem>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  )
}
