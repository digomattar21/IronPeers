import { Backdrop, Button, Fade, Modal, Switch, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth } from "../../firebase";
import Api from "../../util/api.util";
import SendIcon from "@material-ui/icons/Send";
import SettingsIcon from "@material-ui/icons/Settings";

function SettingsModal({ open, setOpen }) {
  const [user] = useAuthState(auth);
  const [message, setMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const handleChange = (e) => {};

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const handleClose = () => {
    setOpen(false);
    setMessage(null);
  };

  const handleResetEmailClick = () =>{
   
  }

  const handleResetPasswordClick = () =>{
    auth.sendPasswordResetEmail()
  }

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
                  My Settings
                </h3>
                <SettingsIcon />
              </div>

              <InfoContainer>
                <div className="emailContainer">
                  <h3>Username:</h3>
                  <h4>{user.displayName}</h4>
                </div>
                <div className="emailContainer">
                  <h3>Email:</h3>
                  <h4>{user.email}</h4>
                </div>
                <div className="emailContainer">
                  <h3>Email Verified: </h3>
                  <Switch
                    checked={auth.currentUser.emailVerified}
                    readonly
                    name="checkedA"
                    inputProps={{ "aria-label": "secondary checkbox" }}
                  />
                </div>
                {!auth.currentUser.emailVerified && (
                  {/* <>
                  <div className="emailContainer">
                    <h3>Password: </h3>
                    <h4>*********</h4>
                  </div>
                  <div className="emailContainer">
                    <h3>Actions</h3>
                    <section style={{display:'flex', justifyContent:'space-around', marginTop: '10px'}}>
                    <Button
                      type="button"
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        marginTop: "4px",
                        marginRight: '5px'
                      }}
                      onClick={()=>handleResetPasswordClick()}
                    >
                      Reset Password
                    </Button>
                    <Button
                      type="button"
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        marginTop: "4px",
                        marginLeft: '5px'
                      }}
                      onClick={()=>handleResetEmailClick()}
                    >
                      Reset Email
                    </Button>


                    </section>
                  </div>
                  
                  </> */}
                )}
              </InfoContainer>

              {message && (
                <h6 style={{ color: "red", textAlign: "center" }}>{message}</h6>
              )}
            </form>
          </LoginFormContainer>
        </Paper>
      </Fade>
    </Modal>
  );
}

export default SettingsModal;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  .emailContainer {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    > h4 {
      color: var(--ironblue-color);
    }
    > h3 {
      color: gray;
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
