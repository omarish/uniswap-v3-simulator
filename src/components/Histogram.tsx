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

export const Histogram = ({ items }: { items: Array<DataPoint> }) => {
  return (
    // <FlexibleWidthXYPlot height={290}>
    <XYPlot
      margin={{ left: 60, top: 20 }}
      height={290}
      width={720}
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
    </XYPlot>
    // </FlexibleWidthXYPlot>
  )
}
