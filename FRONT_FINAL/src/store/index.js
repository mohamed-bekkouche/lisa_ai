import { configureStore } from '@reduxjs/toolkit'
import { reducers } from '../containers/reducers'

export const store = configureStore({
    reducer: reducers
})