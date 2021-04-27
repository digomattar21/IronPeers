import React, { useState } from "react";
import styled from "styled-components";

function MemberCard({ profilePic, username, email, handleSelected }) {
  const [change, setChange] = useState(false);
  const [color, setColor] = useState("white");

  const handleClick = () => {
    if (handleSelected) {
        if (!change){
            setColor("blue")
            handleSelected(username, "plus")
            setChange(true);
        }else{
            setColor('white');
            handleSelected(username, "minus");
            setChange(false)
        }
      
    }
  };

  return (
    <MemberCardContainer
      onClick={() => handleClick()}
      style={{ backgroundColor: color, opacity: 0.8 }}
    >
      <img src={profilePic} />
      {username && <h3>{username}</h3>}
      {email && <h4>{email}</h4>}
    </MemberCardContainer>
  );
}

export default MemberCard;

const MemberCardContainer = styled.div`
  display: flex;
  margin-top: 5px;
  align-items: center;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 3px;
  padding-right: 50px;
  border: 1px solid lightgray;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  > img {
    max-height: 36px;
    border-radius: 6px;
    margin-right: 5px;
  }
  :hover {
    opacity: 0.8;
    cursor: pointer;
  }
`;
