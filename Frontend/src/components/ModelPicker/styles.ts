import styled from "styled-components";

export const StyledModelPicker = styled.div`
  position: relative;
  display: inline-block;
`;

export const ModelButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #ffffff;
  color: #000000;
  border: 1px solid #000000;
  cursor: pointer;
`;

export const ModelPickerContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #ffffff;
  border: 1px solid #000000;
  padding: 10px;
`;

export const ModelOption = styled.div<{ isSelected: boolean }>`
  padding: 5px;
  cursor: pointer;
  height: 30px;
  line-height: 30px;
  background-color: ${(props) => (props.isSelected ? "#f2f2f2" : "transparent")};
`;



export const UploadButtonContainer = styled.label`
  padding: 10px 20px;
  background-color: #ffffff;
  color: #000000;
  border: 1px solid #000000;
  cursor: pointer;
`;

export const UploadButtonInput = styled.input`
  display: none;
`;


