import { Button, TextField } from "@material-ui/core";
import React, { useContext, useState } from "react";
import styled from "styled-components";
import { auth, provider } from "../../firebase";
import Api from "../../util/api.util";
import SignUp from '../SignUp';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginState, setLoginState] = useState(true);

  const handleGoogleSignInClick = async (e) => {
    e.preventDefault();
    try {
      let signin = await auth.signInWithPopup(provider);
      let payload = {
        username: signin.user.displayName,
        email: signin.user.email,
        profilePic: signin.user.photoURL,
      };
      console.log(payload);
      let apiReq = await Api.signUpWithGoogle(payload);
      console.log(apiReq);
    } catch (errr) {
      console.log(errr);
    }
  };

  const handleLoginSubmit = async (e)=>{
    try {
      await auth.signInWithEmailAndPassword(email,password);
      let payload ={email:email}
      await Api.setToken(payload)
      setEmail('')
      setPassword('')
    } catch (error) {
      console.log(error)
    }

  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else {
      setPassword(value);
    }
  };

  return (
    <>
    {loginState==true && (
      <LoginContainer>
      <LoginInsideContainer>
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="Atom / Icon / Logo / Ironhack / M (32px)">
            <g id="icon/Ironhack">
              <path
                id="BG"
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M14.9508 31.3747C15.123 31.4716 15.2772 31.5178 15.4218 31.5539C15.6219 31.604 15.8025 31.6229 15.9754 31.6234C16.3476 31.6245 16.6949 31.5502 17.2051 31.2589L29.46 24.6104C30.3785 24.086 30.779 23.5377 30.779 22.4889V8.96266C30.779 7.91392 30.1353 7.44508 29.2118 6.92071L16.8983 0.249533C16.7854 0.186034 16.6964 0.137155 16.6045 0.104543C16.3994 0.0317434 16.2305 0.00390625 16.0167 0.00390625C15.7069 0.00390625 15.4006 0.00553089 14.845 0.322735L2.82195 6.77421C1.90342 7.29858 1 7.91392 1 8.96266L1.02469 22.5477C1.02469 23.5964 1.79243 24.278 2.71589 24.8024L14.9508 31.3747Z"
                fill="#32C3FF"
              ></path>
              <path
                id="HACK"
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M16.838 19.4558C16.838 21.2041 17.2243 21.9636 18.7981 21.9636C19.1987 21.9636 19.5564 21.9206 19.8712 21.8633L19.8283 21.5337C19.5564 21.5767 19.2846 21.6053 19.0127 21.6053C17.4675 21.6053 17.2672 20.9031 17.2672 19.4558C17.2672 18.0084 17.4389 17.3062 19.0127 17.3062C19.2846 17.3062 19.5707 17.3492 19.8283 17.3778L19.8712 17.0339C19.5707 16.9766 19.1987 16.9336 18.7981 16.9336C17.2243 16.9479 16.838 17.7074 16.838 19.4558ZM14.0336 17.2345L12.2452 21.9206H12.6744L13.2181 20.4589H15.4358L15.9795 21.9206H16.423L14.6489 17.2345C14.5773 17.0482 14.4772 16.9479 14.3341 16.9479C14.2053 16.9479 14.1195 17.0339 14.0336 17.2345ZM14.3341 17.5068L15.307 20.115H13.3469L14.3341 17.5068ZM23.491 17.0052L21.2161 19.2838V17.0052H20.8012V21.9206H21.2161V19.4987L23.534 21.9206H24.0777L21.631 19.3841L24.0061 17.0052H23.491ZM10.9289 17.0052V19.2265H8.16749V17.0052H7.75256V21.9206H8.16749V19.5847H10.9432V21.9206H11.3581V17.0052H10.9289Z"
                fill="white"
              ></path>
              <path
                id="IRON"
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M19.8507 10.7237V15.2597H20.8149V11.3675L22.4949 14.6159C22.7725 15.1427 23.0208 15.3183 23.4007 15.3183C23.8097 15.3183 24.0435 15.0695 24.0435 14.5135V9.97747H23.0793V13.855L21.3992 10.6213C21.1363 10.1092 20.8587 9.93358 20.4935 9.93358C20.099 9.91895 19.8507 10.1677 19.8507 10.7237ZM14.6206 12.6259C14.6206 14.5428 15.0881 15.3183 16.7389 15.3183C18.3752 15.3183 18.8426 14.5281 18.8426 12.6259C18.8426 10.7091 18.3752 9.93358 16.7389 9.93358C15.0881 9.91895 14.6206 10.7091 14.6206 12.6259ZM15.7163 12.6259C15.7163 11.5431 15.7455 10.8115 16.7389 10.8115C17.7324 10.8115 17.7616 11.5431 17.7616 12.6259C17.7616 13.7087 17.7324 14.4403 16.7389 14.4403C15.7309 14.4257 15.7163 13.6941 15.7163 12.6259ZM9.93112 10.0653V15.2597H10.9976V13.2405C11.1875 13.2551 11.4212 13.2697 11.6404 13.2697L12.7214 15.2597H13.9486L12.7361 13.1381C13.3642 12.9478 13.7441 12.5089 13.7441 11.5724C13.7441 10.1384 12.7945 9.91895 11.6258 9.91895C11.0122 9.91895 10.384 9.97747 9.93112 10.0653ZM10.9976 12.3918V10.7969C11.2167 10.7676 11.4651 10.753 11.6696 10.753C12.4439 10.753 12.7068 10.9871 12.7068 11.5724C12.7068 12.2455 12.3124 12.4211 11.655 12.4211C11.4505 12.4211 11.2459 12.4211 11.0268 12.3918C11.0268 12.3918 11.0268 12.3918 11.0122 12.3918C11.0122 12.3918 11.0122 12.3918 10.9976 12.3918C11.0122 12.3918 11.0122 12.3918 10.9976 12.3918C11.0122 12.3918 11.0122 12.3918 10.9976 12.3918ZM7.71054 15.2597H8.79161V9.97747H7.71054V15.2597ZM16.7389 15.3183C16.7389 15.3183 15.0881 15.3183 16.7389 15.3183V15.3183Z"
                fill="white"
              ></path>
            </g>
          </g>
        </svg>
        <h1>
          Sign-in to <span>Iron Peers</span>
        </h1>
        <p>ironhack.com</p>
        <LoginFormContainer>
        <Button className="signingooglebtn" variant='contained' onClick={(e) => handleGoogleSignInClick(e)}>
          Sign in with Google
        </Button>
          <form onSubmit={(e)=>handleLoginSubmit(e)}>
            <TextField
              id="input"F
              label="email"
              variant="outlined"
              name="email"
              onChange={(e) => handleChange(e)}
              className='input'
            />
            <TextField
              id="outlined-basic"
              name="password"
              label="password"
              variant="outlined"
              onChange={(e) => handleChange(e)}
              className='input'
            />
            <Button type="submit" variant="contained">
                  Submit
            </Button>
          </form>
        </LoginFormContainer>

        <SignUpTextContainer onClick={()=>setLoginState(false)}>
          New to IronPeers? SignUp
        </SignUpTextContainer>

        
      </LoginInsideContainer>
    </LoginContainer>
    )}
    {loginState==false &&(
      <SignUp />
    )}
    </>
    
  );
}

export default Login;

const LoginContainer = styled.div`
  background-color: #f8f8f8;
  height: 100vh;
  display: grid;
  place-items: center;
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
    margin-top: 30px
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
  }}

    .input{
      margin-top: 15px;
      margin-bottom: 15px;
    }

`;

const SignUpTextContainer = styled.h4`
  margin-top: 20px;
  color: var(--ironblue-color);
  :hover{
    opacity:0.8;
    cursor: pointer;
  }
`;

const LoginInsideContainer = styled.div`
  padding: 100px;
  text-align: center;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);

  > svg {
    object-fit: contain;
    height: 100px;
    margin-bottom: 40px;
  }
  > h1 > span {
    color: #2aaee4;
  }
  

  > Button:hover {
    color: black;
  }
`;
