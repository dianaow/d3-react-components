import React from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"
import { getSize } from "../../utils/chart-utils";
import getDateRange from "../../utils/getDateRange"

import Chart from "../ChartSVG/Chart";
import Axis from "../ChartAxis/Axis";
import Bar from "./Bar"
import Line from "../ChartLine/Line";
import Circles from "../ChartCircle/Circles";

const LineBarSeries = ({ data, colorMap, types, dimensions, xLabel, yLabel, xFormat, yFormat, groupByCol, groupByCol2 }) => {

  const nested =  d3.groups(data, d=>d[groupByCol], d=>d[groupByCol2])
  const date1 = nested[0][1][0][0]
  const date2 = nested[0][1][1][0]
  const { format } = getDateRange(date1, date2) //dynamic calculation of tick formatting based on data, rather than hardcode a time format

  types.forEach((d,i)=>{
    nested[i][2] = d || 'line'
  })

  const barValues = nested.filter(d=>d[2] === 'bar')
  const lineValues = nested.filter(d=>d[2] === 'line' || d[2] === 'area' || d[2] === 'linemarker')

  const barWidth = getSize(dimensions.boundedWidth, barValues[0][1].length)

  const xScale = d3.scaleTime()
    .domain([nested[0][1][0][0], nested[0][1][nested[0][1].length-1][0]])
    .range([0, dimensions.boundedWidth])

  const yScale = d3.scaleSqrt()
    .domain(d3.extent(nested.flat(2), d=>d[1].length))
    .range([dimensions.boundedHeight, 0])
    .nice()

  const colorScale = d3.scaleOrdinal()
    .domain(Object.keys(colorMap))
    .range(Object.values(colorMap))
  
  let colorBarAccessor = d => colorScale(d[1][0][groupByCol])
  let colorAccessor = d => colorScale(d[0])
  let xAccessorScaled = d => xScale(d[0])
  let yAccessorScaled = d => yScale(d[1].length)
  let y0AccessorScaled = yScale(yScale.domain()[0])
  const xAccessorScaledBar = d => xScale(d[0]) - barWidth/2

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
        <Bar
          data={barValues[0][1]}
          type='linebar'
          xAccessor={xAccessorScaledBar}
          yAccessor={yAccessorScaled}
          y0Accessor={dimensions.boundedHeight}
          colorAccessor={colorBarAccessor}
          width={barWidth}
        />
        { lineValues.map((d,i) => {
          return <Line
            type={d[2] === 'linemarker' ? 'line' : d[2]}
            key={d[2] + '-' +i}
            data={d[1]}
            stroke={colorAccessor(d)}
            fill={d[2] === 'area' ? colorAccessor(d) : "none"}
            xAccessor={xAccessorScaled}
            yAccessor={yAccessorScaled}
            y0Accessor={y0AccessorScaled}
          />
        })}
        { lineValues.map((d,i) => {
          if(d[2] === 'linemarker'){
            return <Circles
              data={d[1]}
              type="marker"
              xAccessor={xAccessorScaled}
              yAccessor={yAccessorScaled}
              colorAccessor={colorAccessor}
            />
          }
        })}
      </Chart>
    </div>
  )
}


LineBarSeries.propTypes = {
  data: PropTypes.array,
  colorMap: PropTypes.object,
  types: PropTypes.array,
  dimensions: PropTypes.object,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string
}

LineBarSeries.defaultProps = {
  dimensions: {boundedWidth: 1000, boundedHeight: 800},
  types: [],
  xLabel: "",
  yLabel: "",
  types: ['line', 'bar']
}

export default LineBarSeries