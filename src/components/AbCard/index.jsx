import React, { useState } from "react";
import styled from "styled-components";
import CancelIcon from '@material-ui/icons/Cancel';
import Api from '../../util/api.util'

function AbCard({ hab, userId, own, reload, setReload }) {
  const [iconsShow, setIconsShow] = useState(false);

  const handleDeleteAbility = async()=>{
    if (!own) return 
    let payload = {ability: hab, userEmail: userId}
    try {
      let req = await Api.deleteUserAbility(payload)
      setReload(!reload)
    } catch (error) {
      console.log(error)
    }
  }

  const handleIconsShow= ()=>{
    if (!own) return
    setIconsShow(!iconsShow)
  }

  return (
    <AbilityContainer
      onMouseEnter={() => handleIconsShow(true)}
      onMouseLeave={() => handleIconsShow(false)}
    >
      <h3>{hab}</h3>
      {iconsShow && <CancelIcon 
      onClick={()=>handleDeleteAbility()}
      style={{ color: "red" }} />}
    </AbilityContainer>
  );
}

export default AbCard;

const AbilityContainer = styled.div`
  margin-top: 20px;
  max-width: 10vw;
  border-radius: 6px;
  background-color:white;
  text-align: center;
  padding: 6px 8px;
  border: 1 px solid lightgray;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  display: flex;
  >.MuiSvgIcon-root {
    margin-left: 5px;
    :hover{
      cursor: pointer;
      opacity:0.6;
    }
  }
  >h3{
    color: #6386fb;
  }

`;
