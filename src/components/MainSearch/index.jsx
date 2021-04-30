import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useLocation, useParams } from 'react-router';
import { auth, db } from '../../firebase';
import Api from '../../util/api.util';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useCollection } from 'react-firebase-hooks/firestore';
import ThreadCard from '../ThreadCard'
import MemberCard from '../MemberCard';

function MainSearch() {
  const location = useLocation();
  const [user] = useAuthState(auth);
  const [userResults, setUserResults] = useState(null);
  const [allThreads, loading, error] = useCollection(db.collection("rooms"))
  const [query, setQuery] = useState(null)

  useEffect(()=>{
    setUserResults(null)
    if (location.state.type==='thread'){
      getThreadsResults()
    }else if(location.state.type==='user'){
      getUserResults()
    }
    setQuery(location.state.query)
  },[allThreads,location])

  const getThreadsResults = () =>{
    console.log(allThreads);
  }

  
  const getUserResults = async()=>{
    try {
      let payload = {userEmail: user.email,  query: location.state.query};
      let req = await Api.mainSearch(payload);
      console.log(req)
      setUserResults(req.data.results)
    } catch (error) {
      
    }
  }

  return (
    <SearchResultsMainContainer>
      {!allThreads && !userResults &&(
        <CircularProgress style={{marginTop: '200px', color: 'var(--ironblue-color)'}}/>
      )}
      <ThreadResultsContainer>
      {allThreads && !userResults &&  (
        <>
        <h1>Thread Results</h1>
        {allThreads.docs.map((doc)=>{
          let {name} = doc.data()
          if (name.toLowerCase().includes(query.toLowerCase())){
            return (
              <ThreadCard key={doc.id} id={doc.id} title={name}/>
            )
          }
        })}

        </>
      )}

      </ThreadResultsContainer>

      <UserResultsContainer>
      {userResults && (
        <h1 style={{marginBottom: '30px'}}>User Results</h1>
      )}
      {userResults && userResults.length > 0 && (
        userResults.map((result)=>{
          return <MemberCard username={result.username[0]} yes={true} email={result.email} profilePic={result.profilePic}/>
        })
      )}
      {userResults && userResults.length<=0 && (
        <>
          <h3 style={{color: 'gray'}}>No results found for '{query}'</h3>
          <div style={{marginTop: '80px', width: '100%'}}>
            <h1 style={{color: 'gray', marginTop: '100px', textAlign: 'center'}}>Recommended Threads: </h1>
            {allThreads && allThreads.docs.map((doc)=>{
              let {name} = doc.data()
              return (
              <ThreadCard key={doc.id} id={doc.id} title={name}/>
            )
            })}
          </div>
        </>
      )}
      </UserResultsContainer>
    </SearchResultsMainContainer>
  )
}

export default MainSearch


const SearchResultsMainContainer = styled.div `
  flex: 0.8;
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const ThreadResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UserResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

` 