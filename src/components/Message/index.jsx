import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../../firebase";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import LabelImportantIcon from "@material-ui/icons/LabelImportant";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import Api from "../../util/api.util";

function Message({
  message,
  timestamp,
  user,
  userImage,
  id,
  channelId,
  channelName,
  Private,
}) {
  const [userState] = useAuthState(auth);
  const [iconsShow, setIconsShow] = useState(false);

  const handleBookmarkClick = async (e) => {
    const payload = { channelId: channelId, firebaseId: id, message: message };
    try {
      let req;
      if (Private == true) {
        req = await Api.bookMarkPrivateMessage(payload);
      } else {
        req = await Api.bookMarkMessage(payload);
      }
      if (userState.email) {
        const newPayload = {
          channelId: channelId,
          messageFirebaseId: id,
          message: message,
          email: userState.email,
          messageOwner: user,
          channelName: channelName,
        };
        if (Private==true){
          let updatedPrivateUserBookmarks = await Api.addPrivateUserBookMark(newPayload);
          console.log('entrou')
        }else{
          let updatedUserBookmarks = await Api.addUserBookMark(newPayload);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePinClick = async (e) => {
    const payload = {
      channelId: channelId,
      messageFirebaseId: id,
      message: message,
      messageOwner: user,
    };

    try {
      if (Private == true) {
        let req = await Api.pinPrivateMessage(payload);
      } else {
        let req = await Api.pinMessage(payload);
      }
    } catch (err) {
      console.log(err);
    }
  };

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
            <BookmarkBorderIcon onClick={(e) => handleBookmarkClick(e)} />
            <FavoriteBorderIcon />

            <LabelImportantIcon onClick={(e) => handlePinClick(e)} />
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
  padding: 8px 6px;
  border: 1px solid var(--ironblue-color);
  border-radius: 9px;
  > .MuiSvgIcon-root {
    font-size: 20px;
    color: var(--ironblue-color);
    margin-left: 5px;
    :hover {
      cursor: pointer;
      transform: scale(1.2)
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
