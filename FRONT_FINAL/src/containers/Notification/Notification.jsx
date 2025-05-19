"use client"

import {
  Typography,
  Badge,
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
  Button,
  Tooltip,
  Chip,
  TablePagination,
  Card,
  CardContent,
  useTheme,
  Grid,
} from "@mui/material"

import NotificationsIcon from "@mui/icons-material/Notifications"
import FilterAltIcon from "@mui/icons-material/FilterAlt"
import MarkunreadIcon from "@mui/icons-material/Markunread"
import RefreshIcon from "@mui/icons-material/Refresh"
import DoneAllIcon from "@mui/icons-material/DoneAll"
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive"
import DeleteIcon from "@mui/icons-material/Delete"
import VisibilityIcon from "@mui/icons-material/Visibility"
import SearchIcon from "@mui/icons-material/Search"
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead"

import { useDispatch, useSelector } from "react-redux"
import { AsyncGetNotifications, AsyncReadNotification, AsyncReadAllNotifications } from "./NotificationSlice"
import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { useTranslation } from "react-i18next"

// Extend dayjs with relativeTime plugin
dayjs.extend(relativeTime)

export function Notification() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { notifications } = useSelector((state) => state.notification)
  const unreadCount = notifications.filter((element) => element.read === false).length

  const { t } = useTranslation()

  useEffect(() => {
    dispatch(AsyncGetNotifications())
  }, [dispatch])

  return (
    <Tooltip title={unreadCount > 0 ? `${unreadCount} ${t("unread notifications")}` : t("No new notifications")}>
      <IconButton
        onClick={() => navigate("/notifications")}
        sx={{
          position: "relative",
          transition: "transform 0.2s ease",
          "&:hover": {
            transform: "scale(1.1)",
          },
        }}
      >
        <Badge
          badgeContent={unreadCount}
          sx={{
            "& .MuiBadge-badge": {
              fontSize: "0.7rem",
              height: "20px",
              minWidth: "20px",
              padding: "0 6px",
              fontWeight: "bold",
              backgroundColor: "#ec4899",
              color: "white",
            },
          }}
        >
          <NotificationsIcon sx={{ color: "white" }} />
        </Badge>
      </IconButton>
    </Tooltip>
  )
}

