"use client"

import { useState, useRef, useEffect } from "react"
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  InputAdornment,
  useMediaQuery,
  useTheme,
  Divider,
} from "@mui/material"
import { Lock, KeyRound, ShieldCheck } from "lucide-react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { AsyncResetPassword } from "./LoginSlice"
import { useTranslation } from "react-i18next"

function handleError(schema, name) {
  if (schema.touched[name] && schema.errors[name]) {
    return schema.errors[name]
  }
  return null
}

export default function ResetPassword() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const navigate = useNavigate()
  const { token } = useParams()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [loaded, setLoaded] = useState(false)
  const canvasRef = useRef(null)

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
    const numParticles = 100
    const connectionDistance = 150
    const particleColors = ["#6366f1", "#8b5cf6", "#a855f7", "#d946ef"]

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

  const handleOnSuccess = () => {
    navigate("/login")
  }

  const schema = useFormik({
    initialValues: { password: "" },
    validationSchema: Yup.object({
      password: Yup.string().required("Required."),
    }),
    onSubmit: (values) => {
      dispatch(AsyncResetPassword(token, values.password, handleOnSuccess))
    },
  })

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "center",
        alignItems: "center",
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

      {/* Logo in Top Left */}
      <Box
        sx={{
          position: "absolute",
          top: 20,
          left: 20,
          display: "flex",
          alignItems: "center",
          zIndex: 10,
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateX(0)" : "translateX(-20px)",
          transition: "opacity 1s ease, transform 1s ease",
        }}
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

      {/* Main Content Container */}
      <Box
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: "450px",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 2,
          px: { xs: 2, sm: 4 },
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
          transitionDelay: "0.2s",
        }}
      >
        <Card
          sx={{
            width: "100%",
            borderRadius: "16px",
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 15px 40px rgba(0, 0, 0, 0.3)",
            overflow: "hidden",
            position: "relative",
            border: "1px solid rgba(139, 92, 246, 0.2)",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: "linear-gradient(to right, #6366f1, #a855f7, #d946ef)",
            },
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            {/* Shield Icon */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  background: "rgba(139, 92, 246, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                  boxShadow: "0 0 20px rgba(139, 92, 246, 0.2)",
                }}
              >
                <ShieldCheck size={32} color="#a855f7" />
              </Box>
            </Box>

            <Typography
              variant="h5"
              sx={{
                mb: 1,
                textAlign: "center",
                color: "#ffffff",
                fontWeight: 600,
              }}
            >
              {t("Reset Your Password")}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mb: 4,
                textAlign: "center",
                color: "rgba(255, 255, 255, 0.7)",
              }}
            >
              {t("Enter your new password below to complete the password reset process.")}
            </Typography>

            <Box component="form" onSubmit={schema.handleSubmit}>
              <Box sx={{ mb: 4 }}>
                <TextField
                  error={!!handleError(schema, "password")}
                  id="password"
                  name="password"
                  type="password"
                  placeholder={t("New Password")}
                  value={schema.values.password}
                  onChange={schema.handleChange}
                  onBlur={schema.handleBlur}
                  helperText={handleError(schema, "password")}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={18} color="#a855f7" />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: 2,
                      height: 54,
                      color: "#ffffff",
                      "&:focus-within": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#a855f7",
                          borderWidth: 2,
                        },
                      },
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(139, 92, 246, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(139, 92, 246, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#a855f7",
                      },
                      "& input": {
                        color: "#ffffff",
                      },
                    },
                    "& .MuiFormHelperText-root": {
                      color: "#ff5252",
                    },
                  }}
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  py: 1.5,
                  background: "linear-gradient(to right, #6366f1, #a855f7, #d946ef)",
                  color: "white",
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textTransform: "none",
                  boxShadow: "0 4px 15px rgba(139, 92, 246, 0.3)",
                  "&:hover": {
                    background: "linear-gradient(to right, #4f46e5, #8b5cf6, #c026d3)",
                    boxShadow: "0 6px 20px rgba(139, 92, 246, 0.4)",
                  },
                }}
              >
                <Box component="span" sx={{ mr: 1 }}>
                  {t("Reset Password")}
                </Box>
                <KeyRound size={18} />
              </Button>

              <Divider sx={{ my: 3, borderColor: "rgba(139, 92, 246, 0.2)" }} />

              <Typography align="center" sx={{ fontSize: "0.875rem", color: "rgba(255, 255, 255, 0.7)" }}>
                {t("Remember your password?")}
                <Button
                  onClick={() => {
                    navigate("/login")
                  }}
                  sx={{
                    color: "#a855f7",
                    textDecoration: "none",
                    fontWeight: 500,
                    "&:hover": {
                      textDecoration: "underline",
                      backgroundColor: "rgba(139, 92, 246, 0.1)",
                    },
                  }}
                >
                  {t("Log in")}
                </Button>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
