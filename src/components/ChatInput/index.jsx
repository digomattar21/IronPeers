import { Button } from '@material-ui/core';
import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { auth, db } from '../../firebase';
import firebase from 'firebase';
import { useAuthState } from 'react-firebase-hooks/auth';


function ChatInput({channelName, channelId, chatBottomRef, Private}) {
    const [message, setMessage] = useState("");
    const [user] = useAuthState(auth)

    const sendMessage = async (e) =>{
        e.preventDefault();
        if (!channelId){
            return false
        }

        if (message.length>3){
            try{
            if (Private==true){
                let msg = await db.collection('privaterooms').doc(channelId).collection('messages').add({
                    message: message,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    user: user?.displayName,
                    userImage: user?.photoURL
                });
            }else{
                let msg = await db.collection('rooms').doc(channelId).collection('messages').add({
                    message: message,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    user: user?.displayName,
                    userImage: user?.photoURL
                });
            }
            

            }catch(err){
                console.log(err)
            }
            chatBottomRef?.current.scrollIntoView({
                behavior:"smooth"
            })
    
            setMessage("")
        }

    }

    const handleChange = (e) =>{
        if (e.target.value){
            setMessage(e.target.value)
        }else if (e.target.value===""){
            setMessage("")
        }
    }

    return (
        <ChatInputContainer>
            <form>
                <input 
                onChange={(e)=>handleChange(e)}
                value={message}
                placeholder={`Message #${channelName}`}></input>
                <Button hidden type='submit' onClick={(e)=>sendMessage(e)}/>
            </form>

        </ChatInputContainer>
    )
}

export default ChatInput;

const ChatInputContainer = styled.div`
    border-radius: 20px;
    > form{
        position: relative;
        display: flex;
        justify-content: center;
    }

    > form > input {
        position: fixed;
        bottom: 30px;
        width: 60%;
        border: 1px solid gray;
        border-radius: 10px;
        padding: 20px;
        outline: none;
    }
`;
