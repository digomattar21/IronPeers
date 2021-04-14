import React from 'react'
import styled from 'styled-components'
import {Avatar} from '@material-ui/core'
import SendIcon from '@material-ui/icons/Send';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import SearchIcon from '@material-ui/icons/Search'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import { auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

function Header() {
    const [user] = useAuthState(auth);

    return (
        <HeaderContainer>
            <HeaderLeft>
                <HeaderAvatar
                    alt={user?.displayName}
                    src={user?.photoURL}
                />
                <AccessTimeIcon/>

            </HeaderLeft>

            <HeaderSearch >
                <SearchIcon />
                <input placeholder='search'/>
            </HeaderSearch>

            <HeaderRight>
                <HelpOutlineIcon/>
            </HeaderRight>

            
        </HeaderContainer>
    )
}

export default Header


const HeaderContainer = styled.div`
    display:flex;
    position: fixed;
    width:100%;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    background-color: var(--ironblue-color);
    color: black;
`


// Header left styles
const HeaderLeft = styled.div`
    flex:0.3;
    display: flex;
    align-items: center;
    margin-left: 20px;
    > .MuiSvgIcon-root{
        margin-left: auto;
        margin-right:30px;
    }
`;

const HeaderAvatar = styled(Avatar)`
    cursor: pointer;
    :hover{
        opacity: 0.8
    }
`




// Header Mid Search styles
const HeaderSearch = styled.div`
    flex: 0.4;
    opacity:1;
    border-radius:6px;
    background-color: var(--irondump-color);
    text-align:center;
    display: flex;
    padding: 0 50px;
    color: black;
    border : 1px solid black;

    >input{
        background-color: transparent;
        border: none;
        text-align: center;
        min-width: 30vw;
        outline: none;
        color: black
    }
`;


// Header Right
const HeaderRight = styled.div`
    flex: 0.3;
    display: flex;
    align-items: flex-end;
    > .MuiSvgIcon-root{
        margin-left: auto;
        margin-right:  20px
    }
`;