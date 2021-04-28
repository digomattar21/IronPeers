import React, { useState } from "react";
import styled from "styled-components";
import { Avatar, Button } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import SearchIcon from "@material-ui/icons/Search";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { useHistory } from "react-router";
import Popper from "@material-ui/core/Popper";
import SettingsModal from '../SettingsModal';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';

function Header() {
  const [user] = useAuthState(auth);
  const history = useHistory();
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleEnter = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleLeave = (event) => {
    setAnchorEl(null)
  }

  const handleOpen = () =>{
    setOpenModal(true)
  }

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  return (
    <HeaderContainer>
      <HeaderLeft>
        <HeaderAvatar alt={user?.displayName} src={user?.photoURL} />

        <div className="arrowsContainer">
          <ArrowBackIcon onClick={() => history.goBack()} />
          <ArrowForwardIcon onClick={() => history.goForward()} />
        </div>

        <AccessTimeIcon />
      </HeaderLeft>

      <HeaderSearch>
        <SearchIcon />
        <input placeholder="search" />
      </HeaderSearch>

      <HeaderRight>
        <Button className='settingsPopperBtn' aria-describedby={id} type="button" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleOpen}>
          <HelpOutlineIcon />
        </Button>
        <Popper id={id} open={open} anchorEl={anchorEl} className='popper'>
          <div style={{backgroundColor: '#282828', color:'white', padding: '10px 15px', borderRadius:'5px' }}>Settings</div>
        </Popper>
        <SettingsModal 
          open={openModal}
          setOpen={setOpenModal}

        />
        <MeetingRoomIcon className='signOutIcon' onClick={()=>auth.signOut()}/>
      </HeaderRight>
    </HeaderContainer>
  );
}

export default Header;

const HeaderContainer = styled.div`
  display: flex;
  position: fixed;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 2px 0;
  background-color: var(--ironblue-color);
  color: black;
`;

// Header left styles
const HeaderLeft = styled.div`
  flex: 0.3;
  display: flex;
  align-items: center;
  margin-left: 20px;
  > .MuiSvgIcon-root {
    margin-left: auto;
    margin-right: 30px;
  }
  .arrowsContainer {
    margin-left: 45%;
    > .MuiSvgIcon-root {
      margin-left: 7px;
      :hover {
        cursor: pointer;
        transform: scale(1.2);
      }
    }
  }
`;

const HeaderAvatar = styled(Avatar)`
  margin-top: 3px;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

// Header Mid Search styles
const HeaderSearch = styled.div`
  flex: 0.4;
  opacity: 0.5;
  border-radius: 6px;
  background-color: var(--irondump-color);
  text-align: center;
  display: flex;
  padding: 0 50px;
  color: black;
  border: 1px solid black;

  > input {
    background-color: transparent;
    border: none;
    text-align: center;
    min-width: 30vw;
    outline: none;
    color: black;
  }
`;

// Header Right
const HeaderRight = styled.div`
  flex: 0.3;
  display: flex;
  align-items: center;
  .signOutIcon{
    :hover{
      cursor: pointer;
      opacity: 0.6;
    }
  }
  .settingsPopperBtn{
    :hover{
      opacity: 0.8;
      cursor: pointer;
    }
  }
  > * > .MuiSvgIcon-root {
    margin-left: auto;
    margin-right: 20px;
  }
  .popper{
    background-color:black;
  }
    
  
`;
