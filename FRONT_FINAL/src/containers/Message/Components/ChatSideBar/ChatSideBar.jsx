import { 
  FormControl, 
  OutlinedInput, 
  InputAdornment, 
  IconButton, 
  List,
  Typography,
  Divider,
  styled,
  Box,
  Paper,
  alpha,
  Tooltip
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ChatConversation from "../ChatConversation/ChatConversation";
import React, { useState, useEffect } from "react";
import ChatContactList from "../ChatContactList/ChatContactList";
import { useSelector } from "react-redux";

// Styled components with purple theme matching notification component
const SidebarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(20px)',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
  border: '1px solid rgba(139, 92, 246, 0.2)',
}));

const SidebarHeader = styled(Box)(({ theme }) => ({
  padding: '16px',
  background: 'rgba(255, 255, 255, 0.02)',
  borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
}));

const HeaderTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.1rem',
  marginBottom: '12px',
  color: 'white',
  textAlign: 'center',
  background: 'linear-gradient(to right, #ffffff, #8b5cf6)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textShadow: '0 2px 10px rgba(0,0,0,0.3)',
}));

const SearchContainer = styled(FormControl)(({ theme }) => ({
  marginBottom: '8px',
}));

const StyledOutlinedInput = styled(OutlinedInput)(({ theme }) => ({
  borderRadius: '12px',
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(139, 92, 246, 0.2)',
    borderWidth: 1.5,
  },
  
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(139, 92, 246, 0.4)',
  },
  
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#8b5cf6',
    borderWidth: 2,
    boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.15)',
  },
  
  '& input': {
    color: 'rgba(255, 255, 255, 0.9)',
    padding: '10px 14px',
    fontSize: '0.9rem',
    '&::placeholder': {
      color: 'rgba(255, 255, 255, 0.5)',
      opacity: 1,
    },
  },
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  color: '#8b5cf6',
  background: 'rgba(139, 92, 246, 0.1)',
  transition: 'all 0.2s ease',
  
  '&:hover': {
    background: 'rgba(139, 92, 246, 0.2)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  
  '&:active': {
    transform: 'translateY(0)',
  },
}));

const ConversationList = styled(Box)(({ theme }) => ({
  flexGrow: 10,
  overflowY: 'auto',
  scrollbarWidth: 'thin',
  scrollbarColor: 'rgba(139, 92, 246, 0.5) rgba(255, 255, 255, 0.05)',
  
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  
  '&::-webkit-scrollbar-track': {
    background: 'rgba(0, 0, 0, 0.1)',
  },
  
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: '4px',
  },
}));

const EmptyState = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '32px 16px',
  height: '100%',
  color: 'rgba(255, 255, 255, 0.5)',
  textAlign: 'center',
}));

export default function ChatSideBar(props) {
  const { users, onConversationSelect } = props;
  const [searchText, setSearchText] = useState("");
  const [elements, setElements] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [openContactList, setOpenContactList] = useState(false);
  const { role, name, id } = useSelector((state) => state.login);

  const handleSearchInputChange = (event) => {
    setSearchText(event.target.value);
    
    if (event.target.value) {
      const filtered = users.filter((user) => {
        const fullName = user.name?.toLowerCase() || '';
        return fullName.includes(event.target.value.toLowerCase());
      });
      setElements(filtered);
    } else {
      setElements(users);
    }
  };

  const handleAddContact = () => {
    setOpenContactList(true);
  };

  const handleContactSelected = (contact) => {
    setOpenContactList(false);
    // Add logic to handle new contact selection if needed
  };

  useEffect(() => {
    setElements(users);
  }, [users]);

  return (
    <SidebarContainer>
      <SidebarHeader>
        <HeaderTitle variant="h6">
          Messages
        </HeaderTitle>
        
        <SearchContainer variant="outlined" fullWidth>
          <StyledOutlinedInput
            fullWidth
            placeholder="Search conversations..."
            value={searchText}
            onChange={handleSearchInputChange}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'rgba(139, 92, 246, 0.7)' }} />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <Tooltip title="New conversation">
                  <ActionButton
                    edge="end"
                    onClick={handleAddContact}
                    size="small"
                  >
                    <AddIcon />
                  </ActionButton>
                </Tooltip>
              </InputAdornment>
            }
          />
        </SearchContainer>
      </SidebarHeader>
      
      <ConversationList>
        {elements.length > 0 ? (
          <List disablePadding>
            {elements
              ?.filter((element) => element._id !== id)
              .map((user, index) => (
                <ChatConversation
                  key={user._id || index}
                  user={user}
                  selected={selectedConversation === index}
                  clicked={() => {
                    setSelectedConversation(index);
                    if (onConversationSelect) {
                      onConversationSelect(user);
                    }
                  }}
                />
              ))}
          </List>
        ) : (
          <EmptyState>
            <Typography variant="body2" sx={{ mb: 2 }}>
              No conversations found
            </Typography>
            <Typography variant="caption">
              Start a new conversation or try a different search
            </Typography>
          </EmptyState>
        )}
      </ConversationList>
      
      <ChatContactList
        open={openContactList}
        onClose={handleContactSelected}
        users={users.filter(user => user._id !== id)}
      />
    </SidebarContainer>
  );
}
