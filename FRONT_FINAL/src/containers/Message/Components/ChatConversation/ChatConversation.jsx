"use client"

import { Avatar, ListItemAvatar, ListItemButton, ListItemText, Typography, styled, keyframes, Box } from "@mui/material"
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked"
import { useSelector } from "react-redux"

// Animations keyframes
const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 0.7; }
`

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`

// Styled components with purple theme matching notification component
const StyledListItemButton = styled(ListItemButton)(({ theme, selected }) => ({
  borderRadius: "12px",
  margin: "4px 0",
  padding: "8px 16px",
  transition: "all 0.2s ease",
  position: "relative",
  overflow: "hidden",

  // Normal state
  background: selected
    ? "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%)"
    : "transparent",

  // Hover state
  "&:hover": {
    background: selected
      ? "linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(124, 58, 237, 0.25) 100%)"
      : "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)",

    "& .MuiAvatar-root": {
      boxShadow: "0 0 0 2px rgba(139, 92, 246, 0.7)",
      transform: "scale(1.05)",
    },

    "& .MuiListItemText-primary": {
      color: selected ? "#fff" : "rgba(255, 255, 255, 0.9)",
    },
  },

  // Selected indicator
  "&::after": {
    content: '""',
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    width: "3px",
    background: selected ? "linear-gradient(180deg, #8b5cf6, #6d28d9)" : "transparent",
    opacity: selected ? 1 : 0,
    transition: "opacity 0.3s ease",
  },

  // Divider styling
  "& + &": {
    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
  },

  // Selected state shimmer effect
  ...(selected && {
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent)",
      backgroundSize: "200% 100%",
      animation: `${shimmer} 3s infinite linear`,
      pointerEvents: "none",
    },
  }),
}))

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  background: "linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%)",
  border: "2px solid transparent",
  boxShadow: "0 0 0 1px rgba(139, 92, 246, 0.3)",
  transition: "all 0.3s ease",
  color: "white",
  fontWeight: "bold",
}))

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  "& .MuiListItemText-primary": {
    color: "rgba(255, 255, 255, 0.85)",
    fontWeight: 500,
    transition: "all 0.2s ease",
    fontSize: "0.95rem",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  "& .MuiListItemText-secondary": {
    display: "flex",
    alignItems: "center",
  },
}))

const NotificationDot = styled(RadioButtonCheckedIcon)(({ theme }) => ({
  color: "#8b5cf6",
  animation: `${pulse} 2s infinite ease-in-out`,
  marginLeft: "8px",
  filter: "drop-shadow(0 0 2px rgba(139, 92, 246, 0.7))",
}))

const UserName = styled(Typography)(({ theme, hasNotification }) => ({
  WebkitBackgroundClip: hasNotification ? "text" : "unset",
  WebkitTextFillColor: hasNotification ? "transparent" : "unset",
  fontWeight: hasNotification ? 600 : 500,
}))

export default function ChatConversation(props) {
  const { user, clicked, selected } = props
  const { notifications, selectedConversation } = useSelector((state) => state.chat)

  const hasNotification = notifications.includes(user._id) && selectedConversation?._id !== user._id

  return (
    <StyledListItemButton divider={true} selected={selected} onClick={clicked}>
      <ListItemAvatar>
        {user?.avatar ? (
          <StyledAvatar src={user.avatar} alt={user.name} />
        ) : (
          <StyledAvatar>{user.name[0]}</StyledAvatar>
        )}
      </ListItemAvatar>
      <StyledListItemText
        primary={
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <UserName variant="body1" hasNotification={hasNotification}>
              {user.name}
            </UserName>
            {hasNotification && <NotificationDot sx={{ fontSize: 10 }} />}
          </Box>
        }
      />
    </StyledListItemButton>
  )
}
