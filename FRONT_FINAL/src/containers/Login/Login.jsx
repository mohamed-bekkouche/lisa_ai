"use client"

import { useState, useRef, useEffect } from "react"
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Select,
  MenuItem,
  InputAdornment,
  useMediaQuery,
  useTheme,
  Divider,
} from "@mui/material"
import { Mail, Lock, ChevronRight } from "lucide-react"
import { Toaster } from "react-hot-toast"
import { useFormik } from "formik"
import * as Yup from "yup"
import { login } from "./LoginSlice"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

function handleError(schema, name) {
  if (schema.touched[name] && schema.errors[name]) {
    return schema.errors[name]
  }
  return null
}

export default function Login() {
  const theme = useTheme()
  const navigate = useNavigate()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const { t, i18n } = useTranslation()
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

  const handleChangeLanguage = (lng) => {
    i18n.changeLanguage(lng)
  }

  const dispatch = useDispatch()

  const handleSwitchToSignUp = () => {
    //dispatch(configLoginMode("signup")) to remove
    navigate("/signup")
  }

  const schema = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().required(t("Required.")),
      password: Yup.string().required(t("Required.")),
    }),
    onSubmit: (values) => {
      dispatch(login(values.email, values.password))
    },
  })
  const navigateToHome = () => {
    navigate("/home")
  }

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

      {/* Main Content Container - Split Layout */}
      <Box
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: "1200px",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "center",
          alignItems: "center",
          zIndex: 2,
          gap: { xs: 4, md: 0 },
          px: { xs: 2, sm: 4 },
        }}
      >
        {/* Left Side - Image */}
        <Box
          sx={{
            flex: { xs: "1 1 100%", md: "1 1 50%" },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            height: { xs: "auto", md: "100%" },
            maxHeight: { xs: "300px", md: "none" },
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          {/* Decorative Elements */}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: "500px",
              height: { xs: "250px", sm: "350px", md: "450px" },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Circular Glow */}
            <Box
              sx={{
                position: "absolute",
                width: "300px",
                height: "300px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, rgba(15, 23, 42, 0) 70%)",
                animation: "pulse 4s infinite ease-in-out",
                "@keyframes pulse": {
                  "0%": { transform: "scale(0.95)", opacity: 0.5 },
                  "50%": { transform: "scale(1.05)", opacity: 0.8 },
                  "100%": { transform: "scale(0.95)", opacity: 0.5 },
                },
              }}
            />

            {/* Rotating Rings */}
            <Box
              sx={{
                position: "absolute",
                width: "280px",
                height: "280px",
                borderRadius: "50%",
                border: "1px solid rgba(139, 92, 246, 0.3)",
                animation: "rotate 20s infinite linear",
                "@keyframes rotate": {
                  "0%": { transform: "rotate(0deg)" },
                  "100%": { transform: "rotate(360deg)" },
                },
              }}
            />

            <Box
              sx={{
                position: "absolute",
                width: "320px",
                height: "320px",
                borderRadius: "50%",
                border: "1px dashed rgba(139, 92, 246, 0.2)",
                animation: "rotate 30s infinite linear reverse",
              }}
            />

            <Box
              sx={{
                position: "absolute",
                width: "360px",
                height: "360px",
                borderRadius: "50%",
                border: "1px solid rgba(139, 92, 246, 0.1)",
                animation: "rotate 40s infinite linear",
              }}
            />

            {/* Brain Visualization */}
            <Box
              sx={{
                position: "relative",
                width: "200px",
                height: "200px",
                opacity: 0.9,
                filter: "drop-shadow(0 0 20px rgba(139, 92, 246, 0.5))",
              }}
            >
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                  <filter id="brainGlow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Brain Outline */}
                <path
                  d="M100,20 C130,20 150,40 150,70 C150,85 140,95 140,110 C140,125 150,135 150,150 C150,180 130,190 100,190 C70,190 50,180 50,150 C50,135 60,125 60,110 C60,95 50,85 50,70 C50,40 70,20 100,20 Z"
                  fill="none"
                  stroke="url(#brainGradient)"
                  strokeWidth="1.5"
                  filter="url(#brainGlow)"
                >
                  <animate attributeName="stroke-dasharray" values="0,1000;1000,0" dur="3s" begin="0s" fill="freeze" />
                </path>

                {/* Brain Hemisphere Divider */}
                <path
                  d="M100,20 L100,190"
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                />

                {/* Neural Connections - Left Hemisphere */}
                <g>
                  <circle cx="70" cy="50" r="3" fill="#a855f7">
                    <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" begin="0s" />
                  </circle>
                  <circle cx="60" cy="80" r="2" fill="#a855f7">
                    <animate
                      attributeName="opacity"
                      values="0.3;1;0.3"
                      dur="2s"
                      repeatCount="indefinite"
                      begin="0.2s"
                    />
                  </circle>
                  <circle cx="75" cy="110" r="3" fill="#a855f7">
                    <animate
                      attributeName="opacity"
                      values="0.3;1;0.3"
                      dur="2s"
                      repeatCount="indefinite"
                      begin="0.4s"
                    />
                  </circle>
                  <circle cx="65" cy="140" r="2" fill="#a855f7">
                    <animate
                      attributeName="opacity"
                      values="0.3;1;0.3"
                      dur="2s"
                      repeatCount="indefinite"
                      begin="0.6s"
                    />
                  </circle>
                  <circle cx="80" cy="170" r="3" fill="#a855f7">
                    <animate
                      attributeName="opacity"
                      values="0.3;1;0.3"
                      dur="2s"
                      repeatCount="indefinite"
                      begin="0.8s"
                    />
                  </circle>

                  <line x1="70" y1="50" x2="60" y2="80" stroke="#a855f7" strokeWidth="0.5">
                    <animate
                      attributeName="opacity"
                      values="0.1;0.5;0.1"
                      dur="1s"
                      repeatCount="indefinite"
                      begin="0.1s"
                    />
                  </line>
                  <line x1="60" y1="80" x2="75" y2="110" stroke="#a855f7" strokeWidth="0.5">
                    <animate
                      attributeName="opacity"
                      values="0.1;0.5;0.1"
                      dur="1s"
                      repeatCount="indefinite"
                      begin="0.3s"
                    />
                  </line>
                  <line x1="75" y1="110" x2="65" y2="140" stroke="#a855f7" strokeWidth="0.5">
                    <animate
                      attributeName="opacity"
                      values="0.1;0.5;0.1"
                      dur="1s"
                      repeatCount="indefinite"
                      begin="0.5s"
                    />
                  </line>
                  <line x1="65" y1="140" x2="80" y2="170" stroke="#a855f7" strokeWidth="0.5">
                    <animate
                      attributeName="opacity"
                      values="0.1;0.5;0.1"
                      dur="1s"
                      repeatCount="indefinite"
                      begin="0.7s"
                    />
                  </line>
                </g>

                {/* Neural Connections - Right Hemisphere */}
                <g>
                  <circle cx="130" cy="50" r="3" fill="#6366f1">
                    <animate
                      attributeName="opacity"
                      values="0.3;1;0.3"
                      dur="2s"
                      repeatCount="indefinite"
                      begin="0.1s"
                    />
                  </circle>
                  <circle cx="140" cy="80" r="2" fill="#6366f1">
                    <animate
                      attributeName="opacity"
                      values="0.3;1;0.3"
                      dur="2s"
                      repeatCount="indefinite"
                      begin="0.3s"
                    />
                  </circle>
                  <circle cx="125" cy="110" r="3" fill="#6366f1">
                    <animate
                      attributeName="opacity"
                      values="0.3;1;0.3"
                      dur="2s"
                      repeatCount="indefinite"
                      begin="0.5s"
                    />
                  </circle>
                  <circle cx="135" cy="140" r="2" fill="#6366f1">
                    <animate
                      attributeName="opacity"
                      values="0.3;1;0.3"
                      dur="2s"
                      repeatCount="indefinite"
                      begin="0.7s"
                    />
                  </circle>
                  <circle cx="120" cy="170" r="3" fill="#6366f1">
                    <animate
                      attributeName="opacity"
                      values="0.3;1;0.3"
                      dur="2s"
                      repeatCount="indefinite"
                      begin="0.9s"
                    />
                  </circle>

                  <line x1="130" y1="50" x2="140" y2="80" stroke="#6366f1" strokeWidth="0.5">
                    <animate
                      attributeName="opacity"
                      values="0.1;0.5;0.1"
                      dur="1s"
                      repeatCount="indefinite"
                      begin="0.2s"
                    />
                  </line>
                  <line x1="140" y1="80" x2="125" y2="110" stroke="#6366f1" strokeWidth="0.5">
                    <animate
                      attributeName="opacity"
                      values="0.1;0.5;0.1"
                      dur="1s"
                      repeatCount="indefinite"
                      begin="0.4s"
                    />
                  </line>
                  <line x1="125" y1="110" x2="135" y2="140" stroke="#6366f1" strokeWidth="0.5">
                    <animate
                      attributeName="opacity"
                      values="0.1;0.5;0.1"
                      dur="1s"
                      repeatCount="indefinite"
                      begin="0.6s"
                    />
                  </line>
                  <line x1="135" y1="140" x2="120" y2="170" stroke="#6366f1" strokeWidth="0.5">
                    <animate
                      attributeName="opacity"
                      values="0.1;0.5;0.1"
                      dur="1s"
                      repeatCount="indefinite"
                      begin="0.8s"
                    />
                  </line>
                </g>

                {/* Cross-hemisphere connections */}
                <line
                  x1="70"
                  y1="50"
                  x2="130"
                  y2="50"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                >
                  <animate attributeName="opacity" values="0.1;0.3;0.1" dur="3s" repeatCount="indefinite" begin="0s" />
                </line>
                <line
                  x1="75"
                  y1="110"
                  x2="125"
                  y2="110"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                >
                  <animate attributeName="opacity" values="0.1;0.3;0.1" dur="3s" repeatCount="indefinite" begin="1s" />
                </line>
                <line
                  x1="80"
                  y1="170"
                  x2="120"
                  y2="170"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                >
                  <animate attributeName="opacity" values="0.1;0.3;0.1" dur="3s" repeatCount="indefinite" begin="2s" />
                </line>

                {/* Scanning Effect */}
                <rect x="0" y="0" width="200" height="200" fill="none">
                  <animate attributeName="height" values="0;200;0" dur="5s" repeatCount="indefinite" />
                </rect>
                <line x1="0" y1="100" x2="200" y2="100" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="1">
                  <animate attributeName="y1" values="0;200;0" dur="5s" repeatCount="indefinite" />
                  <animate attributeName="y2" values="0;200;0" dur="5s" repeatCount="indefinite" />
                </line>
              </svg>
            </Box>

            {/* Floating Data Points */}
            <Box
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
            >
              {Array.from({ length: 20 }).map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    position: "absolute",
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    backgroundColor: i % 2 === 0 ? "#a855f7" : "#6366f1",
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    opacity: 0.7,
                    animation: `float ${Math.random() * 10 + 10}s infinite linear`,
                    "@keyframes float": {
                      "0%": { transform: "translate(0, 0)" },
                      "25%": { transform: `translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px)` },
                      "50%": { transform: `translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px)` },
                      "75%": { transform: `translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px)` },
                      "100%": { transform: "translate(0, 0)" },
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>

        {/* Right Side - Login Form */}
        <Box
          sx={{
            flex: { xs: "1 1 100%", md: "1 1 50%" },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: { xs: 2, sm: 4 },
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            transitionDelay: "0.2s",
          }}
        >
          <Card
            sx={{
              width: "100%",
              maxWidth: "450px",
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
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  textAlign: "center",
                  color: "#ffffff",
                  fontWeight: 600,
                }}
              >
                {t("Log in to your account")}
              </Typography>

              <Box component="form" onSubmit={schema.handleSubmit}>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    error={!!handleError(schema, "email")}
                    helperText={handleError(schema, "email")}
                    id="email"
                    type="email"
                    placeholder={t("your@email.com")}
                    value={schema.values.email}
                    onChange={schema.handleChange}
                    onBlur={schema.handleBlur}
                    required
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Mail size={18} color="#a855f7" />
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

                <Box sx={{ mb: 4 }}>
                  <TextField
                    error={!!handleError(schema, "password")}
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={schema.values.password}
                    onChange={schema.handleChange}
                    onBlur={schema.handleBlur}
                    required
                    fullWidth
                    helperText={handleError(schema, "password")}
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
                    {t("Log in")}
                  </Box>
                  <ChevronRight size={18} />
                </Button>

                <Box sx={{ mt: 3, mb: 2, display: "flex", alignItems: "center" }}>
                  <Divider sx={{ flexGrow: 1, borderColor: "rgba(139, 92, 246, 0.2)" }} />
                  <Typography variant="body2" sx={{ px: 2, color: "rgba(255, 255, 255, 0.5)", fontSize: "0.8rem" }}>
                    {t("OR")}
                  </Typography>
                  <Divider sx={{ flexGrow: 1, borderColor: "rgba(139, 92, 246, 0.2)" }} />
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Button
                    onClick={() => {
                      navigate("/forget-password")
                    }}
                    variant="text"
                    sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                      textDecoration: "none",
                      fontWeight: 500,
                      fontSize: "0.85rem",
                      padding: "6px 12px",
                      borderRadius: 1.5,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "rgba(139, 92, 246, 0.1)",
                        color: "#a855f7",
                      },
                    }}
                  >
                    {t("Forgot password")}
                  </Button>

                  <Button
                    variant="text"
                    onClick={() => handleSwitchToSignUp()}
                    sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                      textDecoration: "none",
                      fontWeight: 500,
                      fontSize: "0.85rem",
                      padding: "6px 12px",
                      borderRadius: 1.5,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "rgba(139, 92, 246, 0.1)",
                        color: "#a855f7",
                      },
                    }}
                  >
                    {t("Sign up")}
                  </Button>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                  <Select
                    variant="standard"
                    onChange={(e) => handleChangeLanguage(e.target.value)}
                    labelId="language-filter-label"
                    defaultValue={i18n.language}
                    label={t("Language")}
                    sx={{
                      minWidth: 100,
                      "& .MuiSelect-select": {
                        color: "rgba(255, 255, 255, 0.7)",
                        fontSize: "0.85rem",
                        fontWeight: 500,
                      },
                      "&:before, &:after": {
                        borderColor: "rgba(139, 92, 246, 0.3)",
                      },
                      "&:hover:not(.Mui-disabled):before": {
                        borderColor: "rgba(139, 92, 246, 0.5)",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "rgba(255, 255, 255, 0.7)",
                      },
                    }}
                  >
                    <MenuItem value="en">{t("English")}</MenuItem>
                    <MenuItem value="fr">{t("French")}</MenuItem>
                  </Select>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Toaster for notifications */}
      <Toaster position="top-right" />
    </Box>
  )
}
