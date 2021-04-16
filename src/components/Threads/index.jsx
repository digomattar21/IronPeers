import React, { useState } from "react";
import styled from "styled-components";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../../firebase";
import SearchIcon from "@material-ui/icons/Search";
import { Link } from "@material-ui/core";
import ThreadCard from "../ThreadCard";
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';

function Threads() {
  const [channels, loading, error] = useCollection(db.collection("rooms"));
  const [searchValue, setSearchValue] = useState('');


  const handleChange = (e) => {
    if (e.target){
      setSearchValue(e.target.value);
    }
  }

  return (
    <ThreadsContainer>
      <TitleContainer>
        <h3>Browse Threads in Ironhack Community</h3>
      </TitleContainer>

      <SearchContainer>
        <SearchIcon />
        <input placeholder="search" value={searchValue} onChange={(e)=>handleChange(e)} />
      </SearchContainer>

      <MidContainer>
      <MidLeftContainer>

      </MidLeftContainer>

      <MidRightContainer>
        <div>
            <h6>Create Channel</h6>
            <AddToPhotosIcon/>
        </div>

      </MidRightContainer>

      </MidContainer>

      <ThreadsListContainer>
        {!searchValue && channels?.docs.map((channel) => {
          return (
            <ThreadCard
              key={channel.id}
              id={channel.id}
              title={channel.data().name}
            />
          );
        })}
        {searchValue && channels?.docs.map((channel) =>{
          let title = channel.data().name;
          return title.toLowerCase().includes(searchValue.toLowerCase())&&(
            <ThreadCard
              key={channel.id}
              id={channel.id}
              title={channel.data().name}
            />
          )
        })}
      </ThreadsListContainer>

      <LowerContainer></LowerContainer>
    </ThreadsContainer>
  );
}

export default Threads;

const ThreadsContainer = styled.div`
  flex: 0.7;
  flex-grow: 1;
  overflow-y: scroll;
  margin-top: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MidLeftContainer = styled.div`

`;

const MidRightContainer = styled.div`
    >div{
        display: flex;
        margin-right: 20px;
        align-items: center;
        justify-content: center;
        padding: 2px 6px;
        border: 1px solid green;
        background-color: green;
        border-radius: 5px;
        :hover{
            opacity: 0.8;
            cursor:pointer;
        }

        >h6{
            margin-right: 5px;
            color: white;
        }

        >.MuiSvgIcon-root {
            color: white;
        }
    }

`;

const MidContainer = styled.div`
    margin-top:10px;
    width: 90%;
    height: 30px;
    padding-bottom: 10px;
    border-bottom: 1px solid gray;
    display: flex;
    justify-content: space-between;
`;

const ThreadsListContainer = styled.div``;

const TitleContainer = styled.div`
  justify-content: center;
  > h3 {
    text-align: center;
  }
`;

const LowerContainer = styled.div``;

const SearchContainer = styled.div`
  margin-top: 20px;
  justify-content: flex-start;
  width: 50%;
  opacity: 0.5;
  border-radius: 3px;
  text-align: center;
  display: flex;
  padding: 0 30px;
  color: black;
  border: 1px solid black;

  > input {
    background-color: transparent;
    border: none;
    min-width: 30vw;
    outline: none;
    color: black;
    margin-left: 5px;
  }
  > .MuiSvgIcon-root {
    padding: 5px;
    font-size: 16px;
  }
`;
