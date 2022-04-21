import React from "react"
import PropTypes from "prop-types"

import LegendStyled from "./LegendStyled";

const statComponentsByDirection = {
  top: captionTop,
  bottom: captionBottom,
}

const Legend = ({ value, suffix, caption, color, direction, ...props }) => {
  const Component = statComponentsByDirection[direction]
  if (!Component) return null

  return (
    <Component
      value={value}
      suffix={suffix}
      caption={caption}
      color={color}
      direction={direction}
      {...props}
    />
  )
}

Legend.propTypes = {
  value: PropTypes.string,
  suffix: PropTypes.string,
  caption: PropTypes.string,
  color: PropTypes.string,
  direction: PropTypes.oneOf(["top", "bottom"]),
}

Legend.defaultProps = {
  direction: "bottom"
}

export default Legend

function captionBottom ({ value, suffix, caption, color, ...props }) {
  return (
    <LegendStyled style={{borderColor: color}} {...props}>
      <div className="Legend__data">
        <div className="Legend__value">
          { value }
        </div>
        { suffix && <div className="Legend__suffix" style={{color: color}}>
          { suffix }
        </div> } 
      </div>    
      <div className="Legend__caption">
        { caption }
      </div>
    </LegendStyled>
  )
}

function captionTop ({ value, suffix, caption, color, ...props }) {
  return (
    <LegendStyled style={{borderColor: color}} {...props}>
      <div className="Legend__caption">
        { caption }
      </div>
      <div className="Legend__data">
        <div className="Legend__value">
          { value }
        </div>
        { suffix && <div className="Legend__suffix" style={{color: color}}>
          { suffix }
        </div> } 
      </div> 
    </LegendStyled>
  )
}