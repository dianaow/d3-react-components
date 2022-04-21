import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types"
import * as d3 from "d3"
import getDateRange from "../../utils/getDateRange"

import Chart from "../ChartSVG/Chart"
import Axis from "../ChartAxis/Axis"
import Line from "./Line"
import Circles from "../ChartCircle/Circles"
import usePrevious from "./usePrevious";

const MultipleLineSeries = ({ data, colorMap, types, dimensions, xLabel, yLabel, xFormat, yFormat, passData, childData, groupByCol, groupByCol2 }) => {
  
  const nested =  d3.groups(data, d=>d[groupByCol], d=>d[groupByCol2])
  const date1 = nested[0][1][0][0]
  const date2 = nested[0][1][1][0]
  const { format } = getDateRange(date1, date2) //dynamic calculation of tick formatting based on data, rather than hardcode a time format

  types.forEach((d,i)=>{
    nested[i][2] = d || 'line'
  })

  const svgRef = useRef();
  const [selection, setSelection] = useState(childData);
  const previousSelection = usePrevious(selection);
  const previousDims = usePrevious(dimensions.boundedWidth);

  let xScale = d3.scaleTime()
  .domain([nested[0][1][0][0], nested[0][1][nested[0][1].length-1][0]])
  .range([0, dimensions.boundedWidth])

  let yScale = d3.scaleLinear()
    .domain(d3.extent(nested.flat(2), d=>d[1].length))
    .range([dimensions.boundedHeight, 0])
    .nice()
    
  let colorScale = d3.scaleOrdinal()
    .domain(Object.keys(colorMap))
    .range(Object.values(colorMap))

  let colorAccessor = d => colorScale(d[0])
  let xAccessorScaled = d => xScale(d[0])
  let yAccessorScaled = d => yScale(d[1].length)
  let y0AccessorScaled = yScale(yScale.domain()[0])

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const { boundedWidth, boundedHeight } = dimensions 

    let xScale = d3.scaleTime()
    .domain([nested[0][1][0][0], nested[0][1][nested[0][1].length-1][0]])
    .range([0, dimensions.boundedWidth])
  
    // brush
    const brush = d3.brushX()
      .extent([
        [0, 0],
        [boundedWidth, boundedHeight],
      ])
      .on("end", (event) => {
        if (event.selection) {
          const indexSelection = event.selection.map(xScale.invert);
          passData(indexSelection) // send brush selection from child to parent component
          setSelection(indexSelection); 
        }
      });

    // initial position + retaining position on resize
    if(previousDims !== dimensions.boundedWidth || previousSelection === undefined || previousSelection[0].toString() !== selection[0].toString() || previousSelection[1].toString() !== selection[1].toString()){
      svg.select(".brush").call(brush).call(brush.move, selection.map(xScale));
    }
  }, [nested, passData, previousDims, dimensions, previousSelection, selection]);


  return (
    <div >
      <Chart dimensions={dimensions} svgRef={svgRef}>
        <g className="brush" />
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
        { nested.map((d,i) => 
          <Line
            type={d[2] === 'linemarker' ? 'line' : d[2]}
            key={d[2] + '-' +i}
            data={d[1]}
            stroke={colorAccessor(d)}
            fill={d[2] === 'area' ? colorAccessor(d) : "none"}
            xAccessor={xAccessorScaled}
            yAccessor={yAccessorScaled}
            y0Accessor={y0AccessorScaled}
          />
        )}
        { nested.map((d,i) => {
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

MultipleLineSeries.propTypes = {
  data: PropTypes.array,
  colorMap: PropTypes.object,
  types: PropTypes.array,
  dimensions: PropTypes.object,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
  xFormat: PropTypes.func,
  yFormat: PropTypes.func,
  passData: PropTypes.func,
  childData: PropTypes.array,
  groupByCol: PropTypes.string,
  groupByCol2: PropTypes.string
}

MultipleLineSeries.defaultProps = {
  dimensions: {boundedWidth: 1000, boundedHeight: 800},
  xLabel: "",
  yLabel: "",
  groupByCol: 'category',
  groupByCol2: 'date',
  types: ['line']
}

export default MultipleLineSeries