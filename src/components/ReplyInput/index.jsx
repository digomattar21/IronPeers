import React, { useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import BackupIcon from "@material-ui/icons/Backup";
import { Button } from "@material-ui/core";
import { auth, db, storage } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import CachedIcon from "@material-ui/icons/Cached";
import Picker, {
  SKIN_TONE_MEDIUM_DARK,
  SKIN_TONE_NEUTRAL,
  SKIN_TONE_LIGHT,
} from "emoji-picker-react";
import EmojiPicker from "emoji-picker-react";
import firebase from 'firebase';

function ReplyInput({ channelId, id, isPrivate, hasReplies }) {
  const [message, setMessage] = useState("");
  const [fileUrl, setFileUrl] = useState(null);
  const [user] = useAuthState(auth);
  const inputFileRef = useRef(null);
  const [hasFile, setHasFile] = useState(false);
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loadingState, setLoadingState] = useState(false);

  const onFileChange = async (e) => {
    try {
      setLoadingState(true);
      const file = e.target.files[0];
      const storageRef = storage.ref();
      const fileRef = storageRef.child(file.name);
      await fileRef.put(file);
      let temp = await fileRef.getDownloadURL();
      setFileUrl(temp);
      setHasFile(true);
      setLoadingState(false);
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
    setMessage(`${message} ${emojiObject.emoji}`);
  };

  const handleCancelFile = () => {
    setFileUrl(null);
    setHasFile(false);
  };

  const sendReply = (e) => {
    e.preventDefault();
    setMessage("")
    db.collection(isPrivate ? "privaterooms" : "rooms")
      .doc(channelId)
      .collection("messages")
      .doc(id)
      .collection("replies")
      .add({
        message: message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        user: user?.displayName,
        userImage: user?.photoURL,
        fileDownloadUrl: fileUrl || "",
        likes: [],
      });
      
  };

  return (
    <ReplyInputContainer>
      <form onSubmit={(e)=>sendReply(e)}>
        <input
          className="textInput"
          onChange={(e) => handleChange(e)}
          value={message}
          placeholder={`Reply`}
        >
          
        </input>
        <EmojiInputContainer
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          {!showEmojiPicker && (
            <Button variant="contained" size="small">
              <EmojiEmotionsIcon className="emoji-icon" />
            </Button>
          )}
          {showEmojiPicker && <Picker onEmojiClick={handlePickEmoji} />}
        </EmojiInputContainer>
        <Button type="button" onClick={() => onFileChooseBtnClick()}>
          {!loadingState && (
            <>
              <BackupIcon />
              <input
                className="fileInput"
                type="file"
                id="fileInput"
                ref={inputFileRef}
                onChange={(e) => onFileChange(e)}
                hidden
              ></input>
            </>
          )}
          {loadingState && <CachedIcon className="cachedIcon" />}
        </Button>
        <Button type="button">
          <EmojiEmotionsIcon className="emojiIcon"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          />
        </Button>
        <Button
          style={{ display: "none" }}
          type="submit"
          onClick={(e) => sendReply(e)}
        />
      </form>
    </ReplyInputContainer>
  );
}

export default ReplyInput;

const spinAnimation = keyframes`
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }

`;

const ReplyInputContainer = styled.div`
  display: flex;
  justify-content: center;
  > form {
    >input{
      :focus{
        outline: none;
      }
    }
    > button {
      margin-left: 5px;
      background-color: var(--ironblue-color);
      .MuiSvgIcon-root {
        color: white;
      }
      :hover {
        cursor: pointer;
      }
      .cachedIcon {
        color: white;
        animation-name: ${spinAnimation};
        animation-duration: 3s;
        animation-iteration-count: infinite;
      }
    }
  }
`;

const EmojiInputContainer = styled.div`
  position: fixed;
  bottom: 40px;
  right: 5%;
`;
