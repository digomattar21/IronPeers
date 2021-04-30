import { Backdrop, Button, Fade, Modal, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styled, { keyframes } from "styled-components";
import { auth, db } from "../../firebase";
import Api from "../../util/api.util";
import SendIcon from "@material-ui/icons/Send";
import CachedIcon from "@material-ui/icons/Cached";
import MemberCard from "../MemberCard";

function DmModal({ open, setOpen, updatedSideBar, setUpdatedSideBar }) {
  const [user] = useAuthState(auth);
  const [message, setMessage] = useState(null);
  const [userQuery, setUserQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [queryResults, setQueryResults] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCount, setSelectedCount] = useState(0);

  const handleChange = (e) => {
    setUserQuery(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setMessage("");
      var dm = await db.collection("dms").add({
        name: `${user.displayName} & ${selectedUser}`,
        userOneUsername: user.displayName, 
        userTwoUsername: selectedUser[0],
        userOneProfilePic: user.photoURL
      });

      let payload = {
        userWhoInvitedEmail: user.email, 
        userReceivingUsername: selectedUser[0],
        dmId : dm.id,
        dmName: `${user.displayName} & ${selectedUser}`
      };

      let req = await Api.sendDmRequest(payload);

      setUpdatedSideBar(!updatedSideBar)
      setOpen(false);
      
    } catch (error) {
      console.log(error);
      dm.id && db.collection('dms').doc(dm.id).delete()
      setMessage(error);
    }
  };

  const handleUsernameSearch = async (e) => {
    e.preventDefault();
    if (userQuery.length > 3) {
      setLoading(true);
      setMessage("");
      try {
        let payload = {
          query: userQuery,
        };

        let req = await Api.searchForUser(payload);
        if (req.data.results.length <= 0) {
          setMessage("No results found");
        }
        setQueryResults(req.data.results);

        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    } else {
      setMessage("Write at least 3 characters");
    }
  };

  const handleSelectUser = (username, operation) => {
    if (operation === "minus") {
      setSelectedCount(selectedCount - 1);
    } else {
      setSelectedCount(selectedCount + 1);
      setSelectedUser(username);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setMessage(null);
    setUserQuery('');
    setSelectedCount(0)
    setQueryResults(null)
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className="modal"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Fade in={open}>
        <Paper>
          <LoginFormContainer>
            <form onSubmit={(e) => handleUsernameSearch(e)}>
              <div>
                <h3 style={{ textAlign: "center", marginBottom: "25px" }}>
                  New Direct Message
                </h3>
                <SendIcon />
              </div>

              <TextField
                id="input"
                label="Search for username"
                variant="outlined"
                name="query"
                onChange={(e) => handleChange(e)}
                className="input"
                value={userQuery}
              />

              {message && (
                <h6
                  style={{
                    color: "red",
                    textAlign: "center",
                    marginBottom: "5px",
                  }}
                >
                  {message}
                </h6>
              )}

              {!queryResults && (
                <Button type="submit" variant="contained">
                  {!loading && <span>Search</span>}
                  {loading && <CachedIcon />}
                </Button>
              )}
            </form>
          </LoginFormContainer>
          <UserCardsContainer>
            {queryResults &&
              queryResults.length > 0 &&
              queryResults.map((result) => {
                let { email, username, profilePic } = result;
                return (
                  <MemberCard
                    email={email ? email : null}
                    username={username ? username : null}
                    profilePic={profilePic}
                    handleSelected={handleSelectUser}
                  />
                );
              })}
          </UserCardsContainer>
          <CreateDMContainer>
            <form onSubmit={(e) => handleSubmit(e)}>
              {selectedCount === 1 && (
                <Button type="submit" className="submitBtn">
                  Submit
                </Button>
              )}
              {selectedCount>1 && (
                <h6
                  style={{
                    color: "red",
                    textAlign: "center",
                    marginBottom: "5px",
                    marginTop: "5px",
                  }}
                >
                  Please select only one user or <a href='/'>create a channel</a>
                </h6>
              )}
            </form>
          </CreateDMContainer>
        </Paper>
      </Fade>
    </Modal>
  );
}

export default DmModal;

const spinAnimation = keyframes`
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }

`;

const CreateDMContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;

  > form {
    .submitBtn {
      color: white;
      margin-top: 20px;
      font-size: 15px;
      font-weight: 300;
      text-transform: inherit !important;
      background-color: var(--ironblue-color) !important;
      padding: 8px 40px;
      :hover{
        opacity: 0.8;
      }
    }
  }
`;

const Paper = styled.div`
  background-color: #f8f8f8;
  border: 2px solid #f8f8f8;
  border-radius: 7px;
  box-shadow: 3px darkgray;
  padding: 30px 30px;
  width: 40%;
  height: auto;
  outline: none;
  :active {
    outline: none;
  }
`;

const UserCardsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LoginFormContainer = styled.div`
  > Button {
    color: white;
    margin-top: 20px;
    font-size: 15px;
    font-weight: 300;
    text-transform: inherit !important;
    background-color: var(--ironblue-color) !important;
    padding: 5px 10px;
  }
  > form {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
    .input {
      width: 80%;
    }
    > Button {
      color: white;
      font-size: 15px;
      font-weight: 300;
      text-transform: inherit !important;
      background-color: var(--ironblue-color) !important;
      padding: 5px 10px;
      width: 14%;
      .MuiSvgIcon-root {
        color: white;
        animation-name: ${spinAnimation};
        animation-duration: 1.5s;
        animation-iteration-count: infinite;
      }
    }
    > div {
      display: flex;
      justify-content: center;
      > .MuiSvgIcon-root {
        color: var(--ironblue-color) !important;
        margin-left: 10px;
      }
    }
  }

  .input {
    margin-top: 15px;
    margin-bottom: 5px;
  }
`;
