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
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Api from "../../util/api.util.js";
import { Link, Redirect } from "react-router-dom";

function InviteCard({ userWhoInvited, read, channelFirebaseId }) {
  const [userWhoInvitedName, setUserWhoInvitedName] = useState(null);
  const [membersLength, setMembersLength] = useState(null);
  const [channelName, setChannelName] = useState(null);

  const getInviteInfo = async () => {
    let payload = {
      userWhoInvited: userWhoInvited,
      channelFirebaseId: channelFirebaseId,
    };
    try {
      let req = await Api.getInviteInfo(payload);
      setMembersLength(req.data.membersLength);
      setUserWhoInvitedName(req.data.userName);
      setChannelName(req.data.channelName);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRedirect = () =>{
      return <Redirect to={`/channel/private/${channelFirebaseId}`}/>
  }

  useEffect(() => {
    getInviteInfo();
  }, []);

  return (
    <CardContainer>
      <Card className="card">
        <CardContent className="card-content">
          <div className="first-text-container">
            <Typography
              style={{ fontSize: "12px" }}
              gutterBottom
            >
              {(userWhoInvitedName && channelName) && (
                  <span>{userWhoInvitedName} invited you to join <span style={{fontWeight: 'bold'}}>#{channelName}</span></span>
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
          <Link to={`/channel/private/${channelFirebaseId}`} className='link'>
            <Button className="joinBtn" size="small" variant="contained" endIcon={<ExitToAppIcon style={{color:'white'}}/>} onClick={()=>handleRedirect()}/>
          </Link>
          <Link  className='link'>
          <Button size='small' className="deleteBtn" variant='contained' endIcon={<HighlightOffIcon style={{color:'white'}}/>}/>
          </Link>
        </CardActions>
      </Card>
    </CardContainer>
  );
}

export default InviteCard;

const CardContainer = styled.div`
  margin-top: 30px;
  min-width: 275;

  > .card {
    > .card-actions {
        display: flex;
        justify-content:center;
      >.link{
        > .joinBtn {
        color: white;
        background-color: var(--ironblue-color);
      }
      >.deleteBtn{
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
