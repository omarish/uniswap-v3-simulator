import React from "react";
import ReactDOM from "react-dom";
import "./app.css";

const Card = ({ title, children = undefined }) => (
  <div className="bg-white p-2 mb-4 border border-gray-200">
    <h2 className="text-xl font-medium mb-2">{title}</h2>
    {children}
  </div>
);

const Table = ({ header = [], children = undefined }) => (
  <table className="w-full">
    <thead>
      <tr>
        {header.map((h) => (
          <th key={h}>{h}</th>
        ))}
      </tr>
    </thead>
    {children}
  </table>
);

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
  );
};

const GlobalStateCard = () => {
  const rows = [
    [<Var name="liquidity" solType="uint128" />, 0],
    [<Var name="sqrtPriceX96" solType="uint160" />, 0],
    [<Var name="tick" solType="int24" />, 0],

    [<Var name="token0" solType="address" />, "0x"],
    [<Var name="feeGrowthGlobal0X128" solType="uint256" />, 0],
    [<Var name="protocolFees.token0" solType="uint128" />, 0],

    [<Var name="token1" solType="address" />, "0x"],
    [<Var name="feeGrowthGlobal1X128" solType="uint256" />, 0],
    [<Var name="protocolFees.token1" solType="uint128" />, 0],
  ];

  return (
    <Card title="Global State">
      <Table>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              <td>{row[0]}</td>
              <td>{row[1]}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
};

const TicksCard = () => {
  const header = [
    <Var name="tickIndex" solType="int24" />,
    <Var name="liquidityNet" solType="int128" />,
    <Var name="liquidityGross" solType="uint128" />,
    <Var name="feeGrowthOutside0X128" solType="uint256" />,
    <Var name="feeGrowthOutside1X128" solType="uint256" />,
  ];
  return (
    <Card title="Ticks">
      <Table header={header}></Table>
    </Card>
  );
};

const PositionsCard = () => {
  return (
    <Card title="Positions">
      <table className="w-full">
        <thead>
          <tr>
            <th colSpan={3}>Key (run through abiencode and hashed)</th>
            <th colSpan={3}>Position struct</th>
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
      </table>
    </Card>
  );
};

const App = () => {
  return (
    <div className="px-8 py-4">
      <h1 className="text-4xl font-medium mb-4">Uniswap V3 Simulator</h1>
      <div className="grid grid-cols-2 gap-4">
        <GlobalStateCard />
        <Card title="Histogram">im a chart</Card>
      </div>
      <PositionsCard />
      <TicksCard />
      <hr />
      <p>
        an <a href="http://twitter.com/omarish">@omarish</a> production
      </p>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
