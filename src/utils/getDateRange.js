import * as d3 from "d3"

function findDaysBetween(date1, date2){
  const Difference_In_Time = date2.getTime() - date1.getTime(); 
  const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24); 
  return Math.abs(Difference_In_Days)
}

function findHoursBetween(date1, date2){
  const Difference_In_Time = date2.getTime() - date1.getTime(); 
  const Difference_In_Hours = Difference_In_Time / (1000 * 3600); 
  return Math.abs(Difference_In_Hours)
}

export default function getDateRange(date1, date2){

  //const formatDate = d3.timeFormat("%Y-%m-%d")
  const formatDay = d3.timeFormat("%b-%d")
  const formatMonth = d3.timeFormat("%b %Y")
  const formatDayHour = d3.timeFormat("%b-%d %I %p")
  const formatHour = d3.timeFormat("%I %p")

  let format
  if(findHoursBetween(date1, date2) <= 12){ 
    format = formatDayHour
  } else if(findDaysBetween(date1, date2) === 1){ 
    format = formatDay
  } else if(findDaysBetween(date1, date2) === 7){ 
    format = formatDay
  } else if(findDaysBetween(date1, date2) === 30 || findDaysBetween(date1, date2) === 31){
    format = formatMonth
  } else {
    format = formatHour
  }

  return { format }

}