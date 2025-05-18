import { createSlice } from "@reduxjs/toolkit"
import axios from "../../helpers/axios"
import toast from "react-hot-toast"
import { t } from "i18next";


export function AsyncAdminApproveAppointment(id) {
    return async (dispatch) => {
        dispatch(fetching())

        try {
            const response = await axios.put(
                `/admin/appointments/approve/${id}`,
            )
            const data = {
                id:id,
                status:"Approved"
            }
            toast(t("Appointment has been approved"))
            dispatch(doWithAppointment(data))
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

export function AsyncAdminRefuseAppointment(id) {
    return async (dispatch) => {
        dispatch(fetching())

        try {
            const response = await axios.put(
                `/admin/appointments/refuse/${id}`,
            )
            const data = {
                id:id,
                status:"Refused"
            }
            toast(t("Appointment has been refused"))
            dispatch(doWithAppointment(data))
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

export function AsyncDeleteAppointment(id) {
    return async (dispatch) => {
        dispatch(fetching())

        try {
            const response = await axios.delete(
                `/patient/cancel-appointment/${id}`,
            )
            const data = {
                id:id,
                status:"Cancelled"
            }
            toast(t("Appointment has been cancelled"))
            dispatch(doWithAppointment(data))

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
export function AsyncEditAppointment(id,date,time,status) {
    return async (dispatch) => {
        dispatch(editing())

        try {
            const response = await axios.put(
                `/patient/reschedule-appointment/${id}`,
                {
                    date,
                    time,
                    status,
                }
            )
            const appointment = response.data.data
            toast(t("Appointment has been rescheduled"))
            dispatch(editAppointment(appointment))

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

export function AsyncCreateAppointment(date,time) {
    return async (dispatch) => {
        dispatch(fetching())

        try {
            const response = await axios.post(
                "/patient/take-appointment",
                {
                    date,
                    time,
                }
            )
            const appointment = response.data.appointment
            toast(t("Appointment has been created"))
            dispatch(addAppointment(appointment))

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

export function AsyncGetAppointments() {
    return async (dispatch) => {
        dispatch(fetching())

        try {
            const response = await axios.get(
                "/admin/appointments",
            )
            const appointments = response.data.appointments
            dispatch(setAppointments(appointments))

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

export function AsyncGetPatientAppointments() {
    return async (dispatch) => {
        dispatch(fetching())

        try {
            const response = await axios.get(
                "/patient/appointments",
            )
            const appointments = response.data.appointments
            dispatch(setAppointments(appointments))

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
    appointments: [],
}

const appointmentSlice = createSlice({
    name: "appointment",
    initialState,
    reducers: {
        fetching(state) {
            state.fetchingInProgress = true
        },
        editing(state) {
            state.editInProgress = true
        },
        setAppointments(state, action) {
            state.appointments = action.payload
            state.appointments.reverse()
            state.fetchingInProgress = false
        },
        addAppointment(state,action){
            state.appointments =[...state.appointments,action.payload]
            state.fetchingInProgress = false
        },
        deleteAppointment(state,action){
            state.appointments =[...state.appointments.filter((appointment) => appointment._id !== action.payload)]
            state.fetchingInProgress = false
        },
        doWithAppointment(state, action) {
            state.appointments.some((appointment, index) => {
                if (appointment._id === action.payload.id) {
                    state.appointments[index] = { ...state.appointments[index], status:action.payload.status }
                    return true
                }

                return false
            })
            state.editInProgress = false
        },
        editAppointment(state, action) {
            state.appointments.some((appointment, index) => {
                if (appointment._id === action.payload._id) {
                    state.appointments[index] = { ...state.appointments[index], ...action.payload }
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

const { fetching, setAppointments,handleErrors,addAppointment,deleteAppointment,editing,editAppointment,doWithAppointment} = appointmentSlice.actions
export const reducer = appointmentSlice.reducer