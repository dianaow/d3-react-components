import React, { useState } from "react"

import "./Dropdown.css"

const useDropdown = ({label, defaultValue, items}) => {

  const [value, setValue] = useState(defaultValue)
  const [open, setOpen] = useState(false)

  const getLabel = (value) => {
    if(items.length > 0){
      let tmp = items.find(d=>d.value === value) || {label: ""}
      return tmp.label
    } else {
      return ""
    }
  }


  const DropdownTemplate = () => (
    <div>
      <p>{label}</p>
      <div 
        className="input"
        onClick={e => setOpen(!open)}
      >
        <div className="input__placeholder">
          <p className="input__selected">{getLabel(value)}</p>
            <span>
              <svg width="14px" height="7px" viewBox="0 0 10 5" version="1.1">
                <g id="Delivery" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <g id="svg-arrow" transform="translate(-1360.000000, -29.000000)" fillRule="nonzero">
                    <g id="Group-4" transform="translate(1360.000000, 29.000000)">
                        <polygon id="Shape" points="0 0 5 5 10 0"></polygon>
                    </g>
                  </g>
                </g>
              </svg>
            </span>
        </div>
      </div>
      <div 
        className='list' 
        style={{display: open ? 'block': 'none'}}
      >
        {items.map(({ label, value }) => (
          <div 
            key={label} 
            id={value}
            onClick={(e)=> {
              const element = e.currentTarget
              const value = element.getAttribute('id') || ""
              setValue(value)
              setOpen(!open)
            }}
          >
            <p>{label}</p>
          </div>
        ))}
      </div>
    </div>
  )

  return [value, DropdownTemplate, setValue]

}

export default useDropdown
