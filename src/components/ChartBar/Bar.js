import React from "react"
import PropTypes from "prop-types"
import { accessorPropsType, callAccessor } from "../../utils/chart-utils";

const Bar = ({ data, type, xAccessor, yAccessor, y0Accessor, colorAccessor, width, barDirection, ...props }) => {
  
  const barGenerator = (x, y, rx, ry, width, height) => {
    return `M${x},${y + ry}
      a${rx},${ry} 0 0 1 ${rx},${-ry}
      h${width - 2 * rx}
      a${rx},${ry} 0 0 1 ${rx},${ry}
      v${height - ry}
      h${-(width)}Z
    `;
  }
    
  return (
    <>
    { data.map((d,i) => {
      let height = callAccessor(y0Accessor, d, i) - callAccessor(yAccessor, d, i)
      let X = callAccessor(xAccessor, d, i)
      let Y = callAccessor(yAccessor, d, i)
      return <path {...props}
        key={"bar-" + type + '-' + d.category + '-' + i}
        d={barDirection  === 'horizontal' ? barGenerator(Y, X, 0, 0, height, width) : barGenerator(X, Y, 0, 0, width, height)}
        fill={callAccessor(colorAccessor, d, i)}
      />
    })}
    </>
  )
}

Bar.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  type: PropTypes.string,
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  y0Accessor: accessorPropsType,
  colorAccessor: accessorPropsType,
  width: PropTypes.number
}

Bar.defaultProps = {
  type: "default",
  y0Accessor: 0,
  width: 6,
  barDirection: 'vertical'
}

export default Bar
