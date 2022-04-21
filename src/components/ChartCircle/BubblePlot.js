import React from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"
import { getSize } from "../../utils/chart-utils";
import getDateRange from "../../utils/getDateRange"

import Chart from "../ChartSVG/Chart"
import Axis from "../ChartAxis/Axis"
import Circles from "./Circles"

const BubblePlot = ({ data, colorMap, type, dimensions, xLabel, yLabel, xFormat, yFormat, xAccessorCol, yAccessorCol, rAccessorCol, groupByCol, popover }) => {

  const date1 = data[0][xAccessorCol]
  const date2 = data[1][xAccessorCol]
  const { format } = getDateRange(date1, date2)

  const diameter = getSize(dimensions.boundedWidth, data.length)
  const radius = diameter/2

  const xAccessor = (d) => d[xAccessorCol]
  const yAccessor = (d) => d[yAccessorCol]
  const rAccessor = (d) => d[rAccessorCol]

  const xScale = d3.scaleTime()
    .domain(d3.extent(data, xAccessor))
    .range([0, dimensions.boundedWidth])

  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice()

  const rScale = d3.scaleLinear()
    .domain(d3.extent(data, rAccessor))
    .range([0, radius])

  const colorScale = d3.scaleOrdinal()
    .domain(Object.keys(colorMap))
    .range(Object.values(colorMap))
  
  const colorAccessor = d => colorScale(d[groupByCol])
  const xAccessorScaled = d => xScale(xAccessor(d))
  const yAccessorScaled = d => yScale(yAccessor(d))
  const radiusAccessor = d => rScale(rAccessor(d))

  return (
    <div>
      <Chart dimensions={dimensions}>
        <Axis
          dimensions={dimensions}
          dimension="x"
          scale={xScale}
          formatTick={xFormat || format}
          tickSize={8}
          label={xLabel}
        />
        <Axis
          dimensions={dimensions}
          dimension="y"
          scale={yScale}
          formatTick={yFormat}
          tickSize={dimensions.boundedWidth}
          label={yLabel}
        />
        <Circles
          data={data}
          type={type}
          xAccessor={xAccessorScaled}
          yAccessor={yAccessorScaled}
          colorAccessor={colorAccessor}
          radiusAccessor={type === 'scatter' ? radius : radiusAccessor}
          mouseOver={popover}
        />
      </Chart>
    </div>
  )
}


BubblePlot.propTypes = {
  data: PropTypes.array,
  colorMap: PropTypes.object,
  type: PropTypes.string,
  dimensions: PropTypes.object,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
  xFormat: PropTypes.func,
  yFormat: PropTypes.func,
  xAccessorCol: PropTypes.string,
  yAccessorCol: PropTypes.string,
  rAccessorCol: PropTypes.string,
  groupByCol: PropTypes.string,
  popover: PropTypes.func
}

BubblePlot.defaultProps = {
  type: "scatter",
  dimensions: {boundedWidth: 1000, boundedHeight: 800},
  xLabel: "",
  yLabel: "",
  xAccessorCol: 'date',
  yAccessorCol: 'value',
  rAccessorCol: 'value',
  groupByCol: 'category'
}

export default BubblePlot