import React, { useRef, useState, useEffect } from 'react';
import ResizeObserver from "resize-observer-polyfill";

const ReactDims = React.createContext(null);

const useResizeObserver = ref => {
  const [dimensions, setDimensions] = useState(null);
  useEffect(() => {
    const observeTarget = ref.current;
    const resizeObserver = new ResizeObserver(entries => {
      entries.forEach(entry => {
        setDimensions(entry.contentRect);
      });
    });
    resizeObserver.observe(observeTarget);
    return () => {
      resizeObserver.unobserve(observeTarget);
    };
  }, [ref]);
  return dimensions;
};

export const Provider = (props)=>{

  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  return (
    <div ref={wrapperRef} style={{height: '100%'}}>
      <ReactDims.Provider value={dimensions}>
        {props.children}
      </ReactDims.Provider>
    </div>
  )
};


export const withContext=(ChildComponent)=>{
  return (props)=>(
        <ReactDims.Consumer>
          {(incomingDims)=>(<ChildComponent {...props} dims={incomingDims} />)}
        </ReactDims.Consumer>
  )
}

