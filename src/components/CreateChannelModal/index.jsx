import {
  Backdrop,
  Button,
  Fade,
  Modal,
  Switch,
  TextField,
} from "@material-ui/core";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../../firebase";
import Api from "../../util/api.util";

function CreateChannelModal({ open, setOpen, setUpdatedSideBar, updatedSideBar }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [privateChecked, setPrivateChecked] = useState(false);
  const [message, setMessage] = useState(null);
  const [user] = useAuthState(auth) || auth.currentUser;
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "title") {
      setTitle(value);
    } else if (name == "description") {
      setDescription(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reg = /[a-zA-Z0-9]/i;
    try {
      if (reg.test(title)) {
        if (!privateChecked) {
          let req = await db.collection("rooms").add({
            name: title,
          });
          let payload = {
            name: title,
            description: description,
            firebaseId: req.id,
            isPrivate: privateChecked,
            userEmail: user.email,
          };
          let req2 = await Api.addGlobalChannel(payload);
        } else {
          let req = await db.collection("privaterooms").add({
            name: title,
          });
          let payload = {
            name: title,
            description: description,
            firebaseId: req.id,
            isPrivate: privateChecked,
            userEmail: user.email,
          };
          let req3 = await Api.addPrivateChannel(payload);
        }
        handleClose();
        setUpdatedSideBar(!updatedSideBar);
      } else {
        setMessage("Invalid title, please use only letters, no spaces");
      }
    } catch (error) {
      console.log(error);
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
              <h3 style={{ textAlign: "center", marginBottom: "25px" }}>
                Create a Channel
              </h3>
              <TextField
                id="input"
                label="title"
                variant="outlined"
                name="title"
                onChange={(e) => handleChange(e)}
                className="input"
              />
              {message && (
                <h6 style={{ color: "red", textAlign: "center" }}>{message}</h6>
              )}
              <TextField
                id="outlined-basic"
                name="description"
                label="description (optional)"
                variant="outlined"
                onChange={(e) => handleChange(e)}
                className="input"
              />
              <SelectPrivateContainer>
                <div>
                  <h5>Make Private: </h5>
                  {privateChecked && (
                    <h6>
                      A private channel will not be able to be convrted to a
                      public one after
                    </h6>
                  )}
                </div>
                <Switch
                  checked={privateChecked}
                  onChange={() => setPrivateChecked(!privateChecked)}
                  color="primary"
                  name="checkedB"
                  inputProps={{ "aria-label": "primary checkbox" }}
                />
              </SelectPrivateContainer>
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

export default CreateChannelModal;

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

const SelectPrivateContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height: 35px;
  align-items: center;
  margin-bottom: 30px;
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
    margin-top: 30px;
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
  }

  .input {
    margin-top: 15px;
    margin-bottom: 15px;
  }
`;
