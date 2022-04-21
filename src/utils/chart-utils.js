import PropTypes from 'prop-types'

export const accessorPropsType = (
  PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
  ])
)

export const callAccessor = (accessor, d, i) => (
  typeof accessor === "function" ? accessor(d, i) : accessor
)

export const dimensionsPropsType = (
  PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
    marginTop: PropTypes.number,
    marginRight: PropTypes.number,
    marginBottom: PropTypes.number,
    marginLeft: PropTypes.number,
  })
)

export const combineChartDimensions = (dimensions) => {
  return {
    ...dimensions,
    boundedHeight: Math.max(dimensions.height - dimensions.marginTop - dimensions.marginBottom, 0),
    boundedWidth: Math.max(dimensions.width - dimensions.marginLeft - dimensions.marginRight, 0),
  }
}
  
export function getSize(width, eleCount){
  if(width < 250 & eleCount > 20){
    return 1
  } else if(width < 250 & eleCount <= 20){
    return 10
  } else if(width >= 250 & eleCount > 20){
    return 4
  } else if(width >= 250 & eleCount <= 20){
    return 20
  } else {
    return 1
  }
}

export function getJSDateObj(dateStr){
  //sample timestamp: 2021-08-28 17:41:25.609000
  //new Date(2021-08-28 17:41:25.609000) will not work on IE or Safari and return ‘Invalid Date’, so there is a need to parse the date string 
  const [ date, time ] = dateStr.split(' ')
  const [ year, month, day ] = date.split('-')
  const [ hour, minute ] = time.split(':')
  return new Date(+year, +month - 1, +day, +hour, +minute, 0)
}

export function random_item(items){ 
  return items[Math.floor(Math.random()*items.length)];    
}

export function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}