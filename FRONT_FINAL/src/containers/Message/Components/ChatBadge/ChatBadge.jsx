"use client"

import { IconButton, Badge, Tooltip, useTheme, Box } from "@mui/material"
import MessageIcon from "@mui/icons-material/Message"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { keyframes } from "@emotion/react"
import { alpha } from "@mui/material/styles"

// Animation de pulsation pour le badge
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(236, 72, 153, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(236, 72, 153, 0);
  }
`

// Animation de rebond pour l'icône
const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-5px);
  }
  60% {
    transform: translateY(-2px);
  }
`

export default function ChatBadge() {
  const navigate = useNavigate()
  const { notifications } = useSelector((state) => state.chat)
  const theme = useTheme()
  const hasNotifications = notifications.length > 0

  const handleClicked = () => {
    navigate("/messages")
  }

  return (
    <Tooltip
      title={hasNotifications ? `${notifications.length} nouveaux messages` : "Messages"}
      arrow
      placement="bottom"
    >
      <Box
        sx={{
          position: "relative",
          display: "inline-flex",
          "&::after": hasNotifications
            ? {
                content: '""',
                position: "absolute",
                top: -2,
                right: -2,
                width: "140%",
                height: "140%",
                borderRadius: "50%",
                animation: `${pulse} 2s infinite`,
                zIndex: -1,
              }
            : {},
        }}
      >
        <IconButton
          onClick={handleClicked}
          sx={{
            position: "relative",
            transition: "all 0.3s ease",
            background: hasNotifications
              ? `linear-gradient(135deg, ${alpha("#ec4899", 0.2)}, ${alpha("#a855f7", 0.2)})`
              : "transparent",
            "&:hover": {
              background: `linear-gradient(135deg, ${alpha("#ec4899", 0.3)}, ${alpha("#a855f7", 0.3)})`,
              transform: "scale(1.1)",
            },
            "&:active": {
              transform: "scale(0.95)",
            },
            animation: hasNotifications ? `${bounce} 2s infinite` : "none",
          }}
        >
          <Badge
            badgeContent={notifications.length}
            invisible={!hasNotifications}
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: "#ec4899",
                background: "linear-gradient(45deg, #ec4899, #a855f7)",
                color: "white",
                fontWeight: "bold",
                minWidth: "20px",
                height: "20px",
                padding: "0 6px",
                fontSize: "0.7rem",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                border: "2px solid rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <MessageIcon
              sx={{
                color: "white",
                filter: "drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2))",
                transition: "all 0.3s ease",
                fontSize: "1.5rem",
                "&:hover": {
                  color: "#f9a8d4",
                },
              }}
            />
          </Badge>
        </IconButton>
      </Box>
    </Tooltip>
  )
}
