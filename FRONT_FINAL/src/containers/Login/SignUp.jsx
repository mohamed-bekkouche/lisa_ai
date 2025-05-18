"use client"

import { useState, useRef, useEffect } from "react"
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  useMediaQuery,
  useTheme,
  Autocomplete,
  Divider,
} from "@mui/material"
import { Stethoscope, FileText, ChevronRight, User, Mail, Lock, Phone, MapPin, Clock } from "lucide-react"
import { Toaster } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { AsyncSignUp } from "./LoginSlice"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useTranslation } from "react-i18next"

function handleError(schema, name) {
  if (schema.touched[name] && schema.errors[name]) {
    return schema.errors[name]
  }
  return null
}

export default function Signup() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const dispatch = useDispatch()
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

  const handleSwitchToSignUp = () => {
    navigate("/login")
  }

  const handleGoActiv = (token) => {
    navigate(`/activate-account/${token}`)
  }

  const schema = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      phoneNum: "",
      address: "",
      role: "Patient",
      specialization: "",
      schedule: "",
      file: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required(t("Required.")),
      email: Yup.string().required(t("Required.")),
      password: Yup.string().required(t("Required.")),
      phoneNum: Yup.string().required(t("Required.")),
      address: Yup.string().required(t("Required.")),
      role: Yup.string().required(t("Required.")),
      specialization: Yup.string().notRequired(),
      schedule: Yup.string().notRequired(),
      file: Yup.mixed().notRequired(),
    }),
    onSubmit: (values) => {
      dispatch(
        AsyncSignUp(
          values.name,
          values.email,
          values.password,
          values.phoneNum,
          values.address,
          values.role,
          values.specialization,
          values.schedule,
          values.file,
          handleGoActiv,
        ),
      )
    },
  })

  const handleFormikFileChange = (event) => {
    schema.setFieldValue("file", event.currentTarget.files[0])
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Toaster position="top-right" />

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

      {/* Form Container */}
      <Box
        sx={{
          width: { xs: "100%", md: "90%" },
          maxWidth: "1000px",
          zIndex: 2,
          p: { xs: 2, sm: 4 },
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
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
              {t("Create Your Account")}
            </Typography>

            <Box
              component="form"
              onSubmit={schema.handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
                {/* Left Column */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {/* Name Field */}
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      name="name"
                      placeholder={t("Full Name")}
                      error={!!handleError(schema, "name")}
                      helperText={handleError(schema, "name")}
                      value={schema.values.name}
                      onChange={schema.handleChange}
                      onBlur={schema.handleBlur}
                      required
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                            <User size={18} color="#a855f7" />
                          </Box>
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

                  {/* Email Field */}
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      name="email"
                      type="email"
                      placeholder="Email"
                      error={!!handleError(schema, "email")}
                      helperText={handleError(schema, "email")}
                      value={schema.values.email}
                      onChange={schema.handleChange}
                      onBlur={schema.handleBlur}
                      required
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                            <Mail size={18} color="#a855f7" />
                          </Box>
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

                  {/* Password Field */}
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      name="password"
                      type="password"
                      placeholder={t("Password")}
                      error={!!handleError(schema, "password")}
                      helperText={handleError(schema, "password")}
                      value={schema.values.password}
                      onChange={schema.handleChange}
                      onBlur={schema.handleBlur}
                      required
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                            <Lock size={18} color="#a855f7" />
                          </Box>
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

                  {/* Phone Number Field */}
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      name="phoneNum"
                      placeholder={t("Phone Number")}
                      error={!!handleError(schema, "phoneNum")}
                      helperText={handleError(schema, "phoneNum")}
                      value={schema.values.phoneNum}
                      onChange={schema.handleChange}
                      onBlur={schema.handleBlur}
                      required
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                            <Phone size={18} color="#a855f7" />
                          </Box>
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
                </Box>

                {/* Right Column */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {/* Address Field */}
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      name="address"
                      placeholder={t("Address")}
                      error={!!handleError(schema, "address")}
                      helperText={handleError(schema, "address")}
                      value={schema.values.address}
                      onChange={schema.handleChange}
                      onBlur={schema.handleBlur}
                      required
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                            <MapPin size={18} color="#a855f7" />
                          </Box>
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

                  {/* Role Selection */}
                  <FormControl fullWidth>
                    <Autocomplete
                      onChange={(event, value) => {
                        schema.setFieldValue("role", value)
                      }}
                      defaultValue="Patient"
                      options={["Patient", "Doctor"]}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name="role"
                          label={t("Role")}
                          onBlur={schema.handleBlur}
                          error={Boolean(handleError(schema, "role"))}
                          helperText={handleError(schema, "role")}
                          value={schema.values.role}
                          InputProps={{
                            ...params.InputProps,
                            sx: {
                              borderRadius: 2,
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
                              "& input, & .MuiInputLabel-root": {
                                color: "#ffffff",
                              },
                            },
                            "& .MuiFormHelperText-root": {
                              color: "#ff5252",
                            },
                          }}
                        />
                      )}
                      sx={{
                        "& .MuiAutocomplete-endAdornment": {
                          "& .MuiSvgIcon-root": {
                            color: "rgba(255, 255, 255, 0.7)",
                          },
                        },
                      }}
                    />

                    {schema.values.role === "Doctor" && (
                      <Box
                        sx={{
                          mt: 2,
                          p: 2,
                          borderRadius: 2,
                          background: "rgba(139, 92, 246, 0.1)",
                          border: "1px solid rgba(139, 92, 246, 0.2)",
                          display: "flex",
                          alignItems: "flex-start",
                        }}
                      >
                        <Stethoscope
                          size={16}
                          color="#a855f7"
                          style={{ marginTop: "2px", marginRight: "8px", flexShrink: 0 }}
                        />
                        <FormHelperText sx={{ m: 0, color: "rgba(255, 255, 255, 0.7)", fontSize: "0.75rem" }}>
                          <Typography component="span" fontWeight={500} sx={{ fontSize: "inherit", color: "#ffffff" }}>
                            {t("Note:")}
                          </Typography>{" "}
                          {t(
                            "Doctor accounts are not for receiving care, but for being featured in our recommendation list for premium patients.",
                          )}
                        </FormHelperText>
                      </Box>
                    )}
                  </FormControl>

                  {/* Doctor-specific fields */}
                  {schema.values.role === "Doctor" && (
                    <>
                      <Box sx={{ position: "relative" }}>
                        <TextField
                          name="specialization"
                          placeholder="Specialization"
                          value={schema.values.specialization}
                          onChange={schema.handleChange}
                          onBlur={schema.handleBlur}
                          error={!!handleError(schema, "specialization")}
                          helperText={handleError(schema, "specialization")}
                          required
                          fullWidth
                          InputProps={{
                            startAdornment: (
                              <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                                <Stethoscope size={18} color="#a855f7" />
                              </Box>
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

                      <Box sx={{ position: "relative" }}>
                        <TextField
                          name="schedule"
                          placeholder="Schedule"
                          value={schema.values.schedule}
                          onChange={schema.handleChange}
                          onBlur={schema.handleBlur}
                          error={!!handleError(schema, "schedule")}
                          helperText={handleError(schema, "schedule")}
                          required
                          fullWidth
                          InputProps={{
                            startAdornment: (
                              <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                                <Clock size={18} color="#a855f7" />
                              </Box>
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
                    </>
                  )}
                </Box>
              </Box>

              {/* Document Upload Field for Doctors */}
              {schema.values.role === "Doctor" && (
                <Box
                  sx={{
                    border: "1px dashed rgba(139, 92, 246, 0.4)",
                    borderRadius: 2,
                    p: 3,
                    background: "rgba(139, 92, 246, 0.05)",
                    "&:hover": {
                      borderColor: "#a855f7",
                      transition: "border-color 0.2s",
                    },
                  }}
                >
                  <Box
                    component="label"
                    htmlFor="medical-document"
                    sx={{
                      display: "block",
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <FileText color="#a855f7" size={32} />
                      <Typography sx={{ fontSize: "0.875rem", fontWeight: 500, color: "#ffffff" }}>
                        {t("Upload Medical Credentials")}
                      </Typography>
                      <Typography sx={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.7)" }}>
                        {t("Upload a document proving you're a certified medical professional")}
                      </Typography>
                      <Typography sx={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.5)" }}>
                        {t("PDF, JPG or PNG (max. 5MB)")}
                      </Typography>
                      <input
                        id="medical-document"
                        type="file"
                        onChange={handleFormikFileChange}
                        style={{ display: "none" }}
                        accept=".pdf,.jpg,.jpeg,.png"
                        required
                      />
                      <Button
                        variant="outlined"
                        onClick={() => document.getElementById("medical-document")?.click()}
                        sx={{
                          px: 3,
                          py: 1,
                          mt: 1,
                          bgcolor: "rgba(139, 92, 246, 0.1)",
                          border: "1px solid rgba(139, 92, 246, 0.3)",
                          borderRadius: 2,
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          color: "#ffffff",
                          textTransform: "none",
                          "&:hover": {
                            bgcolor: "rgba(139, 92, 246, 0.2)",
                            borderColor: "#a855f7",
                          },
                        }}
                      >
                        {t("Select Document")}
                      </Button>
                      {schema.values.file && (
                        <Typography sx={{ fontSize: "0.75rem", color: "#a855f7", mt: 1 }}>
                          {schema.values.file.name} {t("selected")}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              )}

              <Divider sx={{ borderColor: "rgba(139, 92, 246, 0.2)", my: 1 }} />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
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
                  {t("Sign Up")}
                </Box>
                <ChevronRight size={18} />
              </Button>

              {/* Login Link */}
              <Typography align="center" sx={{ fontSize: "0.875rem", color: "rgba(255, 255, 255, 0.7)", mt: 1 }}>
                {t("Already have an account?")}
                <Button
                  onClick={handleSwitchToSignUp}
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
