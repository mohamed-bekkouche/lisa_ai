"use client"

import {
  Typography,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Chip,
  Divider,
  Avatar,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  alpha,
  styled,
  useTheme,
  useMediaQuery,
  Container,
} from "@mui/material"
import AppBar from "@mui/material/AppBar"
import CssBaseline from "@mui/material/CssBaseline"
import { Link, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { logout } from "../../containers/Login/LoginSlice"
import { useTranslation } from "react-i18next"
import { useEffect, useState, useRef } from "react"
import { AsyncIsPatientPremium } from "../../containers/Payment/PaymentSlice"

// Icons
import PersonIcon from "@mui/icons-material/Person"
import LogoutIcon from "@mui/icons-material/Logout"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import BiotechIcon from "@mui/icons-material/Biotech"
import MenuIcon from "@mui/icons-material/Menu"
import CloseIcon from "@mui/icons-material/Close"

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: "rgba(15, 23, 42, 0.8)",
  backdropFilter: "blur(10px)",
  borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
}))

const LogoText = styled(Typography)(({ theme }) => ({
  color: "#ffffff",
  fontWeight: 700,
  textShadow: "0 2px 10px rgba(0,0,0,0.3)",
  background: "linear-gradient(to right, #ffffff, #ec4899)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}))

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    background: "rgba(15, 23, 42, 0.95)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 0 30px rgba(0, 0, 0, 0.5)",
    borderRight: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    color: "#ffffff",
  },
}))

const UserMenuBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  padding: "4px 8px",
  borderRadius: "12px",
  transition: "all 0.2s ease",
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  background: alpha(theme.palette.primary.main, 0.1),
  "&:hover": {
    background: alpha(theme.palette.primary.main, 0.2),
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(139, 92, 246, 0.2)",
  },
}))

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
  boxShadow: "0 4px 10px rgba(139, 92, 246, 0.3)",
  transition: "transform 0.2s ease",
  "&:hover": {
    transform: "scale(1.1)",
  },
}))

const StyledTabs = styled(Tabs)(({ theme }) => ({
  "& .MuiTabs-indicator": {
    height: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    background: "linear-gradient(to right, #8b5cf6, #ec4899)",
  },
  "& .MuiTab-root": {
    minHeight: 48,
    textTransform: "none",
    fontWeight: "medium",
    fontSize: "0.9rem",
    color: alpha("#ffffff", 0.7),
    transition: "all 0.2s ease",
    "&:hover": {
      color: "#ffffff",
      opacity: 1,
    },
    "&.Mui-selected": {
      color: "#ffffff",
      fontWeight: "bold",
    },
  },
}))

const StyledListItemButton = styled(ListItemButton)(({ theme, active }) => ({
  borderRadius: "12px",
  margin: "4px 8px",
  backgroundColor: active ? alpha(theme.palette.primary.main, 0.1) : "transparent",
  color: active ? "#ffffff" : alpha("#ffffff", 0.7),
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.15),
    color: "#ffffff",
  },
  "& .MuiListItemIcon-root": {
    color: active ? "#ec4899" : alpha("#ffffff", 0.7),
  },
  transition: "all 0.2s ease",
}))

const StyledChip = styled(Chip)(({ theme }) => ({
  background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
  color: "#ffffff",
  fontWeight: "bold",
  boxShadow: "0 2px 8px rgba(139, 92, 246, 0.3)",
}))

