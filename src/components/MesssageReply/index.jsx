import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styled, { keyframes } from "styled-components";
import { auth, db } from "../../firebase";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import axios from "axios";
import fileDownload from "js-file-download";

import BackspaceIcon from '@material-ui/icons/Backspace';

function MessageReply({
  message,
  timestamp,
  user,
  userImage,
  id,
  channelId,
  channelName,
  Private,
  fileDownloadUrl,
  likes,
  replyId
}) {
  const [userState] = useAuthState(auth);
  const [error, setError] = useState(null);

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

  const downloadFile = async () => {
    if (fileDownloadUrl) {
      try {
        let req = await axios.get(fileDownloadUrl, { responseType: "blob" });
        fileDownload(req.data, "download");
      } catch (error) {
        setError("Unable to download");
        console.log(error?.message);
      }
    }
  };

  const handleReplyLikeClick = () => {
    if (likes.includes(userState.email)) {
      return;
    }
    let newLikesArray = [...likes];
    newLikesArray.push(userState.email);
    db.collection(Private ? "privaterooms" : "rooms")
      .doc(channelId)
      .collection("messages")
      .doc(id)
      .collection("replies")
      .doc(replyId)
      .update(
        {
          likes: newLikesArray,
        }
      );
  };

  const handleDeleteClick = (e) => {
    if (user === userState.displayName) {
      db.collection(Private ? "privaterooms" : "rooms")
        .doc(channelId)
        .collection("messages")
        .doc(id)
        .collection("replies")
        .doc(replyId)
        .delete();
    }
  };

  return (
    <MessageContainer>
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
                    maxHeight: "120px",
                    maxWidth: "300px",
                    padding: "10px",
                  }}
                />
              ) : (
                <div>
                  <a target="_blank" href={fileDownloadUrl}>
                    <InsertDriveFileIcon
                      className="fileIcon"
                    />
                  </a>
                  <h4>.{checkFileType(fileDownloadUrl)[1]}</h4>
                  {error && <h4 style={{ color: "red" }}>{error}</h4>}
                </div>
              )}
            </FileDownloadContainer>
          )}
          <MessageActionsContainer>
            <div onClick={() => handleReplyLikeClick()}>
              <FavoriteBorderIcon />
              <h4>{likes?.length}</h4>
            </div>
            <div className="deleteDiv">
                <BackspaceIcon onClick={(e)=>handleDeleteClick(e)}/>

            </div>
          </MessageActionsContainer>
        </MessageInfo>
      </MessageLeftContainer>
      <MessageRightContainer></MessageRightContainer>
    </MessageContainer>
  );
}

export default MessageReply;
const FileDownloadContainer = styled.div`
  > div {
    > a {
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
    }

    > h4 {
      margin-left: 50px;
    }
  }
`;

const RepliesContainer = styled.div``;

const MessageActionsContainer = styled.div`
  margin-top: 6px;
  display: flex;
  justify-content: space-around;
  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--ironblue-color);
    margin-left: 20px;

    > .MuiSvgIcon-root {
      color: var(--ironblue-color);
      :hover {
        cursor: pointer;
        transform: scale(1.1);
      }
    }
  }
`;

const MessageContainer = styled.div`
  display: flex;
  align-items: center;
`;

const spinAnimation = keyframes`
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }

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
      transform: scale(1.2);
    }
  }
  .cachedIcon {
    animation-name: ${spinAnimation};
    animation-duration: 3s;
    animation-iteration-count: infinite;
    :hover {
      animation-name: ${spinAnimation};
      animation-duration: 3s;
      animation-iteration-count: infinite;
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
