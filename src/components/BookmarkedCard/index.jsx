import React from "react";
import styled from "styled-components";

function BookmarkedCard({ bookmark }) {
  return (
    <BookMarkedCardContainer>
      <BookmarkContainer>
        <BookmarkInfo>
          <h4>
            {bookmark.messageOwner} <span>{(bookmark.createdAt.split('T')[0])} {bookmark.createdAt.split('T')[1].slice(0,-2)}</span>
          </h4>
          <p>{bookmark.message}</p>
        </BookmarkInfo>
      </BookmarkContainer>
    </BookMarkedCardContainer>
  );
}

export default BookmarkedCard;

const BookMarkedCardContainer = styled.div`
  padding: 25px 50px;
  text-align: center;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 10px > h4 {
    font-size: 15px;
    font-weight: 200;
  }
`;

const BookmarkContainer = styled.div`
  display: flex;
  align-items: center;
`;

const BookmarkInfo = styled.div`
  padding-left: 10px;

  > h4 {
    display: flex;
    align-items: center;
  }

  > h4 > span {
    color: gray;
    font-weight: 200px;
    margin-left: 8px;
    font-size: 10px;
  }
`;

