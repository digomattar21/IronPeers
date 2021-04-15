import React, { useContext, useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import UserInfoContext from '../../context/UserInfoProvider/context';
import AuthContext from '../../context/UserProvider/context';
import { auth } from '../../firebase';
import Api from '../../util/api.util'
import BookmarkedCard from '../BookmarkedCard';
import Loading from '../Loading';

function BookMarkedList() {
    const [user] = useAuthState(auth);
    const [bookmarks, setBookmarks] = useState([]);
    const {userAuth, changeUserAuth} = useContext(AuthContext);
    const [username, setUsername] = useState(null);
    const [message,setMessage] = useState(null);
    const [bookmarksv2, setBookmarksv2] = useState(null);
    const {userInfo, getUserInfo} = useContext(UserInfoContext)



    useEffect(()=>{
        (user && getBookMarks());
        (!user && getUser())
    },[]);

    const getUser=async()=>{
        try {
          let user = await getUserInfo();
          console.log(user)
        //   setUsername(req.data.userAuth.username)
        //   setBookmarksv2(req.data.userAuth.myBookmarks)
            
          
        } catch (error) {
          setMessage(error);
          changeUserAuth(false)
        }
      }
    

    const getBookMarks = async()=>{
        try {
            let req = await Api.getUserBookmarks(user.email);
            setBookmarks(Array.from(req.bookmarks))
            

        } catch (error) {
            console.log('error catched' , error)
        }
    }


    return (
        <BookMarkedContainer>
            <BookMarkedTitleContainer>
                <h2>My Bookmarks</h2>
            </BookMarkedTitleContainer>

            {bookmarks.length>0 && bookmarks.map(bookmark =>{
                return(
                    <BookmarkedCard key={bookmark.id} bookmark={bookmark}></BookmarkedCard>
                )
            })}

            {(bookmarks.length<=0 && !bookmarksv2) && <Loading/>}
            {(bookmarks.length<=0 && bookmarksv2) && (
                bookmarks.map(bookmark =>{
                return(
                    <BookmarkedCard key={bookmark.id} bookmark={bookmark}></BookmarkedCard>
                )
            }
            ))}
        </BookMarkedContainer>
    )
}

export default BookMarkedList


const BookMarkedContainer = styled.div`
    width: 100%;
    display : flex;
    flex-direction: column;
    align-items: center;
    background-color: #f8f8f8;
`;

const BookMarkedTitleContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 80px;
    margin-bottom: 20px;
`;

