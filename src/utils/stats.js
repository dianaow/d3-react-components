import * as d3 from "d3"

export function getStats(data, groupCol){

  const dataNested = d3.group(data, d=>d[groupCol])
  
  const dataRollup = d3.rollup(data, leaves => d3.sum(leaves, d=>d.value), d=>d[groupCol])

  const total = getTotal(data)

  const categories = Array.from(dataNested.keys())
   
  let stats = []
  categories.forEach(d=>{
    let value = dataRollup.get(d)
    stats.push({
      category : d,
      value : value,
      perc_total : getPerc(value, total)
    })
  })

  return stats
}

export function getPerc(d, total) {
  return Math.round((d / total) * 100).toString() + "%"
}

export function getTotal(data){
  return d3.sum(data, d=>d.value)
}

