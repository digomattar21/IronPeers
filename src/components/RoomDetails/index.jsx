import React, { useEffect } from "react";
import styled from "styled-components";

function RoomDetails({ messageIds }) {
  const getPinnedMessages = async () => {};

  useEffect(() => {
    getPinnedMessages();
  }, []);

  return (
    <RoomDetailsContainer>
      <RoomDetailsHeader>
          
      </RoomDetailsHeader>

      <RoomDetailsLowerContainer>

      </RoomDetailsLowerContainer>
    </RoomDetailsContainer>
  );
}

export default RoomDetails;

const RoomDetailsContainer = styled.div``;

const RoomDetailsHeader = styled.div``;

const RoomDetailsLowerContainer = styled.div``;

const RoomDetailsPinnedMessagesContainer = styled.div``;

const RoomDetailsMembersContainer = styled.div``;
