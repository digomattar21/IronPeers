import React, { useEffect, useState } from 'react'
import styled from 'styled-components';


function Message({message, timestamp, user, userImage}) {

    return (
        <MessageContainer>
            <img src={userImage} alt='user profile img' />
            <MessageInfo>
                <h4>
                    {user}{' '}
                    <span>{new Date(timestamp?.toDate()).toUTCString()}</span>
                </h4>
                <p>{message}</p>
            </MessageInfo>
        </MessageContainer>
    )
}

export default Message;

const MessageContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
    >img{
        height:50px;
        border-radius: 12%
    }

`;

const MessageInfo = styled.div`
    padding-left: 10px;

    >h4{
        display: flex;
        align-items: center;
    }

    >h4>span{
        color: gray;
        font-weight: 300px;
        margin-left:8px;
        font-size: 10px;
    }
`;
