"use client"

import { useState, useRef, useEffect } from "react"
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Grid,
  useMediaQuery,
  useTheme,
  Container,
  InputAdornment,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material"
import { Mail, User, MessageSquare, Phone, MapPin, Send, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useFormik } from "formik"
import * as Yup from "yup"

export default function Contact() {
  const theme = useTheme()
  const navigate = useNavigate()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const { t } = useTranslation()
  const [loaded, setLoaded] = useState(false)
  const canvasRef = useRef(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
  const [submitting, setSubmitting] = useState(false)

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
    const numParticles = 70 // Reduced number of particles
    const connectionDistance = 100 // Reduced connection distance
    const particleColors = ["#6366f1", "#8b5cf6", "#a855f7", "#d946ef"]

    // Initialize particles
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5, // Smaller particles
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        vx: Math.random() * 0.3 - 0.15, // Slower movement
        vy: Math.random() * 0.3 - 0.15, // Slower movement
        pulseSpeed: Math.random() * 0.01 + 0.005, // Slower pulse
        pulseSize: 0,
        pulseDirection: 1,
      })
    }

    // Animation function
    function animate() {
      // Create a gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, "#0f172a")
      gradient.addColorStop(1, "#1e293b")
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
      radialGradient.addColorStop(1, "rgba(15, 23, 42, 0)")
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

  const navigateToLogin = () => {
    navigate("/login")
  }

  const navigateToHome = () => {
    navigate("/home")
  }

  // Form validation schema
  const contactSchema = Yup.object({
    name: Yup.string().required(t("Name is required")),
    email: Yup.string().email(t("Invalid email address")).required(t("Email is required")),
    subject: Yup.string().required(t("Subject is required")),
    message: Yup.string().required(t("Message is required")).min(10, t("Message must be at least 10 characters")),
  })

  // Form handling
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    validationSchema: contactSchema,
    onSubmit: (values) => {
      setSubmitting(true)
      // Simulate API call
      setTimeout(() => {
        console.log("Form submitted:", values)
        setSnackbar({
          open: true,
          message: t("Your message has been sent successfully! We'll get back to you soon."),
          severity: "success",
        })
        formik.resetForm()
        setSubmitting(false)
      }, 1500)
    },
  })

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Beautiful Neural Network Background Canvas */}
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

      {/* Background Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at center, rgba(15, 23, 42, 0) 0%, rgba(15, 23, 42, 0.4) 100%)",
          zIndex: 1,
        }}
      />

      {/* Header */}
      <Box
        component="header"
        sx={{
          position: "relative",
          zIndex: 10,
          padding: { xs: 2, sm: 3 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateX(0)" : "translateX(-20px)",
            transition: "opacity 1s ease, transform 1s ease",
            cursor: "pointer",
          }}
          onClick={navigateToHome}
        >
          <Box
            sx={{
              width: "40px",
              height: "40px",
              position: "relative",
              mr: 2,
            }}
          >
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="eyeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
                <radialGradient id="pupilGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Outer Ring with Animation */}
              <circle cx="50" cy="50" r="48" fill="none" stroke="url(#eyeGradient)" strokeWidth="1" filter="url(#glow)">
                <animate attributeName="r" values="48;46;48" dur="3s" repeatCount="indefinite" />
                <animate attributeName="stroke-width" values="1;2;1" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
              </circle>

              {/* Tech Lines */}
              <path d="M50,2 L50,15" stroke="#ffffff" strokeWidth="1" opacity="0.6">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
              </path>
              <path d="M50,85 L50,98" stroke="#ffffff" strokeWidth="1" opacity="0.6">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
              </path>
              <path d="M2,50 L15,50" stroke="#ffffff" strokeWidth="1" opacity="0.6">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
              </path>
              <path d="M85,50 L98,50" stroke="#ffffff" strokeWidth="1" opacity="0.6">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
              </path>

              {/* Eye White */}
              <ellipse cx="50" cy="50" rx="30" ry="30" fill="rgba(255,255,255,0.9)" filter="url(#glow)" />

              {/* Iris */}
              <circle cx="50" cy="50" r="20" fill="url(#pupilGradient)" filter="url(#glow)">
                <animate attributeName="r" values="20;18;20" dur="3s" repeatCount="indefinite" />
              </circle>

              {/* Pupil */}
              <circle cx="50" cy="50" r="10" fill="#000">
                <animate attributeName="r" values="10;8;10" dur="3s" repeatCount="indefinite" />
              </circle>

              {/* Scanning Line */}
              <line x1="20" y1="50" x2="80" y2="50" stroke="#ffffff" strokeWidth="1" opacity="0.8">
                <animate attributeName="y1" values="40;60;40" dur="2s" repeatCount="indefinite" />
                <animate attributeName="y2" values="40;60;40" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
              </line>

              {/* Highlight */}
              <circle cx="40" cy="40" r="5" fill="white" opacity="0.7" />
            </svg>
          </Box>

          <Typography
            variant="h6"
            sx={{
              color: "#fff",
              fontWeight: 300,
              letterSpacing: "2px",
              textTransform: "uppercase",
              fontSize: { xs: "1rem", sm: "1.25rem" },
              textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
            }}
          >
            <span style={{ fontWeight: 600, color: "#a855f7" }}>Deep</span>Vision Lab
          </Typography>
        </Box>

        {/* Login Button */}
        <Button
          onClick={navigateToLogin}
          variant="contained"
          sx={{
            background: "linear-gradient(to right, #6366f1, #a855f7)",
            color: "white",
            borderRadius: "12px",
            fontWeight: 600,
            padding: "8px 20px",
            textTransform: "none",
            boxShadow: "0 4px 15px rgba(139, 92, 246, 0.3)",
            "&:hover": {
              background: "linear-gradient(to right, #4f46e5, #8b5cf6)",
              boxShadow: "0 6px 20px rgba(139, 92, 246, 0.4)",
              transform: "translateY(-2px)",
            },
            transition: "all 0.3s ease",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(-20px)",
            transitionDelay: "0.2s",
          }}
        >
          {t("Log in")}
          <ChevronRight size={18} style={{ marginLeft: 4 }} />
        </Button>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, py: { xs: 4, md: 8 }, flex: 1 }}>
        <Box
          sx={{
            textAlign: "center",
            mb: 6,
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.5rem", sm: "3.5rem" },
              fontWeight: 700,
              color: "#ffffff",
              mb: 2,
              background: "linear-gradient(to right, #ffffff, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 2px 10px rgba(0,0,0,0.3)",
            }}
          >
            {t("Contact Us")}
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "1.1rem", sm: "1.3rem" },
              fontWeight: 400,
              color: "rgba(255, 255, 255, 0.8)",
              maxWidth: "700px",
              mx: "auto",
            }}
          >
            {t("Have questions or need assistance? We're here to help you with any inquiries about our AI solutions.")}
          </Typography>
        </Box>

        <Grid container spacing={4}>
          
          <Grid
            item
            xs={12}
            size={12}
            sx={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
              transitionDelay: "0.2s",
            }}
          >
            <Card
              sx={{
                borderRadius: "16px",
                background: "rgba(255, 255, 255, 0.03)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 15px 40px rgba(0, 0, 0, 0.3)",
                overflow: "hidden",
                position: "relative",
                border: "1px solid rgba(139, 92, 246, 0.2)",
                height: "100%",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: "linear-gradient(to right, #d946ef, #a855f7, #6366f1)",
                },
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#ffffff",
                    mb: 4,
                    fontWeight: 600,
                  }}
                >
                  {t("Get in touch")}
                </Typography>

                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        background: "rgba(139, 92, 246, 0.1)",
                        mr: 2,
                      }}
                    >
                      <Mail size={24} color="#a855f7" />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)", mb: 0.5 }}>
                        {t("Email")}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#ffffff",
                          fontWeight: 500,
                          "&:hover": {
                            color: "#a855f7",
                          },
                          transition: "color 0.2s ease",
                          cursor: "pointer",
                        }}
                      >
                        contact@deepvisionlab.com
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        background: "rgba(139, 92, 246, 0.1)",
                        mr: 2,
                      }}
                    >
                      <Phone size={24} color="#a855f7" />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)", mb: 0.5 }}>
                        {t("Phone")}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#ffffff",
                          fontWeight: 500,
                          "&:hover": {
                            color: "#a855f7",
                          },
                          transition: "color 0.2s ease",
                          cursor: "pointer",
                        }}
                      >
                        +1 (555) 123-4567
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        background: "rgba(139, 92, 246, 0.1)",
                        mr: 2,
                      }}
                    >
                      <MapPin size={24} color="#a855f7" />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)", mb: 0.5 }}>
                        {t("Address")}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#ffffff",
                          fontWeight: 500,
                        }}
                      >
                        Constantine
                        <br />
                        Smk
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ mt: 6 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#ffffff",
                      mb: 2,
                      fontWeight: 600,
                    }}
                  >
                    {t("Office Hours")}
                  </Typography>

                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                      {t("Monday - Friday")}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#ffffff", fontWeight: 500 }}>
                      9:00 AM - 6:00 PM
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                      {t("Saturday - Sunday")}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#ffffff", fontWeight: 500 }}>
                      {t("Closed")}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    mt: 6,
                    p: 3,
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)",
                    border: "1px solid rgba(139, 92, 246, 0.2)",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#ffffff",
                      fontWeight: 500,
                      fontSize: "1.1rem",
                      mb: 2,
                    }}
                  >
                    {t("Need immediate assistance?")}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)", mb: 3 }}>
                    {t("Our support team is available for urgent inquiries during business hours.")}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

      </Container>

      {/* Snackbar for form submission feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            borderRadius: "12px",
            backdropFilter: "blur(10px)",
            background:
              snackbar.severity === "success"
                ? "rgba(16, 185, 129, 0.9)"
                : snackbar.severity === "error"
                  ? "rgba(239, 68, 68, 0.9)"
                  : "rgba(139, 92, 246, 0.9)",
            color: "#ffffff",
            "& .MuiAlert-icon": {
              color: "#ffffff",
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
