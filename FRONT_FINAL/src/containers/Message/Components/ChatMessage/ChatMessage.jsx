"use client"

import { ListItem, Avatar, ListItemAvatar, Typography, styled, Box, Paper } from "@mui/material"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

// Styled components with purple theme matching notification component
const MessageContainer = styled("div")(({ theme, isAdmin }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: isAdmin ? "flex-start" : "flex-end",
  marginBottom: "8px",
  width: "100%",
}))

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: "4px 8px",
  width: "100%",
  display: "flex",
  justifyContent: "flex-start",
}))

const MessageBubble = styled(Paper)(({ theme, isAdmin }) => ({
  padding: "10px 16px",
  borderRadius: isAdmin ? "18px 18px 18px 4px" : "18px 18px 4px 18px",
  background: isAdmin
    ? "linear-gradient(135deg, rgba(76, 29, 149, 0.1) 0%, rgba(91, 33, 182, 0.15) 100%)"
    : "linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(124, 58, 237, 0.2) 100%)",
  boxShadow: "0 2px 6px rgba(109, 40, 217, 0.15)",
  border: "1px solid rgba(139, 92, 246, 0.2)",
  backdropFilter: "blur(10px)",
  width: "100%",
}))

const StyledAvatar = styled(Avatar)(({ theme, isAdmin }) => ({
  background: isAdmin
    ? "linear-gradient(135deg, #4c1d95 0%, #6d28d9 100%)"
    : "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
  color: "white",
  fontWeight: "bold",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  border: "2px solid rgba(139, 92, 246, 0.3)",
}))

const MessageHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "baseline",
  gap: "8px",
  marginBottom: "4px",
}))

const SenderName = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: "#8b5cf6",
}))

const TimeStamp = styled(Typography)(({ theme }) => ({
  color: "rgba(139, 92, 246, 0.7)",
  fontSize: "0.75rem",
  marginLeft: "8px",
}))

const MessageContent = styled(Typography)(({ theme }) => ({
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  color: "rgba(255, 255, 255, 0.9)",
  lineHeight: 1.5,
  fontFamily: "inherit",
}))

const MessageWrapper = styled(Box)(({ theme, isAdmin }) => ({
  display: "flex",
  width: "100%",
  flexDirection: isAdmin ? "row" : "row-reverse",
  alignItems: "flex-start",
}))

const ContentWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flex: 1,
}))

export default function ChatMessage(props) {
  const { message } = props
  const { role, name, id } = useSelector((state) => state.login)
  const [patientName, setPatientName] = useState(null)
  const { users } = useSelector((state) => state.user)

  const isAdmin = message.sender === "admin"

  const getName = () => {
    let patient = users.filter((user) => user._id === message.patientId)
    if (patient.length === 1) {
      patient = patient[0]
      setPatientName(patient.name)
    }
  }

  useEffect(() => {
    getName()
  }, [])

  // Determine the display name
  let displayName = ""
  if (message?.sender === "patient" && (role === "Patient" || role === "Doctor")) {
    displayName = name
  } else if (message?.sender === "admin") {
    displayName = "Admin"
  } else if (message?.sender === "patient" && message.patientId !== id && role === "Admin") {
    displayName = patientName
  }

  return (
    <MessageContainer isAdmin={isAdmin}>
      <StyledListItem>
        <MessageWrapper isAdmin={isAdmin}>
          <ListItemAvatar sx={{ minWidth: "40px", mx: 1 }}>
            {message?.sender && <StyledAvatar isAdmin={isAdmin}>{message?.sender[0]?.toUpperCase()}</StyledAvatar>}
          </ListItemAvatar>

          <ContentWrapper>
            <MessageBubble isAdmin={isAdmin}>
              <MessageHeader>
                <SenderName variant="subtitle2">{displayName}</SenderName>
                <TimeStamp variant="caption">{message?.timestamps}</TimeStamp>
              </MessageHeader>

              <MessageContent variant="body2">{message.content}</MessageContent>
            </MessageBubble>
          </ContentWrapper>
        </MessageWrapper>
      </StyledListItem>
    </MessageContainer>
  )
}
