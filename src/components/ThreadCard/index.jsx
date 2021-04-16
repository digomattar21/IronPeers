import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Api from "../../util/api.util";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Redirect } from "react-router";
import { Link } from "@material-ui/core";
import StarOutlineIcon from '@material-ui/icons/StarOutline';

function ThreadCard({ id, title }) {
  const [length, setLength] = useState(0);
  const [iconsShow, setIconsShow] = useState(false);
  const [user] = useAuthState(auth);

  const getChannelMembersLength = async () => {
    try {
      let req = await Api.getChannelMembersLength(id);
      setLength(req.data.membersLength);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFavoriteChannelClick = async()=>{
    const payload = {userEmail: user.email, channelId: id};
    try {
      await Api.setFavoriteChannel(payload)

    } catch (err) {
      console.log(err)
    }
  }

  const handleJoinChannelClick = async () => {
    let payload = { userEmail: user.email, channelId: id };
    try {
      let req = await Api.userJoinChannel(payload);
    } catch (error) {
      console.log(error);
    }
  };



  useEffect(() => {
    getChannelMembersLength();
  }, []);

  return (
    <>
      <ThreadCardContainer
        onMouseEnter={() => setIconsShow(true)}
        onMouseLeave={() => setIconsShow(false)}
      >
        <div>
          <div className="titleIconContainer">
            <h4>#{title}</h4>
            <StarOutlineIcon onClick={()=>handleFavoriteChannelClick()}/>
          </div>
          <h6> members : {length}</h6>
        </div>
        {iconsShow && (
          <div
          onClick={() => handleJoinChannelClick()}

          >
          <Link href={`/channel/${id}`}>
            <BtnsContainer>
              <ExitToAppIcon />
            </BtnsContainer>
          </Link>
          </div>
        )}
      </ThreadCardContainer>
    </>
  );
}

export default ThreadCard;

const ThreadCardContainer = styled.div`
  margin-top: 20px;
  margin-bottom: 10px;
  width: 70vw;
  border-bottom: 1px solid gray;
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div > div > h4 {
    color: black;
    font-weight: 500;
    font-size: 15px;
    margin-bottom: 15px;
  }
  > div >div> h4:hover {
    outline: none;
  }
  > div > h6 {
    color: darkgray;
    margin-bottom: 15px;
  }
  .titleIconContainer{
    display: flex;
    flex-direction: row;
    justify-content:flex-start;
    .MuiSvgIcon-root {
      margin-left: 5px;
      font-size: 17px;
      color: green;
      :hover{
        cursor: pointer;
        transform: scale(1.05);
        opacity: 0.8;

      }
    }

  }
`;

const BtnsContainer = styled.div`
  padding: 2px 6px;
  border: 1px solid var(--ironblue-color);
  background-color: var(--ironblue-color);
  border-radius: 5px;
  > .MuiSvgIcon-root {
    color: white;
  }
  :hover {
    cursor: pointer;
  }
`;
