import {
  createAction,
  createReducer,
  AnyAction,
  PayloadAction,
  combineReducers,
  createSelector,
} from '@reduxjs/toolkit'
import { ethers } from 'ethers'

const increment = createAction<number>('increment')
const decrement = createAction<number>('decrement')

function isActionWithNumberPayload(
  action: AnyAction
): action is PayloadAction<number> {
  return typeof action.payload === 'number'
}

type AddLiquidityParams = {
  sender: string
  tickLowerIndex: number
  tickUpperIndex: number
  liquidity: number
}
export const addLiquidity = createAction<AddLiquidityParams>('ADD_LIQUIDITY')

const globalReducer = createReducer(
  {
    liquidity: 0,
    sqrtPriceX96: 0,
    tick: 0,
    token0: '',
    feeGrowthGlobal0X128: 0,
    protocolFeesToken0: 0,
    token1: '',
    feeGrowthGLobal1X128: 0,
    protocolFeesToken1: 0,
  },
  builder => {
    builder.addCase(addLiquidity, (state, action) => {
      state.liquidity += action.payload.liquidity
    })
  }
)

declare global {
  type LiquidityPosition = {
    liquidity: number
    feeGrowthInside0LastX128: number
    feeGrowthInside1LastX128: number
    extra: {
      hsh: string
      lpAddress: string
      tickLowerIndex: number
      tickUpperIndex: number
    }
  }
}

const positionsReducer = createReducer({}, builder => {
  builder.addCase(addLiquidity, (state, action) => {
    // state.positions
    const hsh = ethers.utils.solidityKeccak256(
      ['address', 'int24', 'int24'],
      [
        action.payload.sender,
        action.payload.tickLowerIndex,
        action.payload.tickUpperIndex,
      ]
    )

    if (Object.keys(state).includes(hsh)) {
      state[hsh].liquidity += action.payload.liquidity
    } else {
      state[hsh] = {
        liquidity: action.payload.liquidity,
        feeGrowthInside0LastX128: 0,
        feeGrowthInside1LastX128: 0,
        extra: {
          hsh,
          lpAddress: action.payload.sender,
          tickLowerIndex: action.payload.tickLowerIndex,
          tickUpperIndex: action.payload.tickUpperIndex,
        },
      } as LiquidityPosition
    }
  })
})

const appReducer = createReducer(
  {
    counter: 0,
    sumOfNumberPayloads: 0,
    unhandledActions: 0,
  },
  builder => {
    builder
      .addCase(increment, (state, action) => {
        // action is inferred correctly here
        state.counter += action.payload
      })
      // You can chain calls, or have separate `builder.addCase()` lines each time
      .addCase(decrement, (state, action) => {
        state.counter -= action.payload
      })
      // You can apply a "matcher function" to incoming actions
      .addMatcher(isActionWithNumberPayload, (state, action) => {})
      // and provide a default case if no other handlers matched
      .addDefaultCase((state, action) => {})
  }
)

export const rootReducer = combineReducers({
  app: appReducer,
  global: globalReducer,
  positions: positionsReducer,
})

const allPositions = (state: RootState) => state.positions
const allPositionKeys = (state: RootState) => Object.keys(state.positions)

export const positionsArray = createSelector(
  allPositions,
  allPositionKeys,
  (positions, keys) => keys.map(k => positions[k])
)
