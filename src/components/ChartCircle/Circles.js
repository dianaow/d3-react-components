import React from "react"
import PropTypes from "prop-types"
import { accessorPropsType, callAccessor  } from "../../utils/chart-utils";

const Circle = ({ data, type, xAccessor, yAccessor, colorAccessor, radiusAccessor, mouseOver, ...props }) => {

  return (
    <>
    { data.map((d,i) => {
      let CX = callAccessor(xAccessor, d, i)
      let CY = callAccessor(yAccessor, d, i)
      let R = callAccessor(radiusAccessor, d, i)
      let fill = callAccessor(colorAccessor, d, i)
      let event_content = {
        x: CX, 
        y: CY, 
        content: d.value, 
        width: R*2, 
        height: R*2  
      }
      return (<circle {...props}
        key={'circle-'+ type + '-' + d.category + '-' + i}
        cx={CX}
        cy={CY}
        r={R}
        fill={fill}
        opacity={1}
        onMouseOver={() => {
          //console.log('mouseOver')
          return mouseOver({...event_content, show: true})
        }}
        onMouseLeave={() => {
          //console.log('mouseOut')
          return mouseOver({...event_content, show: false})
        }}
        cursor="pointer"
        pointerEvents="auto"
      />)
    })}
    </>
  )
}

Circle.propTypes = {
  data: PropTypes.array,
  type: PropTypes.string,
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  colorAccessor: accessorPropsType,
  radiusAccessor: accessorPropsType
}

Circle.defaultProps = {
  radiusAccessor: 2
}

export default Circle