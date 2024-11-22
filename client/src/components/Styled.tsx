import styled from "styled-components";

export const BooksSection = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100wh;
`;
export const BookCard = styled.div`
  width: 50%;
  height: 500px;
  padding: 20px 0;  
  background: ${props => props.bgColor};
  color: ${props => props.color};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const BookCardHover = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  font-size: 50px;
  background: rgba(0, 0, 0, 0.7);
  visibility: ${({ display }) => (display ? "100" : "hidden")};
`;