import React from 'react'

import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalBarSeries,
  VerticalBarSeriesCanvas,
  LabelSeries,
  FlexibleXYPlot,
  FlexibleWidthXYPlot,
} from 'react-vis'

declare global {
  type DataPoint = {
    x: number
    y: number
  }
}

const BarSeries = VerticalBarSeries

export const Histogram = ({
  items,
  className = undefined,
}: {
  items: Array<DataPoint>
  className: any
}) => {
  return (
    <div className="Chart-Wrapper">
      <FlexibleWidthXYPlot
        height={288}
        className={className}
        margin={{ left: 60, top: 20, right: 20 }}
        xDistance={20}
      >
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis />
        <YAxis />

        <BarSeries
          className="vertical-bar-series-example"
          data={items}
          color="#463DE1"
          // color="blue"
        />
      </FlexibleWidthXYPlot>
    </div>
  )
}
