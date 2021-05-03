import {
  TypedUseSelectorHook,
  useDispatch as vendorUseDispatch,
  useSelector as vendorUseSelector,
} from 'react-redux'

export const useDispatch = () => vendorUseDispatch<AppDispatch>()
export const useSelector: TypedUseSelectorHook<RootState> = vendorUseSelector
