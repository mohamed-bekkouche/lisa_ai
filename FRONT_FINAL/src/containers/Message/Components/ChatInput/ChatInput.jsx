"use client"

import { FormControl, OutlinedInput, InputAdornment, IconButton, styled, keyframes } from "@mui/material"
import SendIcon from "@mui/icons-material/Send"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"

// Animations keyframes
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-2px); }
  100% { transform: translateY(0px); }
`

// Styled components with purple theme matching notification component
const StyledFormControl = styled(FormControl)(({ theme }) => ({
  margin: "8px 0",
  position: "relative",

  "&::before": {
    content: '""',
    position: "absolute",
    top: -1,
    left: "5%",
    width: "90%",
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent)",
    zIndex: 1,
  },
}))

const StyledOutlinedInput = styled(OutlinedInput)(({ theme, disabled }) => ({
  borderRadius: "16px",
  transition: "all 0.3s ease",
  background: "rgba(255, 255, 255, 0.02)",
  backdropFilter: "blur(20px)",

  // Border styling
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(139, 92, 246, 0.2)",
    borderWidth: 1.5,
    transition: "all 0.3s ease",
  },

  // Hover state
  "&:hover:not(.Mui-disabled) .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(139, 92, 246, 0.4)",
    boxShadow: "0 0 8px rgba(139, 92, 246, 0.2)",
  },

  // Focus state
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#8b5cf6",
    borderWidth: 2,
    boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.15)",
  },

  // Disabled state
  "&.Mui-disabled": {
    opacity: 0.7,
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255, 255, 255, 0.1)",
    },
  },

  // Input text styling
  "& textarea": {
    color: "rgba(255, 255, 255, 0.9)",
    padding: "12px 14px",
    fontSize: "0.95rem",
    lineHeight: 1.5,
    maxHeight: "120px",
    "&::placeholder": {
      color: "rgba(255, 255, 255, 0.5)",
      opacity: 1,
    },
  },

  // Adornment styling
  "& .MuiInputAdornment-root": {
    marginRight: "4px",
  },
}))

const SendButtonContainer = styled("div")(({ theme, active }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.3s ease",
  animation: active ? `${float} 2s infinite ease-in-out` : "none",
}))

const StyledIconButton = styled(IconButton)(({ theme, disabled }) => ({
  color: disabled ? "rgba(255, 255, 255, 0.3)" : "#8b5cf6",
  background: disabled
    ? "transparent"
    : "linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(124, 58, 237, 0.15) 100%)",
  transition: "all 0.3s ease",
  padding: "8px",

  // Hover state
  "&:hover:not(.Mui-disabled)": {
    background: "linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(124, 58, 237, 0.3) 100%)",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 8px rgba(139, 92, 246, 0.2)",
  },

  // Active state
  "&:active:not(.Mui-disabled)": {
    transform: "translateY(0)",
    boxShadow: "0 2px 4px rgba(139, 92, 246, 0.2)",
  },

  // Icon styling
  "& .MuiSvgIcon-root": {
    fontSize: "1.2rem",
    transition: "transform 0.2s ease",
  },

  // Hover icon animation
  "&:hover:not(.Mui-disabled) .MuiSvgIcon-root": {
    transform: "rotate(-15deg)",
  },

  // Disabled state
  "&.Mui-disabled": {
    background: "transparent",
  },
}))

export default function ChatInput(props) {
  const [activeSendButton, setActiveSendButton] = useState(false)
  const [message, setMessage] = useState("")
  const { onSend, disabled, clicked } = props
  const { t } = useTranslation()

  useEffect(() => {
    setActiveSendButton(!!message)
  }, [message])

  const handleSendButtonClicked = () => {
    if (onSend && message.trim()) {
      onSend(message)
      setMessage("")
    }
  }

  const handleMessageInputChange = (event) => {
    setMessage(event.target.value)
  }

  const handleMessageKeyDown = (event) => {
    if (!message) {
      return
    }

    if (event.shiftKey) {
      return
    }

    if (event.keyCode === 13) {
      handleSendButtonClicked()
      event.preventDefault()
    }
  }

  const handleMessageInputClicked = () => {
    if (clicked) {
      clicked()
    }
  }

  return (
    <StyledFormControl variant="outlined" fullWidth={true}>
      <StyledOutlinedInput
        disabled={disabled}
        autoFocus={true}
        fullWidth={true}
        type="text"
        multiline={true}
        maxRows={4}
        value={message}
        onChange={handleMessageInputChange}
        onKeyDown={handleMessageKeyDown}
        onClick={handleMessageInputClicked}
        endAdornment={
          <InputAdornment position="end">
            <SendButtonContainer active={activeSendButton && !disabled}>
              <StyledIconButton
                onClick={handleSendButtonClicked}
                disabled={!activeSendButton || disabled}
                aria-label="send message"
                edge="end"
              >
                <SendIcon />
              </StyledIconButton>
            </SendButtonContainer>
          </InputAdornment>
        }
        placeholder={t("Type a message...")}
      />
    </StyledFormControl>
  )
}
