import React from "react"

import PropTypes from "prop-types"
import Legend from "./Legend"

import LegendPanelStyled from "./LegendPanelStyled";

const LegendPanel = ({ data, metrics, direction }) => {

  const { colorMap, value, suffix } = metrics

  let data1, data2
  const categories = Object.keys(colorMap)
  const idx = Math.ceil(categories.length/2)
  if(categories.length > 3){
    data1 = data.slice(0, idx) 
    data2 = data.slice(idx, categories.length)
  } else {
    data1 = []
    data2 = data.slice()
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
    <LegendPanelStyled style={{justifyContent: direction === 'left' ? 'flex-start' : 'flex-end', width: '100%'}}>
      { data1.map((d,i)=> {
        return <Legend
          key={'stat-' + i} 
          value={d[value]}
          suffix={d[suffix]}
          caption={d.category}
          direction="bottom"
          color={colorMap[d.category]}
        />
      })}
    </LegendPanelStyled>
        <LegendPanelStyled style={{justifyContent: direction === 'left' ? 'flex-start' : 'flex-end', width: '100%'}}>
        { data2.map((d,i)=> {
          return <Legend
            key={'stat-' + i} 
            value={d[value]}
            suffix={d[suffix]}
            caption={d.category}
            direction="bottom"
            color={colorMap[d.category]}
          />
        })}
      </LegendPanelStyled>
    </div>
  )
}

LegendPanel.propTypes = {
  data: PropTypes.array,
  metrics: PropTypes.object,
  direction: PropTypes.oneOf(["left", "right"])
}

export default LegendPanel