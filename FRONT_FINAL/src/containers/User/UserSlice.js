import { createSlice } from "@reduxjs/toolkit"
import { BASE_URL } from "../../configs"
import axios from "../../helpers/axios"
import toast from "react-hot-toast"

import { t } from "i18next";

export function AsyncRejectDoctor(doctor_id) {
    return async (dispatch) => {
        dispatch(loading())

        try {
            const response = await axios.put(
                `/admin/reject-doctor/${doctor_id}`,
                {
                    baseURL: BASE_URL,
                }
                
            )
            toast(t("Doctor has been rejected"))
            
            dispatch(rejectDoctor(doctor_id))
        } catch (e) {
            const response = e.response
            if (response && response.status === 400) {
                const error = response.data.error
                dispatch(handleError({ error }))
            } else {
                const error = t("Something went wrong, Try again")
                dispatch(handleError({ error }))
            }
        }
    }
}

export function AsyncActivateDoctor(doctor_id) {
    return async (dispatch) => {
        dispatch(loading())

        try {
            const response = await axios.put(
                `/admin/activate-doctor/${doctor_id}`,
                {
                    baseURL: BASE_URL,
                }
            )
            toast(t("Doctor has been activated"))

            dispatch(activateDoctor(doctor_id))
        } catch (e) {
            const response = e.response
            if (response && response.status === 400) {
                const error = response.data.error
                dispatch(handleError({ error }))
            } else {
                const error = t("Something went wrong, Try again")
                dispatch(handleError({ error }))
            }
        }
    }
}

export function AsyncGetUsers() {
    return async (dispatch) => {
        dispatch(loading())

        try {
            const response = await axios.get(
                "/admin/users",
                {
                    baseURL: BASE_URL,
                }
            )
            const users = response.data.users
            dispatch(setUsers(users))

        } catch (e) {
            const response = e.response
            if (response && response.status === 400) {
                const error = response.data.error
                dispatch(handleError({ error }))
            } else {
                const error = t("Something went wrong, Try again")
                dispatch(handleError({ error }))
            }
        }
    }
}


const initialState = {
    inProgress: false,
    errorMessage: null,
    users:[],
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loading(state) {
            state.inProgress = true
            state.errorMessage = null
        },
        setUsers(state,action){
            state.users = action.payload
            state.users.reverse()
            state.inProgress = false
        },
        rejectDoctor(state,action)
        {
            state.users.some((user, index) => {
                if (user._id === action.payload) {
                    state.users[index] = { ...state.users[index], isActive:false }
                    return true
                }

                return false
            })
            state.inProgress = false
        },
        activateDoctor(state,action)
        {
            state.users.some((user, index) => {
                if (user._id === action.payload) {
                    state.users[index] = { ...state.users[index], isActive:true }
                    return true
                }

                return false
            })
            state.inProgress = false
        },
        handleError(state, action) {
            const { error } = action.payload
            state.errorMessage = error
            state.inProgress = false
        },
    },
})

const { handleError, loading,setUsers,activateDoctor,rejectDoctor} = userSlice.actions
export const reducer = userSlice.reducer