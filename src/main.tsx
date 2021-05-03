import clsx from 'clsx'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, useDispatch } from 'react-redux'
import { Button } from './components'
import { useSelector } from './hooks'
import { addLiquidity, positionsArray } from './redux/reducers'
import store from './redux/store'
import './app.css'

const safeFmt = (x: number | undefined) => {
  if (x) {
    return x.toLocaleString()
  }
}

const Card = ({ title, children = undefined }) => (
  <div>
    <h2 className="font-bold text-gray-800 mb-1">{title}</h2>
    <div className="bg-white p-2 mb-4 border border-gray-200">{children}</div>
  </div>
)

const colAlign = (col: string) => {
  if (col === 'c') {
    return 'text-center'
  } else if (col === 'r') {
    return 'text-right'
  } else {
    return 'text-left'
  }
}

const Table = ({
  header = undefined,
  children = undefined,
  align = undefined,
}) => {
  const alignment = React.useMemo(() => {
    if (align) {
      return align.toLowerCase().split('').map(colAlign)
    }
  }, [align])

  return (
    <table className="min-w-full divide-y divide-gray-200">
      {header && (
        <thead>
          <tr>
            {header.map((h, index) => (
              <th
                scope="col"
                // className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider"
                key={index}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
      )}
      {children}
    </table>
  )
}

const Var = ({ name, solType = undefined, notation = undefined }) => {
  return (
    <div>
      <code className="tracking-tight">{name}</code>
      {solType && (
        <code className="text-gray-400 text-sm tracking-tight ml-1">
          {solType}
        </code>
      )}
      {notation}
    </div>
  )
}

const Value = ({ children = undefined }) => {
  return <code className="tracking-tight">{children}</code>
}

const GlobalStateCard = () => {
  const globalState = useSelector(state => state.global)

  const rows = [
    [
      <Var name="liquidity" solType="uint128" />,
      safeFmt(globalState.liquidity),
    ],
    [<Var name="sqrtPriceX96" solType="uint160" />, globalState.sqrtPriceX96],
    [<Var name="tick" solType="int24" />, globalState.tick],

    [<Var name="token0" solType="address" />, globalState.token0],
    [
      <Var name="feeGrowthGlobal0X128" solType="uint256" />,
      globalState.feeGrowthGlobal0X128,
    ],
    [
      <Var name="protocolFees.token0" solType="uint128" />,
      globalState.protocolFeesToken0,
    ],

    [<Var name="token1" solType="address" />, globalState.token1],
    [
      <Var name="feeGrowthGlobal1X128" solType="uint256" />,
      globalState.feeGrowthGLobal1X128,
    ],
    [
      <Var name="protocolFees.token1" solType="uint128" />,
      globalState.protocolFeesToken1,
    ],
  ]

  return (
    <Card title="Global State">
      <Table>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={idx}
              className={clsx({
                'bg-white': idx % 2 === 1,
                'bg-gray-50': idx % 2 === 0,
              })}
            >
              <td className="p-1">{row[0]}</td>
              <td className="p-1 text-right">{row[1]}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  )
}

const TicksCard = () => {
  const header = [
    <Var name="tickIndex" solType="int24" />,
    <Var name="liquidityNet" solType="int128" />,
    <Var name="liquidityGross" solType="uint128" />,
    <Var name="feeGrowthOutside0X128" solType="uint256" />,
    <Var name="feeGrowthOutside1X128" solType="uint256" />,
  ]
  return (
    <Card title="Ticks">
      <Table header={header}></Table>
    </Card>
  )
}

const PositionsCard = ({ items }: { items: Array<LiquidityPosition> }) => {
  return (
    <Card title="Positions">
      <table className="w-full">
        <thead>
          <tr>
            <th colSpan={3} className="text-xs text-gray-600">
              Key (gets abiencoded and hashed)
            </th>
            <th colSpan={3} className="text-xs text-gray-600">
              Position struct
            </th>
          </tr>
          <tr>
            <th>
              <Var name="lp" solType="address" />
            </th>
            <th>
              <Var name="tickLowerIndex" solType="int24" />
            </th>
            <th>
              <Var name="tickUpperIndex" solType="int24" />
            </th>
            <th>
              <Var name="liquidity" solType="uint128" />
            </th>
            <th>
              <Var name="feeGrowthInside0LastX128" solType="uint256" />
            </th>
            <th>
              <Var name="feeGrowthInside1LastX128" solType="uint256" />
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.extra.hsh}>
              <td className="text-center">
                <Value>{item.extra.lpAddress}</Value>
              </td>
              <td className="text-center">{item.extra.tickLowerIndex}</td>
              <td className="text-center">{item.extra.tickUpperIndex}</td>
              <td className="text-center">{safeFmt(item.liquidity)}</td>
              <td className="text-center">{item.feeGrowthInside0LastX128}</td>
              <td className="text-center">{item.feeGrowthInside1LastX128}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}

const RANDOM_ETH_ADDRESS = '0xb753504939322f9302E3070A35FD6B34FE48F50C'

import random from 'random'

const addRandomLiquidity = () =>
  addLiquidity({
    sender: RANDOM_ETH_ADDRESS,
    tickLowerIndex: random.int(0, 2),
    tickUpperIndex: random.int(10, 12),
    liquidity: random.int(100, 200),
  })

const App = () => {
  const dispatch = useDispatch()

  const handleAddLiquidity = () => dispatch(addRandomLiquidity())

  const positions = useSelector(positionsArray)

  return (
    <div className="px-8 py-4">
      <div className="flex justify-between">
        <h1 className="text-4xl font-medium mb-4">Uniswap V3 Simulator</h1>
        <div>
          <Button onClick={handleAddLiquidity}>Add Liquidity</Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <GlobalStateCard />
        <Card title="Histogram">im a chart</Card>
      </div>
      <PositionsCard items={positions} />
      <TicksCard />
      <hr />
      <p>
        an <a href="http://twitter.com/omarish">@omarish</a> production
      </p>
    </div>
  )
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
