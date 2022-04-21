import React from "react"
import { dimensionsPropsType } from "../../utils/chart-utils"

const Chart = ({ dimensions, children, svgRef }) => (
    <svg className="Chart" width={dimensions.width} height={dimensions.height} ref={svgRef}>
      <g transform={`translate(${dimensions.marginLeft}, ${dimensions.marginTop})`}>
        { children }
      </g>
    </svg>
)

Chart.propTypes = {
  dimensions: dimensionsPropsType
}

Chart.defaultProps = {
  dimensions: {}
}

export default Chart