function BaseLayout(props) {
  const { links, onLogoutClicked, dir, otherActionButtons, children } = props
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const location = useLocation()
  const canvasRef = useRef(null)
  const [loaded, setLoaded] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const { name, email, role } = useSelector((state) => state.login)

  // State for mobile drawer
  const [mobileOpen, setMobileOpen] = useState(false)

  // State for user menu
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null)
  const isUserMenuOpen = Boolean(userMenuAnchorEl)

  // State for active tab
  const [activeTab, setActiveTab] = useState(0)

  // Find the active tab index based on current path
  useEffect(() => {
    const currentPath = location.pathname
    const activeIndex = links.findIndex((link) => link.path === currentPath)
    if (activeIndex !== -1) {
      setActiveTab(activeIndex)
    }
  }, [location.pathname, links])

  useEffect(() => {
    if (role === "Patient") {
      dispatch(AsyncIsPatientPremium())
    }
  }, [dispatch, role])

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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchorEl(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null)
  }

  const goToLogin = () => {
    navigate("/login")
  }

  const handleLogout = () => {
    handleUserMenuClose()
    dispatch(logout(goToLogin))
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
    navigate(links[newValue].path)
  }

  const handleProfileClick = () => {
    handleUserMenuClose()
    navigate("/profile")
  }

  // Mobile drawer content
  const drawer = (
    <Box sx={{ width: 280 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <BiotechIcon sx={{ mr: 1, color: "#ec4899" }} />
          <LogoText variant="h6">DeepVision Lab</LogoText>
        </Box>
        <IconButton onClick={handleDrawerToggle} sx={{ color: "#ffffff" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: alpha("#8b5cf6", 0.2) }} />

      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 2,
            mb: 2,
            backgroundColor: alpha("#8b5cf6", 0.1),
            borderRadius: 2,
            border: `1px solid ${alpha("#8b5cf6", 0.2)}`,
          }}
        >
          <StyledAvatar sx={{ mr: 2 }}>
            <PersonIcon />
          </StyledAvatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="medium" sx={{ color: "#ffffff" }}>
              {name}
            </Typography>
            <StyledChip label={role} size="small" sx={{ fontSize: "0.7rem", height: 24 }} />
          </Box>
        </Box>
      </Box>

      <List>
        {links.map((link, index) => {
          const isActive = location.pathname === link.path
          return (
            <ListItem key={index} disablePadding component={Link} to={link.path} onClick={handleDrawerToggle}>
              <StyledListItemButton active={isActive ? 1 : 0}>
                <ListItemIcon>{link.icon}</ListItemIcon>
                <ListItemText
                  primary={t(link.title)}
                  primaryTypographyProps={{
                    fontWeight: isActive ? "bold" : "medium",
                  }}
                />
              </StyledListItemButton>
            </ListItem>
          )
        })}
      </List>

      <Divider sx={{ mt: 2, mb: 2, borderColor: alpha("#8b5cf6", 0.2) }} />

      <ListItem disablePadding onClick={handleLogout}>
        <StyledListItemButton>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary={t("Log out")} />
        </StyledListItemButton>
      </ListItem>
    </Box>
  )

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", position: "relative" }}>
      <CssBaseline />

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

      {/* App Bar */}
      <StyledAppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(-20px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, color: "#ffffff" }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
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
            <StyledChip
              label={role}
              size="small"
              sx={{
                ml: 1,
                fontWeight: "medium",
              }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {otherActionButtons}

            <UserMenuBox onClick={handleUserMenuOpen}>
              <StyledAvatar
                sx={{
                  width: 32,
                  height: 32,
                }}
              >
                <PersonIcon fontSize="small" />
              </StyledAvatar>
              <Typography variant="body2" sx={{ ml: 1, mr: 0.5, fontWeight: "bold", color: "#ffffff" }}>
                {name}
              </Typography>
              <ArrowDropDownIcon fontSize="small" sx={{ color: "#ffffff" }} />
            </UserMenuBox>

            <Menu
              anchorEl={userMenuAnchorEl}
              open={isUserMenuOpen}
              onClose={handleUserMenuClose}
              PaperProps={{
                elevation: 2,
                sx: {
                  mt: 1.5,
                  borderRadius: 2,
                  minWidth: 180,
                  overflow: "visible",
                  background: "rgba(15, 23, 42, 0.95)",
                  backdropFilter: "blur(10px)",
                  border: `1px solid ${alpha("#8b5cf6", 0.2)}`,
                  color: "#ffffff",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "rgba(15, 23, 42, 0.95)",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                    border: `1px solid ${alpha("#8b5cf6", 0.2)}`,
                    borderBottom: "none",
                    borderRight: "none",
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem
                onClick={handleProfileClick}
                sx={{
                  "&:hover": { bgcolor: alpha("#8b5cf6", 0.1) },
                }}
              >
                <ListItemIcon>
                  <PersonIcon fontSize="small" sx={{ color: "#ec4899" }} />
                </ListItemIcon>
                <Typography variant="body2">{t("Profile")}</Typography>
              </MenuItem>
              <Divider sx={{ borderColor: alpha("#8b5cf6", 0.2) }} />
              <MenuItem
                onClick={handleLogout}
                sx={{
                  "&:hover": { bgcolor: alpha("#8b5cf6", 0.1) },
                }}
              >
                <ListItemIcon>
                  <LogoutIcon fontSize="small" sx={{ color: "#ec4899" }} />
                </ListItemIcon>
                <Typography variant="body2">{t("Log out")}</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </StyledAppBar>

      {/* Mobile Drawer */}
      <StyledDrawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: "280px",
          },
        }}
      >
        {drawer}
      </StyledDrawer>

      {/* Horizontal Tabs Navigation */}
      <Box
        sx={{
          width: "100%",
          bgcolor: "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          position: "fixed",
          top: 64, // AppBar height
          zIndex: theme.zIndex.appBar - 1,
          display: { xs: "none", md: "block" },
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(-20px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
          transitionDelay: "0.1s",
          borderBottom: `1px solid ${alpha("#8b5cf6", 0.2)}`,
        }}
      >
        <Container maxWidth="xl">
          <StyledTabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            {links.map((link, index) => (
              <Tab
                key={index}
                icon={link.icon}
                label={t(link.title)}
                iconPosition="start"
                sx={{
                  minWidth: 120,
                  "& .MuiSvgIcon-root": {
                    mr: 1,
                    fontSize: "1.2rem",
                    color: activeTab === index ? "#ec4899" : "inherit",
                  },
                }}
              />
            ))}
          </StyledTabs>
        </Container>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 8, md: 16 }, // Extra padding for tabs on desktop
          pb: 4,
          px: 2,
          position: "relative",
          zIndex: 2,
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
          transitionDelay: "0.2s",
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default BaseLayout
