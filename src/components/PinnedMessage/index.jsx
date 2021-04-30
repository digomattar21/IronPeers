import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth } from "../../firebase";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";

function PinnedMessage({ message, channelId, isPrivate }) {
  const [error, setError] = useState(null);
  const [user] = useAuthState(auth);

  const checkFileType = (url) => {
    if (url && url != "") {
      let questionMarkIndex = url.indexOf("?");
      let stringSliced = url.substring(0, questionMarkIndex);
      let isImg =
        stringSliced.endsWith(".jpg") ||
        stringSliced.endsWith(".gif") ||
        stringSliced.endsWith(".png") ||
        stringSliced.endsWith(".jpeg");
      let end = stringSliced.slice(questionMarkIndex - 3, questionMarkIndex);
      return [isImg, end];
    }else{
        return [false]
    }
  };


  return (
    <MessageContainer>
      <MessageLeftContainer>
        <img src={message?.userImage} alt="user profile img" />
        <MessageInfo>
          <h4>
            {message?.user}{" "}
            <span>{new Date(message?.timestamp?.toDate()).toUTCString()}</span>
          </h4>
          <p>{message?.message}</p>
          {message?.fileDownloadUrl != "" && (
            <FileDownloadContainer>
              {checkFileType(message?.fileDownloadUrl)[0] ? (
                <img
                  src={message?.fileDownloadUrl}
                  alt=""
                  style={{
                    maxHeight: "120px",
                    maxWidth: "300px",
                    padding: "10px",
                  }}
                />
              ) : (
                <div>
                  <a target="_blank" href={message?.fileDownloadUrl}>
                    <InsertDriveFileIcon
                      className="fileIcon"
                    />
                  </a>
                  <h4>.{checkFileType(message?.fileDownloadUrl)[1]}</h4>
                  {error && <h4 style={{ color: "red" }}>{error}</h4>}
                </div>
              )}
            </FileDownloadContainer>
          )}
        </MessageInfo>
      </MessageLeftContainer>
    </MessageContainer>
  );
}

export default PinnedMessage;

const MessageContainer = styled.div`
  display: flex;
  background-color:white;
  margin-top:8px;
  padding: 7px 15px;
  align-items: flex-start;
  border: 1px solid lightgray;
    border-radius: 5px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
`;

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

const MessageLeftContainer = styled.div`
  display: flex;

  padding: 5px;
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
