"use client"

import { Container, Paper, useTheme, styled, Box as MuiBox, keyframes } from "@mui/material"
import { Box } from "@mui/system"
import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import ChatContent from "./Components/ChatContent/ChatContent"
import ChatInput from "./Components/ChatInput/ChatInput"
import ChatSideBar from "./Components/ChatSideBar/ChatSideBar"
import { AsyncGetUsers } from "../User/UserSlice"
import {
  fetchConversationsAsync,
  fetchMessagesAsync,
  removeFromNotificationMessage,
  setSelectedConversation,
  appendSocketMessage,
} from "./ChatSlice"
import { useTranslation } from "react-i18next"
import { useSocket } from "../../helpers/socket"

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`

// Styled components with purple theme matching notification component
const ChatContainer = styled(Container)(({ theme }) => ({
  animation: `${fadeIn} 0.5s ease-out`,
  position: "relative",
  minHeight: "100vh",
}))

const ChatPaper = styled(Paper)(({ theme }) => ({
  padding: "21px",
  marginTop: "24px",
  borderRadius: "20px",
  background: "rgba(255, 255, 255, 0.03)",
  backdropFilter: "blur(20px)",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
  border: "1px solid rgba(139, 92, 246, 0.2)",
  position: "relative",
  overflow: "hidden",
  zIndex: 2,
}))

const ChatLayout = styled(MuiBox)(({ theme }) => ({
  display: "flex",
  height: "85vh",
  gap: "16px",
  position: "relative",
  zIndex: 2,
}))

const SidebarWrapper = styled(MuiBox)(({ theme }) => ({
  flex: { xs: 4 },
  borderRadius: "16px",
  overflow: "hidden",
  background: "rgba(255, 255, 255, 0.03)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(139, 92, 246, 0.2)",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
}))

const ContentWrapper = styled(MuiBox)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  width: "100%",
  gap: "16px",
  height: "100%",
}))

const MessagesWrapper = styled(MuiBox)(({ theme }) => ({
  flexGrow: 10,
  borderRadius: "16px",
  overflow: "auto",
  background: "rgba(255, 255, 255, 0.02)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(139, 92, 246, 0.1)",
  boxShadow: "inset 0 2px 10px rgba(0, 0, 0, 0.1)",

  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "rgba(0, 0, 0, 0.1)",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(139, 92, 246, 0.2)",
    borderRadius: "4px",
  },
}))

const InputWrapper = styled(MuiBox)(({ theme }) => ({
  borderRadius: "16px",
  overflow: "hidden",
  background: "rgba(255, 255, 255, 0.03)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(139, 92, 246, 0.2)",
}))

const admins = [
  {
    avatar: "/uploads/user.jpeg",
    name: "admin",
    role: "Admin",
  },
]

export default function Chat() {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { messages, selectedConversation } = useSelector((state) => state.chat)
  const { users } = useSelector((state) => state.user)
  const [updateMessages, setUpdateMessages] = useState(false)
  const { role, name, id } = useSelector((state) => state.login)
  const { t } = useTranslation()
  const socket = useSocket()
  const canvasRef = useRef(null)
  const [loaded, setLoaded] = useState(false)

  const sendMessage = (message) => {
    if (message && socket) {
      socket.emit("send-message", message)
    }
  }

  const selectedConversationRef = useRef(selectedConversation)

  useEffect(() => {
    selectedConversationRef.current = selectedConversation
  }, [selectedConversation])

  useEffect(() => {
    const handleNewMessage = (msg) => {
      const currentConversation = selectedConversationRef.current
      if (role === "Admin") {
        if (currentConversation?._id === msg.patientId) {
          dispatch(appendSocketMessage(msg))
        }
      } else if (role === "Patient" || role === "Doctor") {
        dispatch(appendSocketMessage(msg))
      }
    }

    socket.on("new-message", handleNewMessage)

    return () => {
      if (socket) {
        socket.off("new-message")
      }
    }
  }, [socket])

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

  const handleSendMessage = (message) => {
    const data = {
      patientId: role === "Admin" ? selectedConversation._id : id,
      content: message,
      sender: role === "Admin" ? "admin" : "patient",
      senderType: role === "Admin" ? "admin" : "patient",
    }
    sendMessage(data)
  }

  const handleSelectConversation = (conversation) => {
    dispatch(setSelectedConversation(conversation))

    let patientId = id
    if (role === "Admin") {
      dispatch(removeFromNotificationMessage(conversation._id))
      patientId = conversation._id
    } else {
      dispatch(removeFromNotificationMessage(id))
    }

    dispatch(fetchMessagesAsync(patientId))

    if (socket) {
      if (role === "Admin") {
        socket.emit("admin-join", { adminId: id, patientId: patientId })
      } else {
        socket.emit("patient-join", patientId)
      }
    }
  }

  const handleChatInputClicked = () => {
    if (updateMessages && selectedConversation) {
      setUpdateMessages(false)
    }
  }

  useEffect(() => {
    dispatch(AsyncGetUsers())
    dispatch(fetchConversationsAsync())
  }, [dispatch])

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

      {/* Background Overlay with purple tint */}
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

      <ChatContainer maxWidth="lg">
        <Box
          sx={{
            pt: { xs: 4, sm: 6 },
            position: "relative",
            zIndex: 2,
            px: { xs: 2, sm: 4, md: 6 },
            width: "100%",
            maxWidth: "1400px",
            mx: "auto",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          <ChatLayout>
            <SidebarWrapper>
              <ChatSideBar onConversationSelect={handleSelectConversation} users={role === "Admin" ? users : admins} />
            </SidebarWrapper>

            <ContentWrapper>
              <MessagesWrapper>
                <ChatContent messages={messages} conversation={selectedConversation} />
              </MessagesWrapper>

              <InputWrapper>
                <ChatInput
                  onSend={handleSendMessage}
                  clicked={handleChatInputClicked}
                  disabled={!selectedConversation}
                />
              </InputWrapper>
            </ContentWrapper>
          </ChatLayout>
        </Box>
      </ChatContainer>
    </Box>
  )
}
