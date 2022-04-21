import React from "react";
import PropTypes from "prop-types"

import { combineChartDimensions } from "../../utils/chart-utils"
import { withContext } from "./Provider";

const margins = {
  left: 70,
  top: 30,
  right: 20,
  bottom: 50
}

const ChartWithDims = (Component) => {

  const Chart = ({dims, ...props}) => {

    const marginLeft =  (props.margins && props.margins.left) || margins.left
    const marginTop =  (props.margins && props.margins.top) || margins.top
    const marginRight =  (props.margins && props.margins.right) || margins.right
    const marginBottom =  (props.margins && props.margins.bottom) || margins.bottom

    const dimensions = combineChartDimensions({width: dims ? dims.width : 0, height: dims ? dims.height-20 : 0, marginLeft, marginTop, marginRight, marginBottom})

    return (  
      <div style={{position: 'relative'}}> 
        { dims && <Component  {...props}
          dimensions={dimensions}
        /> }
      </div>
    )
  }

  return withContext(Chart)

}

ChartWithDims.propTypes = {
  Component: PropTypes.element
}

export default ChartWithDims