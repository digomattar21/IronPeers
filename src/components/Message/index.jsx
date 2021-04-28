import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styled, { keyframes } from "styled-components";
import { auth, db } from "../../firebase";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import LabelImportantIcon from "@material-ui/icons/LabelImportant";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import CloseIcon from "@material-ui/icons/Close";
import Api from "../../util/api.util";
import { useHistory } from "react-router";
import axios from "axios";
import fileDownload from "js-file-download";
import CachedIcon from "@material-ui/icons/Cached";
import AddCommentIcon from "@material-ui/icons/AddComment";
import MessageReply from "../MesssageReply";
import ReplyInput from "../ReplyInput";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useCollection } from "react-firebase-hooks/firestore";

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
  likes,
  dmId,
}) {
  const [userState] = useAuthState(auth);
  const [iconsShow, setIconsShow] = useState(false);
  const history = useHistory();
  const [error, setError] = useState(null);
  const [ready, setReady] = useState(true);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [hasReplies, setHasReplies] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const [messageReplies, loading] = useCollection(
    channelId &&
      db
        .collection(Private ? "privaterooms" : "rooms")
        .doc(channelId)
        .collection("messages")
        .doc(id)
        .collection("replies")
        .orderBy("timestamp", "desc")
  );

  const handleBookmarkClick = async (e) => {
    const payload = { channelId: channelId, firebaseId: id, message: message };
    try {
      setReady(false);
      let req;
      if (Private == true) {
        req = await Api.bookMarkPrivateMessage(payload);
      } else if (Private == false) {
        req = await Api.bookMarkMessage(payload);
      }
      if (userState.email) {
        console.log(fileDownloadUrl);
        const newPayload = {
          channelId: channelId,
          messageFirebaseId: id,
          message: message,
          email: userState.email,
          messageOwner: user,
          channelName: channelName,
          fileURL: fileDownloadUrl || "",
        };
        if (Private == true) {
          let updatedPrivateUserBookmarks = await Api.addPrivateUserBookMark(
            newPayload
          );
          console.log("entrou");
        } else if (Private == false) {
          let updatedUserBookmarks = await Api.addUserBookMark(newPayload);
        }
      }
      setTimeout(() => {
        setReady(true);
      }, 1000);
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
    setReady(false);
    const payload = {
      channelId: channelId,
      messageFirebaseId: id,
      message: message,
      messageOwner: user,
    };

    try {
      if (Private == true) {
        let req = await Api.pinPrivateMessage(payload);
      } else if (Private == false) {
        let req = await Api.pinMessage(payload);
      }
    } catch (err) {
      console.log(err);
    }
    setReady(true);
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

  const handleLikeClick = () => {
    if (likes.includes(userState.email)) {
      return;
    }
    let newLikesArray = [...likes];
    newLikesArray.push(userState.email);
    if (Private == false || Private == true) {
      db.collection(Private ? "privaterooms" : "rooms")
        .doc(channelId)
        .collection("messages")
        .doc(id)
        .set(
          {
            likes: newLikesArray,
          },
          { merge: true }
        );
    } else {
      db.collection("dms").doc(dmId).collection("messages").doc(id).set(
        {
          likes: newLikesArray,
        },
        { merge: true }
      );
    }
  };

  const handleDeleteClick = async (e) => {
    console.log(user, userState.displayName);
    if (user === userState.displayName) {
      if (Private == true || Private == false) {
        db.collection(Private ? "privaterooms" : "rooms")
          .doc(channelId)
          .collection("messages")
          .doc(id)
          .delete();
          try{
            let checkIfPinned = await Api.checkDelete({channeFirebaseId: channelId, Private: Private, messageFirebaseId: id});
            console.log(checkIfPinned)
          }catch(err){
            console.log(err)
          }
          
      } else {
        db.collection("dms").doc(dmId).collection("messages").doc(id).delete();
      }
    }
  };

  const handleOpenReplyInput = () => {
    setShowReplies(!showReplies);
  };

  const checkReplies = () => {
    if (Private != null) {
      let repliesReq = db
        .collection(Private ? "privaterooms" : "rooms")
        .doc(channelId)
        .collection("messages")
        .doc(id)
        .collection("replies");
      repliesReq.get().then((reply) => {
        if (reply.docs.length > 0) {
          let temp = [];
          reply.docs.map((doc) => {
            temp.push(doc.data());
          });
          setReplies(temp);
          setHasReplies(true);
        }
      });
    } else {
      let repliesReq = db
        .collection("dms")
        .doc(dmId)
        .collection("messages")
        .doc(id)
        .collection("replies");
      repliesReq.get().then((reply) => {
        if (reply.docs.length > 0) {
          let temp = [];
          reply.docs.map((doc) => {
            temp.push(doc.data());
          });
          setReplies(temp);
          setHasReplies(true);
        }
      });
    }
  };

  useEffect(() => {
    checkReplies();
  }, []);

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
                  <a target="_blank" href={fileDownloadUrl}>
                    <InsertDriveFileIcon
                      className="fileIcon"
                      // onClick={() => downloadFile()}
                    />
                  </a>
                  {/* <GetAppIcon className='downloadIcon'/> */}
                  <h4>.{checkFileType(fileDownloadUrl)[1]}</h4>
                  {error && <h4 style={{ color: "red" }}>{error}</h4>}
                </div>
              )}
            </FileDownloadContainer>
          )}
          <MessageActionsContainer>
            <div onClick={() => handleLikeClick()}>
              <FavoriteBorderIcon />
              <h4>{likes?.length}</h4>
            </div>
            {channelId && (
              <div onClick={() => handleOpenReplyInput()}>
                <h5>Reply ({messageReplies?.docs.length})</h5>
                {showReplies && <ExpandLessIcon />}
                {!showReplies && <ExpandMoreIcon />}
              </div>
            )}
          </MessageActionsContainer>
          <RepliesContainer>
            {showReplies && (
              <>
                <ReplyInput
                  hasReplies={hasReplies}
                  isPrivate={Private}
                  id={id}
                  channelId={channelId}
                />
                {messageReplies.docs.map((doc) => {
                  const {
                    message,
                    timestamp,
                    user,
                    userImage,
                    fileDownloadUrl,
                    likes,
                  } = doc.data();
                  console.log(fileDownloadUrl);
                  return (
                    <MessageReply
                      key={doc.id}
                      replyId={doc.id}
                      userImage={userImage}
                      user={user}
                      message={message}
                      fileDownloadUrl={fileDownloadUrl || ""}
                      timestamp={timestamp}
                      likes={likes}
                      channelId={channelId}
                      id={id}
                      Private={Private}
                    />
                  );
                })}
              </>
            )}
          </RepliesContainer>
        </MessageInfo>
      </MessageLeftContainer>
      <MessageRightContainer>
        {iconsShow && (
          <MessageIconsContainer>
            {ready && (
              <>
                {channelId && (
                  <>
                    <BookmarkBorderIcon
                      onClick={(e) => handleBookmarkClick(e)}
                    />

                    <AddCommentIcon onClick={(e) => handleOpenReplyInput(e)} />

                    <LabelImportantIcon onClick={(e) => handlePinClick(e)} />
                  </>
                )}

                <CloseIcon onClick={(e) => handleDeleteClick(e)} />
              </>
            )}
            {!ready && (
              <>
                <CachedIcon className="cachedIcon" />
              </>
            )}
          </MessageIconsContainer>
        )}
      </MessageRightContainer>
    </MessageContainer>
  );
}

export default Message;

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
  align-items: flex-start;
  :hover {
    background-color: #f5f8f8;
    border-bottom: 1px solid lightgray;
  }
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
  margin-top: 17px;
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
