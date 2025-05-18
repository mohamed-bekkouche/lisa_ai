import { createSlice } from "@reduxjs/toolkit"
import axios from "../../helpers/axios"
import { t } from "i18next";

export function AsyncReadAllNotifications() {
    return async (dispatch) => {
        dispatch(fetching())
        try {
            const response = await axios.put(
                "/notification/read-all",
            )
            dispatch(readAllNotifications())

        } catch (e) {
            const response = e.response
            if (response && response.status === 400) {
                const error = response.data.error
                dispatch(handleErrors({ error }))
            } else {
                const error = t("Something went wrong, Try again")
                dispatch(handleErrors({ error }))
            }
        }
    }
}

export function AsyncReadNotification(id) {
    return async (dispatch) => {
        dispatch(fetching())
        const params = { read:false };
        try {
            const response = await axios.put(
                `/notification/read/${id}`,
            )
            dispatch(editNotification(response.data))

        } catch (e) {
            const response = e.response
            if (response && response.status === 400) {
                const error = response.data.error
                dispatch(handleErrors({ error }))
            } else {
                const error = t("Something went wrong, Try again")
                dispatch(handleErrors({ error }))
            }
        }
    }
}

export function AsyncGetNotifications() {
    return async (dispatch) => {
        dispatch(fetching())
        const params = { read:false };
        try {
            const response = await axios.get(
                "/notification",
            )
            const notifications = response.data.notifications
            dispatch(setNotifications(notifications))

        } catch (e) {
            const response = e.response
            if (response && response.status === 400) {
                const error = response.data.error
                dispatch(handleErrors({ error }))
            } else {
                const error = t("Something went wrong, Try again")
                dispatch(handleErrors({ error }))
            }
        }
    }
}

const initialState = {
    errorMessage: null,
    fetchingInProgress: false,
    editInProgress: false,
    notifications: [],
}

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        fetching(state) {
            state.fetchingInProgress = true
        },
        editing(state) {
            state.editInProgress = true
        },
        setNotifications(state, action) {
            state.notifications = action.payload
            state.notifications.reverse()
            state.fetchingInProgress = false
        },
        readAllNotifications(state){
            state.notifications.forEach((notification)=>{
                notification.read = true
            })
            state.editInProgress = false
        },
        editNotification(state, action) {
            state.notifications.some((notification, index) => {
                if (notification._id === action.payload._id) {
                    state.notifications[index] = { ...state.notifications[index], ...action.payload }
                    return true
                }

                return false
            })
            state.editInProgress = false
        },
        handleErrors(state, action) {
            state.errorMessage = action.payload.error
            state.fetchingInProgress = false
            state.editInProgress = false
        }
    },
})

const { fetching,handleErrors,setNotifications,editNotification,readAllNotifications} = notificationSlice.actions
export const reducer = notificationSlice.reducer