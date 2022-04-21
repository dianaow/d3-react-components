import React from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import { getSize } from "../../utils/chart-utils";

import Chart from "../ChartSVG/Chart";
import Axis from "../ChartAxis/Axis";
import Bar from "./Bar";

const BarSeries = ({ data, dimensions, xLabel, yLabel, xFormat, yFormat, xAccessorCol, yAccessorCol, color, barDirection}) => {

  const barWidth = getSize(barDirection  === 'horizontal' ? dimensions.boundedHeight : dimensions.boundedWidth, data.length)
  const xAccessor = (d) => d[xAccessorCol]
  const yAccessor = (d) => d[yAccessorCol]

  const xScale = d3.scaleBand()
    .domain(data.map(xAccessor))
    .range(barDirection  === 'horizontal' ? [0, dimensions.boundedHeight] : [0, dimensions.boundedWidth])

  const yScale = d3.scaleSqrt()
    .domain(d3.extent(data, yAccessor))
    .range(barDirection  === 'horizontal' ? [0, dimensions.boundedWidth] : [dimensions.boundedHeight, 0] )
    .nice()

  const xAccessorScaled = d => xScale(xAccessor(d)) - barWidth/2
  const yAccessorScaled = d => yScale(yAccessor(d))

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
        <Bar
          data={data}
          type="default"
          barDirection={barDirection}
          colorAccessor={color}
          xAccessor={xAccessorScaled}
          yAccessor={yAccessorScaled}
          y0Accessor={0}
          width={barWidth}
        />
      </Chart>
    </div>
  )
}


BarSeries.propTypes = {
  data: PropTypes.array,
  dimensions: PropTypes.object,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
  xFormat: PropTypes.func,
  yFormat: PropTypes.func,
  xAccessorCol: PropTypes.string,
  yAccessorCol: PropTypes.string,
  color: PropTypes.string
}

BarSeries.defaultProps = {
  dimensions: {boundedWidth: 1000, boundedHeight: 800},
  xLabel: "",
  yLabel: "",
  xAccessorCol: 'date',
  yAccessorCol: 'value',
  color: 'black'
}

export default BarSeries;