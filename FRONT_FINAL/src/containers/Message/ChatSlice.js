import { createSlice } from "@reduxjs/toolkit"
import axios from "../../helpers/axios"

export function fetchConversationsAsync() {

    return async (dispatch) => {
        try {
            const response = await axios.get("/message/conversations/patients")
            //dispatch(setConversations(response.data))
        } catch (e) {
            // handle errors here
        }
    }
}

export function fetchMessagesAsync(id) {

    return async (dispatch) => {
        
        try {
            dispatch(setOnFetching())
            const response = await axios.get(`/message/${id}`)
            const messages = response.data.messages
            dispatch(setMessages(messages))
        } catch (e) {
            // handle errors here
        }
    }
}

const initialState = {
    users: [],
    conversations: [],
    messages: [],
    selectedConversation:null,
    onFeteching:false,
    notifications:[],
}

const chatSlice = createSlice({
    name: "device",
    initialState,
    reducers: {
        setUsers(state, action) {
            state.users = action.payload
        },
        setConversations(state, action) {
            state.conversations = action.payload
            state.onFeteching = false
        },
        setOnFetching(state){
            state.onFeteching = true
        }
        ,
        setMessages(state, action) {
            state.messages = action.payload
            state.onFeteching = false
        },
        setSelectedConversation(state,action){
            state.selectedConversation = action.payload
        },
        clearMessages(state) {
            state.messages = []
        },

        appendSocketMessage(state, action) {
            state.messages = [...state.messages, action.payload]
        },
        appendSocketMessagePatient(state, action) { // to remove
            state.messages = [...state.messages, action.payload]
        },
        appendToNotificationMessage(state,action){
            if(!state.notifications.includes(action.payload)){
                state.notifications = [...state.notifications, action.payload]
            }
        },
        removeFromNotificationMessage(state,action){
            if(state.notifications.includes(action.payload)){
                state.notifications = state.notifications.filter(notif => notif !== action.payload)
            }
        }
    },
})

const { setUsers, setConversations, setMessages,setOnFetching } = chatSlice.actions
export const { clearMessages, setSelectedConversation,appendSocketMessage,appendSocketMessagePatient,removeFromNotificationMessage,appendToNotificationMessage } = chatSlice.actions
export const reducer = chatSlice.reducer