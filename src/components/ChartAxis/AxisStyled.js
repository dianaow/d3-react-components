import styled from "styled-components";

const AxisStyled = styled.g`
  
  text {
    fill: black;
  }

  & .Axis {
    opacity: 0.7;
  }

  & .Axis {
    opacity: 0.7;
  }

  & .Axis__line {
    stroke: white;
    stroke-width: 0px;
  }

  & .Axis__label {
    text-anchor: middle;
    font-size: 0.7em;
    letter-spacing: 0.01em;
  }

  & .Axis__tick {
    font-size: 0.5em;
    transition: all 0.3s ease-out;
  }

  & .Axis__tick__line {
    stroke: black;
    opacity: 0.2;
  }

  &.AxisHorizontal > .Axis__tick {
    text-anchor: middle;
  }

  &.AxisVertical > .Axis__tick {
    dominant-baseline: middle;
    text-anchor: end;
  }

`;

export default AxisStyled;
