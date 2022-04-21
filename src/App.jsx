import React, { useState, useEffect } from "react"
import * as d3 from "d3"

import ChartWithDims from "./components/Chart/ChartWithDims";
import { Provider } from "./components/Chart/Provider";
import LegendPanel from "./components/ChartLegend/LegendPanel"
import BarSeries from "./components/ChartBar/BarSeries";
import StackedBarSeries from "./components/ChartBar/StackedBarSeries";
import LineBarSeries from "./components/ChartBar/LineBarSeries";
import MultipleLineSeries from "./components/ChartLine/MultipleLineSeries";
import BubblePlot from "./components/ChartCircle/BubblePlot";
import { getStats } from "./utils/stats"
import { random_item, getRandomIntInclusive } from "./utils/chart-utils"
import useDropdown from "./components/dropdown/Dropdown"

import './App.css'

const timeFormat = d3.timeFormat("%B %d, %I:%M %p")
const colorMap1 = {
  "cat11": '#FF8D78', 
  "cat12": '#3446F4',
  "cat13": '#9D9D9D'
}
const colorMap2 = {
  "cat21": '#FF8D78',
  "cat22": '#3446F4',
  "cat23": 'cyan', 
  "cat24": '#9D9D9D',
}
const colorMap3 = {
  "cat31": '#FF8D78', 
  "cat32": '#3446F4',
  "cat33": '#9D9D9D'
}

function getColorMap(value){
  if(value === 'category1'){
    return colorMap1
  } else if(value === 'category2'){
    return colorMap2
  } else if(value === 'category3'){
    return colorMap3
  } else {
    return colorMap1
  }
}

