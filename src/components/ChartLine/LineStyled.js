import styled from "styled-components";

const LineStyled = styled.path`

  &.Line--type-line {
    fill: none;
    stroke-width: 1px;
    stroke-linecap: round;
  }

  &.Line--type-area {
    fill-opacity: 0.185;
    stroke-width: 0;
  }


`;

export default LineStyled;
