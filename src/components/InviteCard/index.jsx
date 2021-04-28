import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import GroupIcon from "@material-ui/icons/Group";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import Api from "../../util/api.util.js";
import { Link, Redirect } from "react-router-dom";
import Loading from "../Loading/index.jsx";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase.js";
import SendIcon from "@material-ui/icons/Send";

function InviteCard({
  userWhoInvited,
  read,
  channelFirebaseId,
  id,
  dmId,
  reRender,
  setReRender,
}) {
  const [userWhoInvitedName, setUserWhoInvitedName] = useState(null);
  const [membersLength, setMembersLength] = useState(null);
  const [channelName, setChannelName] = useState(null);
  const [user] = useAuthState(auth);

  const getInviteInfo = async () => {
    let payload = {
      userWhoInvited: userWhoInvited,
      channelFirebaseId: channelFirebaseId,
      dmId: dmId,
    };
    try {
      let req = await Api.getInviteInfo(payload);
      setUserWhoInvitedName(req.data.userName);
      if (!dmId){
        setMembersLength(req.data.membersLength);
        setChannelName(req.data.channelName);}
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    let payload = { inviteId: id };
    try {
      setReRender(!reRender);
      await Api.deleteInvite(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRedirect = async () => {
    let payload = {
      userEmail: user.email,
      channelFirebaseId: channelFirebaseId,
      inviteId: id,
    };
    try {
      let req = await Api.userJoinPrivateChannel(payload);
      console.log(req);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDmRedirect = async ()=>{
    const payload = {
      inviteId: id,
      userEmail: user.email,
      otherUsername: userWhoInvitedName,
      dmId: dmId
    }
    try {
      let req = await Api.addNewDm(payload);
      console.log(req)
      db.collection("dms").doc(dmId).set({
        userTwoProfilePic: user.photoURL},
        {merge: true}
      )
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getInviteInfo();
  }, []);

  return (
    <CardContainer>
      {!channelName && !membersLength && !userWhoInvitedName && !dmId && (
        <Loading />
      )}
      {channelName && membersLength && userWhoInvitedName && (
        <Card className="card">
          <CardContent className="card-content">
            <div className="first-text-container">
              <Typography style={{ fontSize: "12px" }} gutterBottom>
                {userWhoInvitedName && channelName && (
                  <span>
                    {userWhoInvitedName} invited you to join{" "}
                    <span style={{ fontWeight: "bold" }}>#{channelName}</span>
                  </span>
                )}
              </Typography>
              {!read && <FiberManualRecordIcon />}
            </div>

            <Typography className="members-container" color="textSecondary">
              <div>
                <GroupIcon />
                <h6> members : {membersLength}</h6>
              </div>
            </Typography>
          </CardContent>

          <CardActions className="card-actions">
            <Link to={`/channel/private/${channelFirebaseId}`} className="link">
              <Button
                className="joinBtn"
                size="small"
                variant="contained"
                endIcon={<ExitToAppIcon style={{ color: "white" }} />}
                onClick={() => handleRedirect()}
              />
            </Link>
            <Link className="link">
              <Button
                size="small"
                className="deleteBtn"
                variant="contained"
                endIcon={<HighlightOffIcon style={{ color: "white" }} />}
                onClick={() => handleDelete()}
              />
            </Link>
          </CardActions>
        </Card>
      )}
      {!channelName && dmId && (
        <Card className="card">
          <CardContent className="card-content">
            <div className="first-text-container">
              <Typography style={{ fontSize: "12px" }} gutterBottom>
                {userWhoInvitedName && (
                  <DmInfoContainer>
                  <span style={{fontWeight: "bold"}}>
                    {userWhoInvitedName} <span style={{fontWeight: "400"}}>is requesting to send you a DM</span>
                  </span>
                    <SendIcon />
                  </DmInfoContainer>
                )}
              </Typography>
            </div>
          </CardContent>

          <CardActions className="card-actions">
            <Link to={`/user/directmessages/${dmId}`} className="link" style={{textDecoration: "none", color: "white" }}>
              <Button
                className="joinBtn"
                size="small"
                variant="contained"
                endIcon={<ExitToAppIcon style={{ color: "white" }} />}
                onClick={() => handleDmRedirect()}
              >Accept</Button>
            </Link>
            <Link className="link" style={{textDecoration: "none", color: "white" }}>
              <Button
                size="small"
                className="deleteBtn"
                variant="contained"
                endIcon={<HighlightOffIcon style={{ color: "white" }} />}
                onClick={() => handleDelete()}
              >Deny</Button>
            </Link>
          </CardActions>
        </Card>
      )}
    </CardContainer>
  );
}

export default InviteCard;

const DmInfoContainer = styled.div`
  display: flex;
  justify-content: center;
  >.MuiSvgIcon-root {
    margin-left: 8px;
    color: var(--ironblue-color)
  }

`;

const CardContainer = styled.div`
  margin-top: 30px;
  min-width: 275;

  > .card {
    > .card-actions {
      display: flex;
      justify-content: center;
      > .link {
        > .joinBtn {
          color: white;
          background-color: var(--ironblue-color);
        }
        > .deleteBtn {
          color: white;
          background-color: red;
        }
      }
    }
    > .card-content {
      > .first-text-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        > span {
          font-weight: bold;
        }
        > .MuiSvgIcon-root {
          color: red;
          font-size: 8px;
          padding: 5px 10px;
        }
      }
      > .members-container {
        > div {
          display: flex;
          align-items: center;
          > h6 {
            font-size: 10px;
            font-weight: 600;
          }

          > .MuiSvgIcon-root {
            font-size: 10px;
            color: darkgray;
            margin-right: 4px;
          }
        }
      }
    }
  }
`;
