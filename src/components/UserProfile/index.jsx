import { Button, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useLocation, useParams } from "react-router";
import styled from "styled-components";
import { auth } from "../../firebase";
import Api from "../../util/api.util";
import AbCard from '../AbCard';

function UserProfile() {
  const [user] = useAuthState(auth);
  const { userId } = useParams();
  const location = useLocation();
  const [profileInfo, setProfileInfo] = useState(null);
  const [ownProfile, setOwnProfile] = useState(false);
  const [username, setUsername] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [gitURL, setGitURL] = useState("");
  const [habInput, setHabInput] = useState("");
  const [reload, setReload] = useState(false);
  const [message, setMessage] = useState(null);
  const [bio, setBio] = useState('');

  const getUserProfile = async () => {
    let payload;
    location.search &&
      (payload = { userId: location.search.slice(1, location.search.length) });


    try {
      let req = await Api.getUserProfile(payload);
      setProfileInfo(req.data.profile);
      setUsername(req.data.username);
      setPhotoURL(req.data.profilePic);
      setBio(req.data.profile.bio?req.data.profile.bio:'')
      setGitURL(req.data.profile.githubUrl)
      if (user.email === req.data.profile.email) {
        setOwnProfile(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAbilitySubmit = async(e) => {
    e.preventDefault();
    let payload = {userEmail: user.email, ability: habInput}
    try {
      setHabInput("")
      await Api.addNewAbility(payload);
      setReload(!reload);
    } catch (error) {
      console.log(error);
      setMessage(error)
    }
  }

  const handleBioSubmit = async (e) =>{
    e.preventDefault();
    let bioRegex = /[a-zA-Z0-9]/
    if (bio && bioRegex.test(bio) ){
      let payload = {userEmail: user.email, newBio: bio}
    try {
      setBio('')
      let req = await Api.setNewBio(payload);
      setBio(bio)

    } catch (error) {
      console.log(error)
    }
    }
  }

  const handleGitURLSubmit = async (e)=>{
    e.preventDefault();
    let urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/
    if (urlRegex.test(gitURL)){
      let payload = {userEmail: user.email, url: gitURL}
      try {
        let req = await Api.setNewGitUrl(payload);
      } catch (error) {
        console.log(error);
        setMessage(error)        
      }
    }
  }

  useEffect(() => {
    getUserProfile();
  }, [reload]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name==='bio'){
      setBio(e.target.value);
    }else if (name==='gitURL'){
      setGitURL(e.target.value);
    }else{
      setHabInput(e.target.value)
    }
  };

  return (
    <ProfileMainContainer>
      <ProfileHeaderContainer>
        <img src={photoURL} />
        <h2>{username} </h2>
      </ProfileHeaderContainer>

      <ProfileLowerContainer>
        {profileInfo && ownProfile && (
          <BioInputContainer>
          <form onSubmit={(e)=>handleBioSubmit(e)}>
          <h3 style={{color: 'gray', marginBottom: '5px'}}>Bio:</h3>
          <TextField
              id="input"
              variant="outlined"
              name="bio"
              onChange={(e) => handleChange(e)}
              className="input2"
              value={bio}
              style={{minWidth: '80%'}}
            />
          </form>
          <button hidden type='submit'></button>
          </BioInputContainer>
          
          )}


        {profileInfo && !ownProfile && profileInfo.bio && (
          <>
          <h3 style={{color: 'gray', marginBottom: '5px'}}>Bio:</h3>
          <BioContainer>
            {profileInfo.bio}
          </BioContainer>
          </>
        )}
        <h3 style={{color: 'gray', marginBottom: '4px'}}>Abilities:</h3>
        <AbilitiesContainer>
        
        {profileInfo &&
        !ownProfile && 
          profileInfo.abilities.length > 0 &&
          profileInfo.abilities.map((hab) => {
            return (
              <AbCard hab={hab} own={false}/>
            );
          })}
        </AbilitiesContainer>
        {profileInfo && ownProfile && (
          <form onSubmit={(e)=>handleAbilitySubmit(e)}>
            <TextField
              id="input"
              label="Add ability"
              variant="outlined"
              name="query"
              onChange={(e) => handleChange(e)}
              className="input"
              value={habInput}
            />
            {message && <h6 style={{fontWeight: '500', color: 'red'}}>{message}</h6>}
            <Button hidden type='submit' />
          </form>
        )}
        <AbilitiesContainer>
        
        {profileInfo &&
          ownProfile &&
          profileInfo.abilities.length > 0 &&
          profileInfo.abilities.map((hab) => {
            return (
              <AbCard key={hab} hab={hab} userId={profileInfo.email} own={true} setReload={setReload} reload={reload}/>
            )
          })}
          </AbilitiesContainer>
        
        {profileInfo && ownProfile && (

          <form onSubmit={(e)=>handleGitURLSubmit(e)}>
          <h3 style={{color: 'gray', marginBottom: '4px', marginTop: '20px'}}>GitHub:</h3>
            <TextField
              id="input3"
              label="github"
              variant="outlined"
              name="gitURL"
              onChange={(e) => handleChange(e)}
              className="input"
              value={gitURL}
            />
            {message && <h6 style={{fontWeight: '500', color: 'red'}}>{message}</h6>}
            <Button hidden type='submit' />
            </form>
        )}

        {profileInfo && !ownProfile && profileInfo.githubUrl && (
          <ProfileCard>
            <h3>Github:</h3>
            <h4>{profileInfo.githubUrl}</h4>
          </ProfileCard>
        )}

        {profileInfo && profileInfo.email && (
          <ProfileCard>
            <h3>Email:</h3>
            <h4>{profileInfo.email}</h4>
          </ProfileCard>
        )}

        {profileInfo && profileInfo.createdAt && (
          <ProfileCard>
            <h3>Member Since:</h3>
            <h4>{profileInfo.createdAt.split('T')[0]}</h4>
          </ProfileCard>
        )}
      </ProfileLowerContainer>
    </ProfileMainContainer>
  );
}

export default UserProfile;

const BioInputContainer = styled.div`
  margin-bottom: 10px;
`;

const BioContainer = styled.div`
  margin-bottom: 30px;
  border: 1px solid gray;
  border-radius: 5px;
  padding: 5px 10px;
`

const ProfileMainContainer = styled.div`
  flex: 0.7;
  margin-top: 80px;
  height: 80%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  margin-left: 15%;
  width: 100%;
`;

const ProfileHeaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  > img {
    width: 50px;
    border-radius: 50%;
  }
  > h2 {
    margin-left: 15px;
  }
`;

const ProfileLowerContainer = styled.div`
  margin-top: 30px;
  width: 100%;
`;

const ProfileCard = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  >h3{
    color: gray;
  }
  > h4 {
    margin-top: 5px;
    color: var(--ironblue-color)
  }
`;



const AbilitiesContainer = styled.div`
  display: flex;
  justify-content:space-around;
  align-items:center;
`;
