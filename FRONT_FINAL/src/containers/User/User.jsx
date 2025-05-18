"use client"

import React from "react"

import { useEffect, useState, useRef } from "react"
import {
  Typography,
  Box,
  Select,
  IconButton,
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
  useTheme,
  alpha,
  Tooltip,
  TablePagination,
  Badge,
  Button,
  Card,
  CardContent,
  Grid,
} from "@mui/material"
import DoneIcon from "@mui/icons-material/Done"
import CloseIcon from "@mui/icons-material/Close"
import PersonIcon from "@mui/icons-material/Person"
import FilterAltIcon from "@mui/icons-material/FilterAlt"
import AssignmentIcon from "@mui/icons-material/Assignment"
import RefreshIcon from "@mui/icons-material/Refresh"
import EmailIcon from "@mui/icons-material/Email"
import PhoneIcon from "@mui/icons-material/Phone"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import PeopleIcon from "@mui/icons-material/People"
import MedicalServicesIcon from "@mui/icons-material/MedicalServices"
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings"
import { AsyncGetUsers, AsyncActivateDoctor, AsyncRejectDoctor } from "./UserSlice"
import { useDispatch, useSelector } from "react-redux"
import dayjs from "dayjs"

import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

export default function User() {
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loaded, setLoaded] = useState(false)
  const canvasRef = useRef(null)

  const { users } = useSelector((state) => state.user)
  const [filteredUsers, setFilteredUsers] = useState(users)
  const [filterValue, setFilterValue] = useState("All")

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

  const handleFilter = (value) => {
    setFilterValue(value)
    if (value !== "All") {
      const data = users.filter((item) => item.role === value)
      setFilteredUsers(data)
    } else {
      setFilteredUsers(users)
    }
    // Reset to first page when filtering
    setPage(0)
  }

  const handleRefresh = () => {
    dispatch(AsyncGetUsers())
  }

  const handleGoToDocument = (document_id) => {
    navigate(`/document-doctor/${document_id}`)
  }

  const handleActivateDoctor = (doctor_id) => {
    dispatch(AsyncActivateDoctor(doctor_id))
  }

  const handleRejectDoctor = (doctor_id) => {
    dispatch(AsyncRejectDoctor(doctor_id))
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  useEffect(() => {
    dispatch(AsyncGetUsers())
  }, [dispatch])

  useEffect(() => {
    setFilteredUsers(users)
  }, [users])

  // Apply pagination
  const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "Doctor":
        return "#8b5cf6" // Violet
      case "Patient":
        return "#ec4899" // Rose
      case "Admin":
        return "#d946ef" // Rose-violet
      default:
        return "#6b7280" // Gris
    }
  }

  // Count users by role
  const userCounts = {
    total: users.length,
    patients: users.filter((user) => user.role === "Patient").length,
    doctors: users.filter((user) => user.role === "Doctor").length,
    admins: users.filter((user) => user.role === "Admin").length,
  }

  // Card styles with gradients
  const cardStyles = [
    {
      icon: <PeopleIcon />,
      title: t("Total Users"),
      count: userCounts.total,
      gradient: "linear-gradient(135deg, rgba(99, 102, 241, 0.8) 0%, rgba(168, 85, 247, 0.8) 100%)",
      color: "#8b5cf6",
      bgColor: "rgba(139, 92, 246, 0.1)",
    },
    {
      icon: <PersonIcon />,
      title: t("Patients"),
      count: userCounts.patients,
      gradient: "linear-gradient(135deg, rgba(236, 72, 153, 0.8) 0%, rgba(217, 70, 239, 0.8) 100%)",
      color: "#ec4899",
      bgColor: "rgba(236, 72, 153, 0.1)",
    },
    {
      icon: <MedicalServicesIcon />,
      title: t("Doctors"),
      count: userCounts.doctors,
      gradient: "linear-gradient(135deg, rgba(139, 92, 246, 0.8) 0%, rgba(79, 70, 229, 0.8) 100%)",
      color: "#8b5cf6",
      bgColor: "rgba(139, 92, 246, 0.1)",
    },
    {
      icon: <AdminPanelSettingsIcon />,
      title: t("Admins"),
      count: userCounts.admins,
      gradient: "linear-gradient(135deg, rgba(217, 70, 239, 0.8) 0%, rgba(124, 58, 237, 0.8) 100%)",
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
            {t("User Management")}
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

        {/* Dashboard Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {cardStyles.map((card, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
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

        {/* Main Users Table */}
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
                <Typography variant="h6" fontWeight="bold" color="white">
                  {t("All Users")}
                </Typography>
                <Chip
                  label={`${users.length} ${t("users")}`}
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
              <Box sx={{ display: "flex", gap: 2 }}>
                <FormControl size="small">
                  <Select
                    value={filterValue}
                    onChange={(e) => handleFilter(e.target.value)}
                    displayEmpty
                    startAdornment={
                      <InputAdornment position="start">
                        <FilterAltIcon fontSize="small" sx={{ color: "rgba(255, 255, 255, 0.5)" }} />
                      </InputAdornment>
                    }
                    sx={{
                      borderRadius: "8px",
                      background: alpha(theme.palette.common.white, 0.05),
                      color: "white",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: alpha(theme.palette.primary.main, 0.2),
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: alpha(theme.palette.primary.main, 0.4),
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.primary.main,
                      },
                      "& .MuiSvgIcon-root": {
                        color: "rgba(255, 255, 255, 0.7)",
                      },
                      minWidth: 150,
                    }}
                  >
                    <MenuItem value="All">{t("All Users")}</MenuItem>
                    <MenuItem value="Patient">{t("Patients")}</MenuItem>
                    <MenuItem value="Doctor">{t("Doctors")}</MenuItem>
                    <MenuItem value="Admin">{t("Admins")}</MenuItem>
                  </Select>
                </FormControl>

                <Tooltip title={t("Refresh users")}>
                  <IconButton
                    onClick={handleRefresh}
                    sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                      backgroundColor: alpha(theme.palette.common.white, 0.05),
                      borderRadius: "8px",
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.common.white, 0.1),
                      },
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Divider sx={{ mb: 3, borderColor: alpha(theme.palette.primary.main, 0.1) }} />

            {filteredUsers.length === 0 ? (
              <Box
                sx={{
                  p: 6,
                  textAlign: "center",
                  background: alpha(theme.palette.common.white, 0.02),
                  borderRadius: "8px",
                  border: `1px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
                }}
              >
                <PersonIcon sx={{ fontSize: 64, color: "rgba(255, 255, 255, 0.2)", mb: 2 }} />
                <Typography color="rgba(255, 255, 255, 0.7)" variant="h6" gutterBottom>
                  {filterValue === "All"
                    ? t("No users found in the system.")
                    : t(`No ${filterValue.toLowerCase()} users found.`)}
                </Typography>
              </Box>
            ) : (
              <>
                <TableContainer
                  sx={{
                    borderRadius: "8px",
                    background: alpha(theme.palette.common.white, 0.02),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
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
                            borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                            fontSize: "0.9rem",
                          }}
                        >
                          {t("User")}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            fontWeight: "bold",
                            borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                            fontSize: "0.9rem",
                          }}
                        >
                          {t("Email")}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            fontWeight: "bold",
                            borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                            fontSize: "0.9rem",
                          }}
                        >
                          {t("Phone")}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            fontWeight: "bold",
                            borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                            fontSize: "0.9rem",
                          }}
                        >
                          {t("Join Date")}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            fontWeight: "bold",
                            borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
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
                            borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                            fontSize: "0.9rem",
                          }}
                        >
                          {t("Actions")}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedUsers.map((user) => {
                        const formattedDate = dayjs(user.createdAt).format("DD-MM-YY HH:mm")
                        const roleColor = getRoleBadgeColor(user.role)

                        return (
                          <TableRow
                            key={user.id || user._id}
                            hover
                            sx={{
                              transition: "background-color 0.3s ease",
                              "&:hover": {
                                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                              },
                              "& td": {
                                borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                color: "white",
                                py: 2,
                              },
                            }}
                          >
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Badge
                                  overlap="circular"
                                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                  badgeContent={
                                    <Box
                                      sx={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: "50%",
                                        bgcolor: roleColor,
                                        border: `2px solid rgba(15, 23, 42, 0.8)`,
                                      }}
                                    />
                                  }
                                >
                                  <Avatar
                                    sx={{
                                      bgcolor: alpha(roleColor, 0.2),
                                      color: roleColor,
                                      mr: 2,
                                    }}
                                  >
                                    <PersonIcon />
                                  </Avatar>
                                </Badge>
                                <Box>
                                  <Typography variant="body2" fontWeight="medium">
                                    {user.name}
                                  </Typography>
                                  <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">
                                    {t(user.role)}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <EmailIcon fontSize="small" sx={{ color: "#ec4899", mr: 1, opacity: 0.7 }} />
                                <Typography>{user.email}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <PhoneIcon fontSize="small" sx={{ color: "#ec4899", mr: 1, opacity: 0.7 }} />
                                <Typography>{user.p_phoneNum || user.phoneNum || t("Not provided")}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <CalendarMonthIcon fontSize="small" sx={{ color: "#ec4899", mr: 1, opacity: 0.7 }} />
                                <Typography>{formattedDate}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              {user.role === "Doctor" && (
                                <Chip
                                  icon={user.isActive ? <DoneIcon /> : <CloseIcon />}
                                  label={user.isActive ? t("Enabled") : t("Disabled")}
                                  size="small"
                                  sx={{
                                    fontWeight: "medium",
                                    backgroundColor: user.isActive ? alpha("#10b981", 0.2) : alpha("#ef4444", 0.2),
                                    color: user.isActive ? "#10b981" : "#ef4444",
                                    borderRadius: "8px",
                                  }}
                                />
                              )}
                            </TableCell>
                            <TableCell align="right">
                              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                                {user.role === "Doctor" && (
                                  <>
                                    <Tooltip title={user.isActive ? t("Disable doctor") : t("Enable doctor")}>
                                      <IconButton
                                        onClick={() => {
                                          user.isActive ? handleRejectDoctor(user._id) : handleActivateDoctor(user._id)
                                        }}
                                        size="small"
                                        sx={{
                                          color: "rgba(255, 255, 255, 0.7)",
                                          backgroundColor: user.isActive
                                            ? alpha("#ef4444", 0.1)
                                            : alpha("#10b981", 0.1),
                                          borderRadius: "4px",
                                          mr: 1,
                                          transition: "all 0.2s ease",
                                          "&:hover": {
                                            transform: "scale(1.1)",
                                            backgroundColor: user.isActive
                                              ? alpha("#ef4444", 0.2)
                                              : alpha("#10b981", 0.2),
                                            color: user.isActive ? "#ef4444" : "#10b981",
                                          },
                                        }}
                                      >
                                        {user.isActive ? <CloseIcon fontSize="small" /> : <DoneIcon fontSize="small" />}
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title={t("View documents")}>
                                      <IconButton
                                        onClick={() => handleGoToDocument(user._id)}
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
                                        <AssignmentIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </>
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
      </Box>
    </Box>
  )
}
