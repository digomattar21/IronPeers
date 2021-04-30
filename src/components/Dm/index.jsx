import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { auth, db } from '../../firebase';
import { useHistory, useParams } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import CloseIcon from "@material-ui/icons/Close";
import LockIcon from "@material-ui/icons/Lock";
import { useSelector } from "react-redux";
import ChatInput from "../ChatInput";
import Message from "../Message";
import Api from "../../util/api.util";
import RoomDetails from "../RoomDetails";

const Dm = () =>{
  const chatBottomRef = useRef(null);
  const { dmId } = useParams();
  const [user] = useAuthState(auth);
  const [buttonForExit, setButtonForExit] = useState(false);
  const [displayDetails, setDisplayDetails] = useState(false);
  const [dmName, setDmName] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const history = useHistory()
  
  const [dmDetails] = useDocument(
    dmId && db.collection("dms").doc(dmId)
  );

  const [dmMessages, loading] = useCollection(
    dmId &&
      db
        .collection("dms")
        .doc(dmId)
        .collection("messages")
        .orderBy("timestamp", "asc")
  );
  
  const handleDetailsClick = (e) => {
    setDisplayDetails(true);
    setButtonForExit(true);
  };

  const handleExitDetailsClick = (e) => {
    setButtonForExit(false);
    setDisplayDetails(false);
  };

  useEffect(()=>{
    chatBottomRef?.current?.scrollIntoView({
      behavior: "smooth",
    });
    getInfo()
  },[dmDetails, loading])
  
  const getInfo = () => {
    if (dmDetails){
      if (dmDetails?.data().userOneUsername===user.displayName){
        setDmName(dmDetails?.data().userTwoUsername)
        setProfilePic(dmDetails?.data().userTwoProfilePic)
      }else{
        setDmName(dmDetails?.data().userOneUsername)
        setProfilePic(dmDetails?.data().userOneProfilePic)
      }
    }
  }

  const handleMemberClick = async () =>{
    if (!dmName) return;
    try {
      let req = await Api.getUserEmail({username: dmName});
      history.push({
        pathname: "/user/profile",
        search: req.data.email
      })
    } catch (error) {
      console.log(error)
    }
  }


  return(
    <ChannelContainer>
      {dmDetails && dmMessages && (
        <>
          <Header >
            <HeaderLeft>
              <div className="first-container" onClick={()=>handleMemberClick()}>
                <img src={profilePic && profilePic} width='32' height='32' style={{borderRadius: '7px'}} />
                <h4 style={{ marginLeft: "10px" }}>
                  {dmName && dmName}
                </h4>
              </div>
              
            </HeaderLeft>

            <HeaderRight>
              <div>
                {!buttonForExit && (
                  <InfoOutlinedIcon onClick={handleDetailsClick} />
                )}
                {buttonForExit && (
                  <CloseIcon onClick={handleExitDetailsClick} />
                )}
              </div>
            </HeaderRight>
          </Header>
          
          {!displayDetails && (
            <>
              <ChatMessages>
                {dmMessages?.docs.map((doc) => {
                  const { message, timestamp, user, userImage, fileDownloadUrl, likes } = doc.data();
                  return (
                    <Message
                      Private={null}
                      key={doc.id}
                      id={doc.id}
                      message={message}
                      user={user}
                      timestamp={timestamp}
                      userImage={userImage}
                      channelId={null}
                      dmId={dmId}
                      channelName={dmDetails?.data().name}
                      fileDownloadUrl={fileDownloadUrl}
                      likes={likes}
                    />
                  );
                })}

                <ChatBottom ref={chatBottomRef} />
              </ChatMessages>
            
            <ChatInput
            Private={null}
            chatBottomRef={chatBottomRef}
            dmId={dmId}
            channelId={null}
            channelName={dmName}
          />
        </>
          )}
          
          </>
      )}
    </ChannelContainer>
  )

}

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid lightgray;
  position: fixed;
  background-color: white;
  width: 80%;
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  > .second-container {
    display: flex;
    align-items: center;
    margin-top: 5px;

    > h6 {
      color: darkgray;
    }

    > .MuiSvgIcon-root {
      font-size: 10px;
      color: darkgray;
      margin-right: 4px;
    }
  }

  > .first-container {
    display: flex;
    align-items: center;
    > .MuiSvgIcon-root {
      margin-left: 1px;
      font-size: 20px;
      color: green;
      :hover {
        cursor: pointer;
        transform: scale(1.05);
        opacity: 0.8;
      }
    }
    > h4 {
      font-weight: bold;
      display: flex;
      text-transform: lowercase;
      margin-right: 5px;
      :hover{
        opacity: 0.8;
        cursor: pointer;
        text-decoration: underline;
      }
    }
    :hover{
      text-decoration: underline;
      cursor: pointer;
    }
    
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  :hover {
    opacity: 0.8;
    cursor: pointer;
  }
  > div {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: black;
    border: 2px solid darkgray;
    padding: 8px 12px;
    border-radius: 6px;
  }

  > p > .MuiSvgIcon-root {
    margin-right: 5px !important;
    font-size: 16px;
  }
`;

const ChannelContainer = styled.div`
  flex: 0.7;
  flex-grow: 1;
  overflow-y: scroll;
  margin-top: 48px;
`;

const ChatMessages = styled.div`
  margin-top: 70px;
`;

const ChatBottom = styled.div`
  padding-bottom: 200px;
`;


const DmMainContainer = styled.div`
  flex: 0.7
`;


export default Dm;