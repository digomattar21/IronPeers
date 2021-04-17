import React, { useState } from "react";
import styled from "styled-components";
import AddChannelInput from "../AddChannelInput";
import { db } from "../../firebase";
import { useDispatch } from "react-redux";
import {enterRoom} from '../../features/appSlice';
import Api from '../../util/api.util'
import { Redirect } from "react-router";
import {useRoutes, useRedirect} from 'hookrouter';

function SideBarOption({ Icon, title, addChannel, setAddChannelInputBool, addChannelInputBool, id, history, handleOpen }) {
  const dispatch = useDispatch();

  const handleAddChannel = async(name) => {
    setAddChannelInputBool(true);
    const reg = /^[a-z]+$/i;
    try {
      if (reg.test(name)){
        setAddChannelInputBool(false)
       let req = await  db.collection('rooms').add({
            name: name
        });
        let payload = {name: name, firebaseId: req.id }
        let req2 = await Api.addGlobalChannel(payload);

    }
      
    } catch (error) {
      console.log(error)
    }

  };

  const handleSelectChannel = () => {
    return <Redirect to={`/channel/${id}`} />

  };

  return (
    <SideBarOptionContainer
      onClick={addChannel ? handleAddChannel : handleSelectChannel}
      onClick={handleOpen && handleOpen }
    >
      {!addChannelInputBool && (
        <>
          {Icon && <Icon fontSize="small" style={{ padding: 7 }} />}
          {Icon ? (
            <h3>{title}</h3>
          ) : (
            <SideBarOptionChannel>
              <span># <span>{title}</span></span> 
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
    text-decoration:'none';
    color: 'black';
    :hover{
      text-decoration: none;
    }
  }

  > h3 > span {
    padding: 15px;
    color:'black';
    
  }
`;

const SideBarOptionChannel = styled.h3`
  padding: 10px 0;
  font-weight:300;
  >span{
    color: black;
  }
  >span>span{
    margin-left: 7px;
    color: black;
  }
`;
