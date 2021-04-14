import { Button } from "@material-ui/core";
import React, { useState } from "react";
import styled from "styled-components";

function AddChannelInput({ handleSubmitAddChannel}) {

    const [nameValue, setNameValue] = useState('');

    const updateInput = (e) =>{
        const name = e.target.value;

        setNameValue(name)
    }

    const addChannel = (e) =>{
        e.preventDefault();
        var reg = /^[a-z]+$/i;
        if (reg.test(nameValue)){
            handleSubmitAddChannel(nameValue)
        }
    }


  return (
    <FormContainer>
      <form onSubmit={(e)=>addChannel(e)}>
        <InputContainer>
          <input value={nameValue} onChange={(e)=>updateInput(e)} placeholder="channel name" style={{outline:0}}></input>
          <Button type='submit' variant='outlined' >Add</Button>
        </InputContainer>
      </form>
    </FormContainer>
  );
}

export default AddChannelInput;

const FormContainer = styled.div`
  background-color: var(--ironblue-color);
  border: 1px solid black;
  border-radius: 6px;
`;

const InputContainer = styled.div`
    display: flex;
    justify-content:space-around;
    align-items:center;
    outline: none;
`;



