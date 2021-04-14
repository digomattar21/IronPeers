import React, { useState } from "react";
import styled from "styled-components";
import AddChannelInput from "../AddChannelInput";
import { db } from "../../firebase";
import { useDispatch } from "react-redux";
import {enterRoom} from '../../features/appSlice'

function SideBarOption({ Icon, title, addChannel, setAddChannelInputBool, addChannelInputBool, id }) {
  const dispatch = useDispatch();

  const handleAddChannel = (name) => {
    setAddChannelInputBool(true);
    const reg = /^[a-z]+$/i;
    if (reg.test(name)){
        setAddChannelInputBool(false)
        db.collection('rooms').add({
            name: name
        })
    }

  };

  const handleSelectChannel = () => {
     if (id){
       dispatch(
         enterRoom({
          roomId: id
       }))
     }
  };

  return (
    <SideBarOptionContainer
      onClick={addChannel ? handleAddChannel : handleSelectChannel}
    >
      {!addChannelInputBool && (
        <>
          {Icon && <Icon fontSize="small" style={{ padding: 10 }} />}
          {Icon ? (
            <h3>{title}</h3>
          ) : (
            <SideBarOptionChannel>
              <span>#</span> {title}
            </SideBarOptionChannel>
          )}
        </>
      )}
      {addChannelInputBool && (
          <AddChannelInput handleSubmitAddChannel={handleAddChannel}/>
      )}
    

    </SideBarOptionContainer>
  );
}

export default SideBarOption;

const SideBarOptionContainer = styled.div`
  display: flex;
  font-size: 12px;
  align-items: center;
  padding-left: 2px;
  cursor: pointer;

  :hover {
    opacity: 0.8;
    background-color: white;
  }

  > h3 {
    font-weight: 500;
  }

  > h3 > span {
    padding: 15px;
  }
`;

const SideBarOptionChannel = styled.h3`
  padding: 10px 0;
  font-weight:300;
`;