const App = () => {

  const [data, setData] = useState({dataFiltered: [], histogramData: []})
  const [childData, setChildData] = useState([]); //brush date selection
  const [dropdownValue, DropDown] = useDropdown({
    label: "Pick a filter", 
    defaultValue: 'category1', 
    items: [{label: 'category1', value: 'category1'}, {label: 'category2', value: 'category2'}, {label: 'category3', value: 'category3'}]
  });
  const [tooltip, setTooltip] = useState({show: false, x: 0, y: 0, content: ""})

  const StackedBarChart = ChartWithDims((props) => <StackedBarSeries {...props}/>) 
  const BarChart = ChartWithDims((props) => <BarSeries {...props}/>) 
  const LineBarChart = ChartWithDims((props) => <LineBarSeries {...props}/>) 
  const MultipleLineChart = ChartWithDims((props) => <MultipleLineSeries {...props} />)
  const BubbleChart = ChartWithDims((props) => <BubblePlot {...props} />)

  useEffect(() => {

    let rawData = []
    d3.range(0,1000).forEach(d=>{
      let days = getRandomIntInclusive(1,31)
      let hours = getRandomIntInclusive(1,24)
      let minutes = getRandomIntInclusive(0,60)
      rawData.push({
        date : new Date(2022, 1, days, hours, minutes),
        datehour : new Date(2022, 1, days, hours),
        category1: random_item(["cat11", "cat12", "cat13"]),
        category2: random_item(["cat21", "cat22", "cat23", "cat24"]),
        category3: random_item(["cat31", "cat32", "cat33"]),
        value: getRandomIntInclusive(0,100)
      })
    })

    //sort data based on timestamps
    rawData.sort(function(a,b){
      return a.date - b.date;
    })

    // Compute data for histogram
    const X = d3.map(rawData, d=>d.value);
    const Y0 = d3.map(rawData, ()=>1);
    const I = d3.range(X.length);
    const bins = d3.bin().thresholds(20).value(i => X[i])(I);
    const Y = Array.from(bins, I => d3.sum(I, i => Y0[i]));
    bins.forEach((d,i)=>{
      d.y1 = Y[i]
    })

    setData({data: rawData, histogramData: bins}) 
    setChildData([rawData[0].date, rawData[100] ? rawData[100].date : rawData[1].date]) //initial date selection of brush
  }, []);
  
  // set date selection from brush from child to parent component
  const passData = (data) => {
    if(data[0].toString() !== childData[0].toString() || data[1].toString() !== childData[1].toString()){
      setChildData(data)
    }
  };

  return (
    <>
    {data.histogramData.length !== 0 && data.data.length !== 0 &&
    <div className="wrapper">
      <div style={{display: 'flex'}}>
        <div style={{height: '25vh', width: '40vw'}}>
          <div style={{marginLeft: '30px'}}>
            <h2>React + D3 Dashboard</h2>  
            <div style={{display: 'flex'}}>
            <DropDown/>
            <LegendPanel data={getStats(data.data, dropdownValue)} metrics={{value: 'perc_total', colorMap: getColorMap(dropdownValue)}} direction="left"/>      
            </div>
          </div>
        </div>
        <div id="histogram" style={{height: '25vh', width: '30vw'}}>
          <Provider>
          <BarChart
            data={data.histogramData} 
            id='histogram'
            showLegend={false}
            yFormat = {d3.format("~s")}
            xFormat = {d3.format("$,")}
            yLabel ="No. of transactions"
            xLabel = 'Transaction amount'
            xAccessorCol = 'x0'
            yAccessorCol = 'y1'
            color = 'black'
            barDirection = 'horizontal'
          /> 
          </Provider>
        </div>
        <div id="stackedbar" style={{height: '25vh', width: '30vw'}}>
          <Provider>
          <StackedBarChart
            data={data.data} 
            id='stackedbar'
            showLegend={false}
            yFormat = {d3.format("~s")}
            xFormat = {null}
            yLabel ={dropdownValue}
            xLabel ="category2"
            groupByCol="category2"
            groupByCol2={dropdownValue}
            colorMap={getColorMap(dropdownValue)}
            //barDirection = 'vertical'
            //margins={{left: 180}}
          /> 
          </Provider>
        </div>
      </div>
      <div id="multipleline" style={{height: '35vh', width: '100vw'}}>
        <Provider>
        {/* <LineBarChart
          data={data.data} 
          id="line"
          types={['bar', 'linemarker', 'area']}
          colorMap={getColorMap(dropdownValue)}
          yFormat = {d3.format(",")}
          yLabel ="No. of transactions"
          xLabel ="Transaction time"
          groupByCol={dropdownValue}
          groupByCol2='datehour'
        />  */}
        <MultipleLineChart
          data={data.data} 
          id="line"
          type="line"
          colorMap={getColorMap(dropdownValue)}
          yFormat = {d3.format(",")}
          yLabel ="No. of transactions"
          xLabel ="Transaction time"
          passData={passData}
          childData={childData}
          groupByCol={dropdownValue}
          groupByCol2='datehour'
        /> 
        </Provider>         
      </div>
      <div id="bubblechart" style={{position: 'relative', height: '40vh', width: '100vw'}}>
        <Provider>
        <div><p style={{margin: '0px', padding: '0px', marginLeft: '30px'}}>{`${timeFormat(childData[0])} - ${timeFormat(childData[1])}`}</p></div>
        <BubbleChart
          data={data.data.filter(d => d.date >= childData[0] && d.date <= childData[1]) } //filter data based on time selection from brush
          id='bubble'
          colorMap={getColorMap(dropdownValue)}
          yFormat = {d3.format("$,")}
          yLabel ="Transaction amount"
          xLabel ="Transaction time"
          groupByCol={dropdownValue}
          popover={(value) => setTooltip(value)}
        />  
        </Provider>  
        <div style={{position: 'absolute', top: `${tooltip.y+30}px`, left: `${tooltip.x+70}px`, fontSize: '12px'}}>
          {tooltip.content}
        </div>       
      </div>
    </div>
    }
    </>
  )
}

export default App