import React, { useRef, useState } from "react";
import styled from "styled-components";
import { Avatar, Button } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import SearchIcon from "@material-ui/icons/Search";
import SettingsIcon from "@material-ui/icons/Settings";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { useHistory } from "react-router";
import Popper from "@material-ui/core/Popper";
import SettingsModal from "../SettingsModal";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import { SentimentSatisfied } from "@material-ui/icons";
import Api from '../../util/api.util'

const options = ["user", "thread"];

function Header() {
  const [user] = useAuthState(auth);
  const history = useHistory();
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open2, setOpen2] = useState(false);
  const anchorRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    console.info(`You clicked ${options[selectedIndex]}`);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen2(false);
  };

  const handleToggle = () => {
    setOpen2((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen2(false);
  };

  const handleEnter = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleLeave = (event) => {
    setAnchorEl(null);
  };

  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleSearchValueChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    let searchRegex = /[a-zA-Z]/;
    if (searchRegex.test(searchValue)) {
      history.push({
        pathname: '/mainsearch', 
        state: {query: searchValue, type: options[selectedIndex]}
      })
      setSearchValue("");
    } else {
      setMessage("Invalid query");
    }
  };

  const handleProfileClick = async () => {
    try {
      let userId = user.email;
      history.push({
        pathname: "/user/profile",
        search: `${userId}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  return (
    <HeaderContainer>
      <HeaderLeft>
        <HeaderAvatar
          onClick={() => handleProfileClick()}
          alt={user?.displayName}
          src={user?.photoURL}
        />

        <div className="arrowsContainer">
          <ArrowBackIcon onClick={() => history.goBack()} />
          <ArrowForwardIcon onClick={() => history.goForward()} />
        </div>

        <AccessTimeIcon />
      </HeaderLeft>

      <HeaderSearch style={{ opacity: 1 }}>
        <Grid >
          <Grid >
            <ButtonGroup
              variant="contained"
              ref={anchorRef}
              aria-label="split button"
            >
              <Button
                onClick={handleClick}
                style={{ backgroundColor: "#f8f8f8", color: "black" }}
              >
                {options[selectedIndex]}
              </Button>
              <Button
                style={{ color: "black", backgroundColor: "#f8f8f8" }}
                size="small"
                aria-controls={open2 ? "split-button-menu" : undefined}
                aria-expanded={open2 ? "true" : undefined}
                aria-label="select merge strategy"
                aria-haspopup="menu"
                onClick={handleToggle}
              >
                <ArrowDropDownIcon />
              </Button>
            </ButtonGroup>
            <Popper
              open={open2}
              anchorEl={anchorRef.current}
              role={undefined}
              transition
              disablePortal
              style={{zIndex: '999'}}
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom" ? "center top" : "center bottom",
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList
                        id=""
                        variant='menu'
                        style={{ backgroundColor: "white", zIndex: "999", position: 'relative' }}
                        style={{ opacity: 1 }}
                      >
                        {options.map((option, index) => (
                          <MenuItem
                            key={option}
                            disabled={index === 2}
                            selected={index === selectedIndex}
                            onClick={(event) =>
                              handleMenuItemClick(event, index)
                            }
                          >
                            {option}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </Grid>
        </Grid>
        <form onSubmit={(e) => handleSearchSubmit(e)}>
          <input
            placeholder="search"
            value={searchValue}
            onChange={(e) => handleSearchValueChange(e)}
          />
          <button hidden type="submit"></button>
        </form>
        <SearchIcon onClick={(e) => handleSearchSubmit(e)} />
      </HeaderSearch>

      <HeaderRight>
        <Button
          className="settingsPopperBtn"
          aria-describedby={id}
          type="button"
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          onClick={handleOpen}
        >
          <SettingsIcon />
        </Button>
        <Popper id={id} open={open} anchorEl={anchorEl} className="popper">
          <div
            style={{
              backgroundColor: "#282828",
              color: "white",
              padding: "10px 15px",
              borderRadius: "5px",
            }}
          >
            Settings
          </div>
        </Popper>
        <SettingsModal open={openModal} setOpen={setOpenModal} />
        <MeetingRoomIcon
          className="signOutIcon"
          onClick={() => auth.signOut()}
        />
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
  padding: 2px 50px;
  color: black;
  border: 1px solid black;
  align-items: center;

  > form > input {
    background-color: transparent;
    border: none;
    text-align: center;
    min-width: 30vw;
    outline: none;
    color: black;
  }

  > .MuiSvgIcon-root {
    :hover {
      opacity: 0.7;
      cursor: pointer;
    }
  }
  .paper {
    background-color: red;
  }
`;

// Header Right
const HeaderRight = styled.div`
  flex: 0.3;
  display: flex;
  align-items: center;
  .signOutIcon {
    :hover {
      cursor: pointer;
      opacity: 0.6;
    }
  }
  .settingsPopperBtn {
    :hover {
      opacity: 0.8;
      cursor: pointer;
    }
  }
  > * > .MuiSvgIcon-root {
    margin-left: auto;
    margin-right: 20px;
  }
  .popper {
    background-color: black;
  }
`;
