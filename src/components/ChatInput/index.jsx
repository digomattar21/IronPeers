import { Button } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { auth, db, storage } from "../../firebase";
import firebase from "firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import BackupIcon from "@material-ui/icons/Backup";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import CancelIcon from "@material-ui/icons/Cancel";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import CachedIcon from "@material-ui/icons/Cached";
import Picker, {
  SKIN_TONE_MEDIUM_DARK,
  SKIN_TONE_NEUTRAL,
  SKIN_TONE_LIGHT,
} from "emoji-picker-react";
import EmojiPicker from "emoji-picker-react";

function ChatInput({ channelName, channelId, chatBottomRef, Private, dmId }) {
  const [message, setMessage] = useState("");
  const [fileUrl, setFileUrl] = useState(null);
  const [user] = useAuthState(auth);
  const inputFileRef = useRef(null);
  const [hasFile, setHasFile] = useState(false);
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loadingState, setLoadingState] = useState(false);


  const sendMessage = async (e) => {
    e.preventDefault();
    if (!channelId && !dmId) {
      return false;
    }
    try {
    if (message.length >= 1 && !fileUrl) {
      
        if (Private===true || Private===false){
          await db
            .collection(Private?'privaterooms':'rooms')
            .doc(channelId)
            .collection("messages")
            .add({
              message: message,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              user: user?.displayName,
              userImage: user?.photoURL,
              fileDownloadUrl: '',
              likes: [],
            });
        }else{
          await db
            .collection("dms")
            .doc(dmId)
            .collection("messages")
            .add({
              message: message,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              user: user?.displayName,
              userImage: user?.photoURL,
              fileDownloadUrl: '',
              likes: [],
            });
        }
        
      
      chatBottomRef?.current.scrollIntoView({
        behavior: "smooth",
      });

      setMessage("");
      }
     else if (fileUrl) {
      if (Private == true) {
        await db
          .collection("privaterooms")
          .doc(channelId)
          .collection("messages")
          .add({
            message: message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            user: user?.displayName,
            userImage: user?.photoURL,
            fileDownloadUrl: fileUrl,
            likes: [],
          });
        setFileUrl(null);
        setHasFile(false);
      } else if (Private==false) {
        await db.collection("rooms").doc(channelId).collection("messages").add({
          message: message,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          user: user?.displayName,
          userImage: user?.photoURL,
          fileDownloadUrl: fileUrl,
          likes:[]
        });
        setFileUrl(null);
        setHasFile(false);
      }
        else{
          await db.collection("dms").doc(dmId).collection("messages").add({
            message: message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            user: user?.displayName,
            userImage: user?.photoURL,
            fileDownloadUrl: fileUrl,
            likes: []
          })
          setFileUrl(null);
          setHasFile(false);
        }
        
      }
    } catch (err) {
      console.log(err);
    }
    
  };

  const onFileChange = async (e) => {
    try {
      setLoadingState(true)
      const file = e.target.files[0];
      const storageRef = storage.ref();
      const fileRef = storageRef.child(file.name);
      await fileRef.put(file);
      setFileUrl(await fileRef.getDownloadURL());
      setHasFile(true);
      setLoadingState(false)
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    if (e.target.value) {
      setMessage(e.target.value);
    } else if (e.target.value === "") {
      setMessage("");
    }
  };

  const onFileChooseBtnClick = () => {
    inputFileRef.current.click();
  };

  const handlePickEmoji = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
    setShowEmojiPicker(false);
    setMessage(`${message} ${emojiObject.emoji}`)
  };

  const handleCancelFile = () =>{
    setFileUrl(null);
    setHasFile(false);
  }

  return (
    <ChatInputContainer>
      <form>
        <FormContainer>
          
          <input
            className="textInput"
            onChange={(e) => handleChange(e)}
            value={message}
            placeholder={`Message #${channelName}`}
          ></input>
          {hasFile && (
            <>
              <InsertDriveFileIcon className="fileIcon" />
              <CancelIcon className="cancelIcon" onClick={()=>handleCancelFile()}/>
            </>
          )}
          {loadingState && !hasFile && (
              <>
                <CachedIcon className='cachedIcon' />
              </>
          )}
          <ControlsContainer>
            <Button
              type="button"
              variant="contained"
              size="small"
              className="fileInputBtn"
              onClick={() => onFileChooseBtnClick()}
            >
              <BackupIcon style={{ color: "#f8f8f8" }} />
              <input
                className="fileInput"
                type="file"
                id="fileInput"
                ref={inputFileRef}
                onChange={(e) => onFileChange(e)}
                hidden
              ></input>
            </Button>
            <EmojiInputContainer
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Button variant="contained" size="small">
              <EmojiEmotionsIcon className="emoji-icon" />
            </Button>
            {showEmojiPicker && <Picker onEmojiClick={handlePickEmoji} />}
          </EmojiInputContainer>
          </ControlsContainer>
        </FormContainer>
        <Button hidden type="submit" onClick={(e) => sendMessage(e)} />
      </form>
    </ChatInputContainer>
  );
}

export default ChatInput;

const ControlsContainer = styled.div`
  position: fixed;
  display: flex;
  bottom: 10px;
  border-radius: 5px;
  right: 15%;
  padding: 5px 10px;

  .fileInputBtn {
    position: fixed;
    bottom: 40px;
    background-color: var(--ironblue-color);
  }
`;

const spinAnimation = keyframes`
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }

`;

const EmojiInputContainer = styled.div`
  position: fixed;
  bottom: 40px;
  right: 5%;
  >button{
    background-color: var(--ironblue-color);
    color: white
  }
`;

const FormContainer = styled.div`
  position: fixed;
  outline: none;
  width: 60%;
  bottom: 28px;
  left: 29%;
  > .textInput {
    border: 1px solid gray;
    border-radius: 10px;
    padding: 20px;
    outline: none;
    width: 50vw;
  }

  .fileIcon {
    color: var(--ironblue-color);
    font-size: 32px;
    margin-bottom: 2.5%;
    
  }


  .cachedIcon{
    color: var(--ironblue-color);
    font-size: 32px;
    margin-bottom: 2.5%;
    animation-name: ${spinAnimation};
    animation-duration: 3s;
    animation-iteration-count: infinite
  }

  .cancelIcon {
    color: red;
    margin-bottom: 4%;
    :hover {
      transform: scale(1.1);
      cursor: pointer;
    }
  }
`;

const ChatInputContainer = styled.div`
  border-radius: 20px;
  > form {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
