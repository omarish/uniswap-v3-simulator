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

declare global {
  type Tick = {
    liquidityNet: number
    liquidityGross: number
    feeGrowthOutside0X128: number
    feeGrowthOutside1X128: number
    _tickIndex: number
  }
}

const ticksReducer = createReducer({}, builder => {
  builder.addCase(addLiquidity, (state, action) => {
    const { tickLowerIndex, tickUpperIndex } = action.payload
    if (Object.keys(state).includes(tickLowerIndex.toString())) {
      state[tickLowerIndex.toString()].liquidityNet += action.payload.liquidity
    } else {
      state[tickLowerIndex.toString()] = {
        liquidityNet: action.payload.liquidity,
        liquidityGross: 0,
        feeGrowthOutside0X128: 0,
        feeGrowthOutside1X128: 0,
        _tickIndex: tickLowerIndex,
      } as Tick
    }

    if (Object.keys(state).includes(tickUpperIndex.toString())) {
      state[tickUpperIndex.toString()].liquidityNet -= action.payload.liquidity
    } else {
      state[tickUpperIndex.toString()] = {
        liquidityNet: -1 * action.payload.liquidity,
        liquidityGross: 0,
        feeGrowthOutside0X128: 0,
        feeGrowthOutside1X128: 0,
        _tickIndex: tickUpperIndex,
      } as Tick
    }
  })
})

export const rootReducer = combineReducers({
  global: globalReducer,
  positions: positionsReducer,
  ticks: ticksReducer,
})

const allPositions = (state: RootState) => state.positions
const allPositionKeys = (state: RootState) => Object.keys(state.positions)

export const positionsArray = createSelector(
  allPositions,
  allPositionKeys,
  (positions, keys) => keys.map(k => positions[k])
)

const allTicks = (state: RootState) => state.ticks
const allTicksKeys = (state: RootState) => Object.keys(state.ticks)
const allTickIndexesAsNumbers = (state: RootState) =>
  Object.keys(state.ticks).map(x => parseInt(x, 10))

export const ticksArray = createSelector(
  allTicks,
  allTicksKeys,
  (ticks, keys) => {
    return keys.map(key => ticks[key])
  }
)

export const ticksArrayForChart = createSelector(
  allTicks,
  allTickIndexesAsNumbers,
  (ticks, keys) => {
    const arr = []
    let acc = 0

    const min = Math.min(...keys)
    const max = Math.max(...keys)

    for (let tickIndex = min; tickIndex < max; tickIndex++) {
      if (Object.keys(ticks).includes(tickIndex.toString())) {
        const tick = ticks[tickIndex.toString()] as Tick
        acc += tick.liquidityNet
      }
      arr.push({
        x: tickIndex,
        y: acc,
      })
    }
    return arr
  }
)
