import React, {  useState } from "react";
import styled from "styled-components";
import LockIcon from '@material-ui/icons/Lock';
import axios from "axios";
import fileDownload from 'js-file-download';
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Api from "../../util/api.util";
import CancelIcon from '@material-ui/icons/Cancel'



function BookmarkedCard({ bookmark, reRender, setReRender }) {
  const [error, setError] = useState(null);
  const [user] = useAuthState(auth);


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
    if (bookmark.fileURL.length > 0) {
     try {
      let req = await axios.get(bookmark.fileURL, {responseType: "blob"});
      fileDownload(req.data, 'download');
     } catch (error) {
        setError('Unable to download');
        console.log(error?.message)
     }
    }}

    const handleRemoveBookmark = async () => {
      let payload = {fileURL: bookmark.fileURL, userEmail: user.email, messageFirebaseId: bookmark.messageFirebaseId, bookmarkMongoId: bookmark._id, isPrivate: bookmark.isPrivate};
      try {
        let req = await Api.removeBookmarkedMessage(payload);
        setReRender(!reRender)
      } catch (error) {
        console.log(error)
      } 
    }


  return (
    <BookMarkedCardContainer>
      <BookmarkContainer>
        <BookmarkInfo>
          <RemoveBookmarkContainer>
          <CancelIcon className='cancelIcon' onClick={()=>handleRemoveBookmark()}/>

          </RemoveBookmarkContainer>
          <div className="channelContainer">
            {bookmark.isPrivate ? (
              <>
              <LockIcon />
              <h5>{bookmark.channelName}</h5>
              </>
            ):(
              <h5>#{bookmark.channelName}</h5>
            )}
          </div>
            <h4>
            {bookmark.messageOwner} <span>{(bookmark.createdAt.split('T')[0])} {bookmark.createdAt.split('T')[1].slice(0,-2)}</span>
          </h4>
          <p>{bookmark.message}</p>
          {bookmark.fileURL.length>0 && (
            <FileDownloadContainer>
              {checkFileType(bookmark.fileURL)[0] ? (
                <img
                  src={bookmark.fileURL}
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
                  <h4>.{checkFileType(bookmark.fileURL)[1]}</h4>
                  {error && <h4 style={{color:'red'}}>{error}</h4>}
                </div>
              )}
            </FileDownloadContainer>
          )}
        </BookmarkInfo>
      </BookmarkContainer>
    </BookMarkedCardContainer>
  );
}

export default BookmarkedCard;

const RemoveBookmarkContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  height: 10px;
  >.MuiSvgIcon-root {
    color: red;
    margin-left: 25%;
  }
`;

const BookMarkedCardContainer = styled.div`
  padding: 25px 50px;
  text-align: center;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 10px > h4 {
    font-size: 15px;
    font-weight: 200;
  }
`;

const FileDownloadContainer = styled.div`

`

const BookmarkContainer = styled.div`
  display: flex;
  align-items: center;
`;

const BookmarkInfo = styled.div`
  padding-left: 10px;
  >p{
    margin-top: 10px;
  }

  > h4 {
    display: flex;
    align-items: center;
  }

  > h4 > span {
    color: gray;
    font-weight: 200px;
    margin-left: 8px;
    font-size: 10px;
  }
  >.channelContainer{
    display: flex;
    align-items: center;
    justify-content:center;
    >.MuiSvgIcon-root {
      color: green;
      font-size: 15px;
    }
    margin-bottom: 15px;
  }
  >div>.cancelIcon{
    font-size: 15px;
    :hover{
      cursor: pointer;
      transform: scale(1.1)
    }
  }
`;

