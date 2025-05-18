import { reducer as AppointmentReducer } from "./Appointment/AppointmentSlice"
import { reducer as UserReducer} from "./User/UserSlice"
import {reducer as LoginReducer} from "./Login/LoginSlice"
import {reducer as NotificationReducer} from "./Notification/NotificationSlice"
import {reducer as ScanReducer} from "./Scan/ScanSlice"
import {reducer as ChatReducer} from "./Message/ChatSlice"
import {reducer as PaymentReducer} from "./Payment/PaymentSlice"

export const reducers = {
    appointment: AppointmentReducer,
    login:LoginReducer,
    user:UserReducer,
    notification:NotificationReducer,
    scan:ScanReducer,
    chat:ChatReducer,
    payment:PaymentReducer,
}