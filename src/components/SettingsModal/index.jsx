import { Backdrop, Button, Fade, Modal, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth } from "../../firebase";
import Api from "../../util/api.util";
import SendIcon from "@material-ui/icons/Send";

function SettingsModal({ open, setOpen }) {
  const [user] = useAuthState(auth);
  const [message, setMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const handleChange = (e) => {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reg = /^[a-z0-9_-]{3,15}$/;
    try {
      if (reg.test(username)) {
        let payload = {
          userWhoInvited: user.email,
          userInvited: username,
        };
        console.log(user.displayName, username);

        let req = await Api.sendPrivateChannelInvite(payload);
        setMessage(req.data.message);

        setOpen(false);
      } else {
        setMessage("Invalid email, please use only letters, no spaces");
      }
    } catch (error) {
      console.log(error);
      setMessage(error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setMessage(null);
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
            <form onSubmit={(e) => handleSubmit(e)}>
              <div>
                <h3 style={{ textAlign: "center", marginBottom: "25px" }}>
                  New Direct Message
                </h3>
                <SendIcon />
              </div>

              <TextField
                id="input"
                label="Search by Username"
                variant="outlined"
                name="username"
                onChange={(e) => handleChange(e)}
                className="input"
                value={username}
              />

              <TextField
                id="input"
                label="Search by Email"
                variant="outlined"
                name="email"
                onChange={(e) => handleChange(e)}
                className="input"
                value={email}
              />

              {message && (
                <h6 style={{ color: "red", textAlign: "center" }}>{message}</h6>
              )}

              <Button type="submit" variant="contained">
                Submit
              </Button>
            </form>
          </LoginFormContainer>
        </Paper>
      </Fade>
    </Modal>
  );
}

export default SettingsModal;

const Paper = styled.div`
  background-color: #f8f8f8;
  border: 2px solid #f8f8f8;
  border-radius: 7px;
  box-shadow: 3px darkgray;
  padding: 30px 30px;
  width: 40%;
  outline: none;
  :active {
    outline: none;
  }
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
    margin-top: 10px;
    > Button {
      color: white;
      font-size: 15px;
      font-weight: 300;
      text-transform: inherit !important;
      background-color: var(--ironblue-color) !important;
      padding: 5px 10px;
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
    margin-bottom: 15px;
  }
`;
