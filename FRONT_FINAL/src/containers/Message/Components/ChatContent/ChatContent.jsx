"use client"

import { Box } from "@mui/system"
import { useEffect, useRef } from "react"
import { useDispatch } from "react-redux"
import ChatMessage from "../ChatMessage/ChatMessage"
import { styled, keyframes } from "@mui/material"

// Animations keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`

// Styled components with purple theme matching notification component
const ChatContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  padding: "12px 16px",
  minHeight: "100px",
  maxHeight: "70vh",
  overflowY: "auto",
  background: "rgba(255, 255, 255, 0.02)",
  backdropFilter: "blur(20px)",
  borderRadius: "16px",
  boxShadow: "inset 0 2px 10px rgba(0, 0, 0, 0.1)",
  border: "1px solid rgba(139, 92, 246, 0.1)",
  position: "relative",

  // Custom scrollbar
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

  // Decorative elements
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "2px",
    background: "linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.7), transparent)",
    backgroundSize: "200% 100%",
    animation: `${shimmer} 6s infinite linear`,
    borderTopLeftRadius: "16px",
    borderTopRightRadius: "16px",
  },

  // Empty state
  "&:empty::after": {
    content: '"No messages yet"',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    color: "rgba(255, 255, 255, 0.4)",
    fontStyle: "italic",
    fontSize: "0.9rem",
  },

  // Message animation
  "& > *": {
    animation: `${fadeIn} 0.3s ease-out forwards`,
  },

  // Message spacing
  "& > *:not(:last-child)": {
    marginBottom: "8px",
  },
}))

// Invisible scroll anchor
const ScrollAnchor = styled(Box)({
  height: "1px",
  width: "100%",
  opacity: 0,
})

export default function ChatContent(props) {
  const ref = useRef(null)
  const dispatch = useDispatch()
  const { messages } = props

  useEffect(() => {
    ref.current.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages])

  return (
    <ChatContainer>
      {messages.length !== 0 &&
        messages?.map((message) => {
          return <ChatMessage key={message.id} message={message} />
        })}
      <ScrollAnchor ref={ref} />
    </ChatContainer>
  )
}
