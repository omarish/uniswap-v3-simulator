import { configureStore } from '@reduxjs/toolkit'
import { rootReducer as reducer } from './reducers'
import logger from 'redux-logger'

const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger),
})

declare global {
  type RootState = ReturnType<typeof store.getState>
  type AppDispatch = typeof store.dispatch
}

export default store
