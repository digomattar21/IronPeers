import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth } from "../../firebase";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import LabelImportantIcon from "@material-ui/icons/LabelImportant";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";

function Message({ message, timestamp, user, userImage, id }) {
  const [userState] = useAuthState(auth);
  const [iconsShow, setIconsShow] = useState(false);


  const handleBookmarkClick = ()=>{
    
  }

  return (
    <MessageContainer
      onMouseEnter={() => setIconsShow(true)}
      onMouseLeave={() => setIconsShow(false)}
    >
      <MessageLeftContainer>
        <img src={userImage} alt="user profile img" />
        <MessageInfo>
          <h4>
            {user} <span>{new Date(timestamp?.toDate()).toUTCString()}</span>
          </h4>
          <p>{message}</p>
        </MessageInfo>
      </MessageLeftContainer>
      <MessageRightContainer>
        {iconsShow && (
          <MessageIconsContainer>
            <BookmarkBorderIcon onClick={(e)=>handleBookmarkClick(e)}/>
            <FavoriteBorderIcon />

            <LabelImportantIcon />
          </MessageIconsContainer>
        )}
      </MessageRightContainer>
    </MessageContainer>
  );
}

export default Message;

const MessageContainer = styled.div`
  display: flex;
  align-items: center;
`;

const MessageRightContainer = styled.div``;

const MessageIconsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
  padding: 6px 5px;
  border: 1px solid var(--ironblue-color);
  border-radius: 9px;
  > .MuiSvgIcon-root {
    font-size: 18px;
    color: var(--ironblue-color);
    :hover {
      cursor: pointer;
    }
  }
`;

const MessageLeftContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  > img {
    height: 50px;
    border-radius: 12%;
  }
`;

const MessageInfo = styled.div`
  padding-left: 10px;

  > h4 {
    display: flex;
    align-items: center;
  }

  > h4 > span {
    color: gray;
    font-weight: 300px;
    margin-left: 8px;
    font-size: 10px;
  }
`;
