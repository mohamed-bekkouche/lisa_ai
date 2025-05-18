"use client"

import SearchIcon from "@mui/icons-material/Search"
import {
  Avatar,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  ListItem,
  ListItemAvatar,
  ListItemText,
  OutlinedInput,
  styled,
  Box,
  Typography,
  keyframes,
} from "@mui/material"
import { useEffect, useState } from "react"

// Animations keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(139, 92, 246, 0); }
  100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); }
`

// Styled components with purple theme matching notification component
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 16,
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(139, 92, 246, 0.2)",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    overflow: "hidden",
    animation: `${fadeIn} 0.3s ease-out`,
  },
}))

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.02)",
  padding: "16px 20px",
  borderBottom: "1px solid rgba(139, 92, 246, 0.1)",
}))

const StyledOutlinedInput = styled(OutlinedInput)(({ theme }) => ({
  borderRadius: 12,
  transition: "all 0.3s ease",
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",

  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(139, 92, 246, 0.2)",
    borderWidth: 1.5,
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(139, 92, 246, 0.4)",
    boxShadow: "0 0 8px rgba(139, 92, 246, 0.3)",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#8b5cf6",
    borderWidth: 2,
    boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.2)",
  },
  "& input": {
    color: "rgba(255, 255, 255, 0.9)",
    "&::placeholder": {
      color: "rgba(255, 255, 255, 0.5)",
      opacity: 1,
    },
  },
  "& .MuiInputAdornment-root": {
    color: "rgba(139, 92, 246, 0.7)",
  },
}))

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: "rgba(139, 92, 246, 0.8)",
  "&:hover": {
    backgroundColor: "rgba(139, 92, 246, 0.1)",
  },
  "&.Mui-disabled": {
    color: "rgba(139, 92, 246, 0.5)",
  },
}))

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: "8px 0",
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-track": {
    background: "rgba(0, 0, 0, 0.1)",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(139, 92, 246, 0.2)",
    borderRadius: "4px",
  },
}))

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: "8px 20px",
  transition: "all 0.2s ease",
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    background: "linear-gradient(90deg, rgba(139, 92, 246, 0.15) 0%, rgba(124, 58, 237, 0.15) 100%)",
    "& .MuiListItemText-primary": {
      color: "#fff",
      textShadow: "0 0 8px rgba(139, 92, 246, 0.5)",
    },
    "& .MuiAvatar-root": {
      boxShadow: "0 0 0 2px rgba(139, 92, 246, 0.7)",
      transform: "scale(1.05)",
    },
    "&::after": {
      opacity: 1,
      transform: "translateX(0)",
    },
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "4px",
    height: "100%",
    background: "linear-gradient(180deg, #8b5cf6, #6d28d9)",
    opacity: 0,
    transform: "translateX(-4px)",
    transition: "all 0.3s ease",
  },
  "& + &": {
    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
  },
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
  },
}))

export default function ChatContactList(props) {
  const { open, onClose, users } = props

  const [searchText, setSearchText] = useState("")
  const [elements, setElements] = useState([])

  const handleSearchInputChange = (event) => {
    setSearchText(event.target.value)
  }

  const handleSearchInputKeyUp = (event) => {
    const value = event.target.value
    if (!!value) {
      const newElements = users.filter((user) => {
        const fullName = `${user.name?.toLowerCase()}`
        return fullName?.search(value.toLowerCase()) !== -1
      })
      setElements(newElements)
    } else {
      setElements(users)
    }
  }

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleSelectedUser = (user) => () => {
    if (onClose) {
      onClose(user)
    }
  }

  useEffect(() => {
    setElements(users)
  }, [users])

  return (
    <StyledDialog
      onClose={handleClose}
      open={open}
      fullWidth={true}
      maxWidth="xs"
      PaperProps={{
        sx: {
          height: "75vh",
          maxHeight: "600px",
        },
      }}
    >
      <StyledDialogTitle>
        <Typography
          variant="subtitle1"
          sx={{
            mb: 1.5,
            color: "rgba(255, 255, 255, 0.9)",
            fontWeight: 600,
            textAlign: "center",
            background: "linear-gradient(to right, #ffffff, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          Select Contact
        </Typography>
        <FormControl variant="outlined" fullWidth={true}>
          <StyledOutlinedInput
            fullWidth={true}
            type="text"
            value={searchText}
            onChange={handleSearchInputChange}
            onKeyUp={handleSearchInputKeyUp}
            size="small"
            endAdornment={
              <InputAdornment position="end">
                <StyledIconButton disabled={true} aria-label="search" edge="end">
                  <SearchIcon />
                </StyledIconButton>
              </InputAdornment>
            }
            placeholder="Type to search..."
          />
        </FormControl>
      </StyledDialogTitle>
      <StyledDialogContent>
        {elements.length > 0 ? (
          elements.map((user) => (
            <StyledListItem key={user._id} button onClick={handleSelectedUser(user)}>
              <ListItemAvatar>
                {user?.avatar ? (
                  <StyledAvatar src={user.avatar} alt={user.name} />
                ) : (
                  <StyledAvatar>{user.name[0]}</StyledAvatar>
                )}
              </ListItemAvatar>
              <StyledListItemText primary={`${user.name}`} />
            </StyledListItem>
          ))
        ) : (
          <Box
            sx={{
              p: 3,
              textAlign: "center",
              color: "rgba(255, 255, 255, 0.6)",
              animation: `${fadeIn} 0.5s ease-out`,
            }}
          >
            <Typography variant="body2">No contacts found</Typography>
          </Box>
        )}
      </StyledDialogContent>
    </StyledDialog>
  )
}