export function NotificationTable() {
  const dispatch = useDispatch()
  const theme = useTheme()
  const { role, name } = useSelector((state) => state.login)
  const { notifications } = useSelector((state) => state.notification)
  const [filteredNotifications, setFilteredNotifications] = useState(notifications)
  const [filterValue, setFilterValue] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const { t } = useTranslation()
  const [loaded, setLoaded] = useState(false)
  const canvasRef = useRef(null)

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
    let filtered = [...notifications]

    // Apply status filter
    if (status !== "All") {
      if (status === "Read") {
        filtered = filtered.filter((item) => item.read === true)
      } else if (status === "Unread") {
        filtered = filtered.filter((item) => item.read === false)
      }
    }

    // Apply search filter if query exists
    if (query) {
      const lowerQuery = query.toLowerCase()
      filtered = filtered.filter((notification) => {
        return (
          notification.content.toLowerCase().includes(lowerQuery) ||
          dayjs(notification.createdAt).format("DD-MM-YY HH:mm").includes(lowerQuery)
        )
      })
    }

    setFilteredNotifications(filtered)
  }

  const handleReadNotification = (id) => {
    dispatch(AsyncReadNotification(id))
  }

  const handleReadAllNotifications = () => {
    dispatch(AsyncReadAllNotifications())
  }

  const handleRefresh = () => {
    dispatch(AsyncGetNotifications())
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  useEffect(() => {
    setFilteredNotifications(notifications)
  }, [notifications])

  useEffect(() => {
    dispatch(AsyncGetNotifications())
  }, [dispatch])

  // Apply pagination
  const paginatedNotifications = filteredNotifications.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  // Calculate notification statistics
  const totalNotifications = notifications.length
  const unreadCount = notifications.filter((notification) => notification.read === false).length
  const readCount = notifications.filter((notification) => notification.read === true).length

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
          maxWidth: "1400px",
          mx: "auto",
        }}
      >
        {/* Page Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 5,
            mt: 4,
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
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
              {t("Notifications")}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                mt: 1,
              }}
            >
              {t("Manage and track all your notifications in one place")}
            </Typography>
          </Box>
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
              disabled={unreadCount === 0}
              onClick={handleReadAllNotifications}
              variant="contained"
              startIcon={<DoneAllIcon />}
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
                "&.Mui-disabled": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "rgba(255, 255, 255, 0.4)",
                },
              }}
            >
              {t("Mark all as read")}
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {/* Total Notifications */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                borderRadius: "20px",
                background: "rgba(255, 255, 255, 0.03)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                overflow: "hidden",
                position: "relative",
                border: "1px solid rgba(139, 92, 246, 0.2)",
                height: "100%",
                opacity: loaded ? 1 : 0,
                transform: loaded ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
                transitionDelay: "0.1s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 15px 35px rgba(0, 0, 0, 0.3)",
                },
              }}
            >
              <CardContent sx={{ p: 3, display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
                    mr: 3,
                  }}
                >
                  <NotificationsIcon sx={{ color: "white", fontSize: 30 }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="white">
                    {totalNotifications}
                  </Typography>
                  <Typography variant="body1" color="rgba(255, 255, 255, 0.7)">
                    {t("Total Notifications")}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Unread Notifications */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                borderRadius: "20px",
                background: "rgba(255, 255, 255, 0.03)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                overflow: "hidden",
                position: "relative",
                border: "1px solid rgba(236, 72, 153, 0.2)",
                height: "100%",
                opacity: loaded ? 1 : 0,
                transform: loaded ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
                transitionDelay: "0.2s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 15px 35px rgba(0, 0, 0, 0.3)",
                },
              }}
            >
              <CardContent sx={{ p: 3, display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
                    boxShadow: "0 4px 15px rgba(236, 72, 153, 0.3)",
                    mr: 3,
                  }}
                >
                  <NotificationsActiveIcon sx={{ color: "white", fontSize: 30 }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="white">
                    {unreadCount}
                  </Typography>
                  <Typography variant="body1" color="rgba(255, 255, 255, 0.7)">
                    {t("Unread")}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Read Notifications */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                borderRadius: "20px",
                background: "rgba(255, 255, 255, 0.03)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                overflow: "hidden",
                position: "relative",
                border: "1px solid rgba(139, 92, 246, 0.2)",
                height: "100%",
                opacity: loaded ? 1 : 0,
                transform: loaded ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
                transitionDelay: "0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 15px 35px rgba(0, 0, 0, 0.3)",
                },
              }}
            >
              <CardContent sx={{ p: 3, display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
                    boxShadow: "0 4px 15px rgba(139, 92, 246, 0.3)",
                    mr: 3,
                  }}
                >
                  <MarkEmailReadIcon sx={{ color: "white", fontSize: 30 }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="white">
                    {readCount}
                  </Typography>
                  <Typography variant="body1" color="rgba(255, 255, 255, 0.7)">
                    {t("Read")}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Notifications Table */}
        <Card
          sx={{
            borderRadius: "20px",
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
            overflow: "hidden",
            position: "relative",
            border: "1px solid rgba(139, 92, 246, 0.2)",
            mb: 5,
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            transitionDelay: "0.4s",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="h5" fontWeight="bold" color="white">
                  {t("All Notifications")}
                </Typography>
                {unreadCount > 0 && (
                  <Chip
                    label={`${unreadCount} ${t("unread")}`}
                    sx={{
                      ml: 2,
                      fontWeight: "medium",
                      backgroundColor: "rgba(236, 72, 153, 0.2)",
                      color: "#ec4899",
                      borderRadius: "10px",
                      border: "1px solid rgba(236, 72, 153, 0.3)",
                    }}
                  />
                )}
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                {/* Search Field */}
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: "12px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(139, 92, 246, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    px: 2,
                    width: 220,
                  }}
                >
                  <SearchIcon sx={{ color: "rgba(255, 255, 255, 0.5)", mr: 1 }} />
                  <input
                    type="text"
                    placeholder={t("Search notifications...")}
                    value={searchQuery}
                    onChange={handleSearch}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "white",
                      outline: "none",
                      width: "100%",
                      padding: "8px 0",
                      fontSize: "0.875rem",
                    }}
                  />
                </Box>

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
                      borderRadius: "12px",
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
                      minWidth: 150,
                    }}
                  >
                    <MenuItem value="All">{t("All Notifications")}</MenuItem>
                    <MenuItem value="Read">{t("Read")}</MenuItem>
                    <MenuItem value="Unread">{t("Unread")}</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {filteredNotifications.length === 0 ? (
              <Box
                sx={{
                  p: 6,
                  textAlign: "center",
                  background: "rgba(255, 255, 255, 0.02)",
                  borderRadius: "16px",
                  border: "1px dashed rgba(139, 92, 246, 0.2)",
                }}
              >
                <NotificationsIcon sx={{ fontSize: 64, color: "rgba(255, 255, 255, 0.2)", mb: 2 }} />
                <Typography color="rgba(255, 255, 255, 0.7)" variant="h6" gutterBottom>
                  {filterValue === "All"
                    ? t("You don't have any notifications yet.")
                    : filterValue === "Read"
                      ? t("You don't have any read notifications.")
                      : t("You don't have any unread notifications.")}
                </Typography>
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
                          {t("Content")}
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
                      {paginatedNotifications.map((notification) => {
                        const date = dayjs(notification.createdAt).format("DD-MM-YY HH:mm")
                        const timeAgo = dayjs(notification.createdAt).fromNow()
                        return (
                          <TableRow
                            key={notification._id}
                            hover
                            sx={{
                              transition: "background-color 0.3s ease",
                              backgroundColor: notification.read ? "transparent" : "rgba(139, 92, 246, 0.05)",
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
                            <TableCell
                              sx={{
                                fontWeight: notification.read ? "normal" : "medium",
                                position: "relative",
                                pl: notification.read ? 2 : 4,
                                "&::before": !notification.read
                                  ? {
                                      content: '""',
                                      position: "absolute",
                                      left: "10px",
                                      top: "50%",
                                      transform: "translateY(-50%)",
                                      width: "8px",
                                      height: "8px",
                                      borderRadius: "50%",
                                      backgroundColor: "#a855f7",
                                    }
                                  : {},
                              }}
                            >
                              {notification.content}
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", flexDirection: "column" }}>
                                <Typography variant="body2">{date}</Typography>

                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                                
                                <Tooltip title={notification.read ? t("Mark as unread") : t("Mark as read")}>
                                  <IconButton
                                    onClick={() => handleReadNotification(notification._id)}
                                    size="small"
                                    sx={{
                                      color: notification.read ? "rgba(255, 255, 255, 0.5)" : "#a855f7",
                                      backgroundColor: notification.read
                                        ? "rgba(255, 255, 255, 0.05)"
                                        : "rgba(168, 85, 247, 0.1)",
                                      borderRadius: "10px",
                                      transition: "all 0.285,247,0.1)",
                                      borderRadius: "10px",
                                      transition: "all 0.2s ease",
                                      "&:hover": {
                                        transform: "scale(1.1)",
                                        backgroundColor: "rgba(168, 85, 247, 0.2)",
                                      },
                                    }}
                                  >
                                    {notification.read ? (
                                      <MarkunreadIcon fontSize="small" />
                                    ) : (
                                      <MarkEmailReadIcon fontSize="small" />
                                    )}
                                  </IconButton>
                                </Tooltip>
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
                  count={filteredNotifications.length}
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
