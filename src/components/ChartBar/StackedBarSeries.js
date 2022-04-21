import React from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"
import { getSize } from "../../utils/chart-utils";

import Chart from "../ChartSVG/Chart"
import Axis from "../ChartAxis/Axis"
import Bar from "./Bar"

const StackedBarSeries = ({ data, colorMap, dimensions, xLabel, yLabel, xFormat, yFormat, groupByCol, groupByCol2, barDirection }) => {

  const nested2 = d3.group(data, d=>d[groupByCol], d=>d[groupByCol2])
  const nested =  d3.group(data, d=>d[groupByCol])
  const range = Array.from(nested.keys())
  const barWidth = getSize(dimensions.boundedWidth, range.length)
  const keys = Object.keys(colorMap)

  const rawNew = []
  range.forEach(d=> {
    let result = {}
    for (var i = 0; i < keys.length; i++) {
      let cat = nested2.get(d).get(keys[i])
      result[keys[i]] = cat ? cat.length : 0
    }

    let obj = {category : d}
    rawNew.push({...obj, ...result})
  })

  // Constructs a stack layout based on data 
  const stackedData = d3.stack().keys(keys)(rawNew)
  stackedData.map((d,i) => {
    d.map(d => {
      d.key = keys[i]
      d.lastIdx = keys[i] === keys[keys.length-1] ? true : false
      return d
    })
    return d
  })

  const yMax = d3.max(stackedData.flat().map(d=>d[1]))
  const xAccessor = (d) => d.data.category
  const yAccessor = (d) => d[1]
  const y0Accessor = (d) => d[0]

  const xScale = d3.scaleBand()
    .domain(range)
    .range(barDirection  === 'horizontal' ? [0, dimensions.boundedHeight] : [0, dimensions.boundedWidth])

  const yScale = d3.scaleLinear()
    .domain([0, yMax])
    .range(barDirection  === 'horizontal' ? [0, dimensions.boundedWidth] : [dimensions.boundedHeight, 0] )
    .nice()

  const colorScale = d3.scaleOrdinal()
    .domain(Object.keys(colorMap))
    .range(Object.values(colorMap))
  
  const colorAccessor = d => colorScale(d.key)
  const xAccessorScaled = d => xScale(xAccessor(d)) - barWidth/2
  const yAccessorScaled = d => yScale(yAccessor(d))
  const y0AccessorScaled = d => yScale(y0Accessor(d))

  return (
    <div>
      <Chart dimensions={dimensions}>
        <Axis
          dimensions={dimensions}
          dimension={barDirection  === 'horizontal' ? "y" : "x"}
          scale={xScale}
          formatTick={xFormat}
          tickSize={8}
          label={xLabel}          
          type="band"
          step={xScale.domain().length <= 10 ? null : 5}
        />
        <Axis
          dimensions={dimensions}
          dimension={barDirection  === 'horizontal' ? "x" : "y"}
          scale={yScale}
          formatTick={yFormat}
          tickSize={barDirection  === 'horizontal' ? 8 : dimensions.boundedWidth}
          label={yLabel}
        />
        { stackedData.map((arr,i) => 
           <Bar
            data={arr}
            type='stacked'
            barDirection={barDirection}
            xAccessor={xAccessorScaled}
            yAccessor={yAccessorScaled}
            y0Accessor={y0AccessorScaled}
            colorAccessor={colorAccessor}
            width={barWidth}
          />
        )}
      </Chart>
    </div>
  )
}

StackedBarSeries.propTypes = {
  data: PropTypes.array,
  colorMap: PropTypes.object,
  dimensions: PropTypes.object,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string
}

StackedBarSeries.defaultProps = {
  dimensions: {boundedWidth: 1000, boundedHeight: 800},
  format: d3.timeFormat("%b-%d"),
  xLabel: "",
  yLabel: ""
}

export default StackedBarSeries