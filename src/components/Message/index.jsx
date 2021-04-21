import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../../firebase";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import LabelImportantIcon from "@material-ui/icons/LabelImportant";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import GetAppIcon from "@material-ui/icons/GetApp";
import Api from "../../util/api.util";
import { Redirect, useHistory } from "react-router";
import axios from 'axios'
import fileDownload from 'js-file-download'

function Message({
  message,
  timestamp,
  user,
  userImage,
  id,
  channelId,
  channelName,
  Private,
  fileDownloadUrl,
}) {
  const [userState] = useAuthState(auth);
  const [iconsShow, setIconsShow] = useState(false);
  const history = useHistory();
  const [error, setError] = useState(null)

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
          imgUrl: fileDownloadUrl || ""
        };
        if (Private == true) {
          let updatedPrivateUserBookmarks = await Api.addPrivateUserBookMark(
            newPayload
          );
          console.log("entrou");
        } else {
          let updatedUserBookmarks = await Api.addUserBookMark(newPayload);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkFileType = (url) => {
    let questionMarkIndex = url.indexOf("?");
    let stringSliced = url.substring(0, questionMarkIndex);
    let isImg =
      stringSliced.endsWith(".jpg") ||
      stringSliced.endsWith(".gif") ||
      stringSliced.endsWith(".png") ||
      stringSliced.endsWith(".jpeg");
    let end = stringSliced.slice(questionMarkIndex - 3, questionMarkIndex);
    return [isImg, end];
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

  const downloadFile = async () => {
    if (fileDownloadUrl){
     try {
      let req = await axios.get(fileDownloadUrl, {responseType: "blob"});
      fileDownload(req.data, 'download');
     } catch (error) {
        setError('Unable to download');
        console.log(error?.message)
     }
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
          {fileDownloadUrl && (
            <FileDownloadContainer>
              {checkFileType(fileDownloadUrl)[0] ? (
                <img
                  src={fileDownloadUrl}
                  alt=""
                  style={{
                    maxHeight: "200px",
                    maxWidth: "400px",
                    padding: "10px",
                  }}
                />
              ) : (
                <div>
                  <InsertDriveFileIcon
                    className="fileIcon"
                    onClick={() => downloadFile()}
                  />
                  {/* <GetAppIcon className='downloadIcon'/> */}
                  <h4>.{checkFileType(fileDownloadUrl)[1]}</h4>
                  {error && <h4 style={{color:'red'}}>{error}</h4>}
                </div>
              )}
            </FileDownloadContainer>
          )}
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

const FileDownloadContainer = styled.div`
  > div {
    > .MuiSvgIcon-root {
      font-size: 80px;
      color: lightgray;
      box-shadow: 5px gray;
      :hover {
        transform: scale(1.05);
        opacity: 0.8;
        cursor: pointer;
      }
    }

    > h4 {
      margin-left: 50px;
    }
  }
`;

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
