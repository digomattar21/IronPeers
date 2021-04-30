import React, { useEffect, useState } from "react";
import styled from "styled-components";
import InviteCard from "../InviteCard";
import Api from "../../util/api.util";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function Inbox() {
  const [user] = useAuthState(auth);
  const [allInvites, setAllInvites] = useState(null);
  const [hasUnread, setHasUnread] = useState(false);
  const [reRender, setReRender] = useState(false);

  const getInboxInfo = async () => {
    let payload = { userEmail: user.email };
    try {
      let req = await Api.getUserInboxInfo(payload);
      setHasUnread(req.data.hasUnread);
      setAllInvites(req.data.invites.reverse());
      if (req.data.invites.length<=0){
        handleHasUnread()
    }
    } catch (error) {
      console.log(error);
    }
  };

  const handleHasUnread = async () => {
    let payload = { userEmail: user.email };
    try {
      await Api.setUnreadFalse(payload);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getInboxInfo();
  }, [reRender]);

  return (
    <InboxContainer>
      <InboxTitleContainer>
        <h2 style={{ textDecoration: "underline" }}>My Inbox</h2>
      </InboxTitleContainer>

      <InboxLowerContainer>
        <InboxLowerContainerMiddle>
          {allInvites &&
            allInvites.length > 0 &&
            allInvites.map((invite) => {
              return (
                <>
                  <InviteCard
                    key={invite._id}
                    id={invite._id}
                    userWhoInvited={invite.userWhoInvited}
                    read={invite.read}
                    channelFirebaseId={invite.channelFirebaseId?invite.channelFirebaseId:null}
                    dmId={invite.dmId?invite.dmId:null}
                    timestamp={invite.createdAt}
                    reRender={reRender}
                    setReRender={setReRender}
                  />
                </>
              );
            })}
          {allInvites && allInvites.length <= 0 && (
            <h5 style={{ color: "darkgray" }}>
              You dont have any inboxes, try checking it out later
            </h5>
          )}
        </InboxLowerContainerMiddle>

        <InboxLowerContainerTemp></InboxLowerContainerTemp>
      </InboxLowerContainer>
    </InboxContainer>
  );
}

export default Inbox;

const InboxContainer = styled.div`
  flex: 0.7;
  flex-grow: 1;
  margin-top: 60px;
`;

const InboxTitleContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const InboxLowerContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const InboxLowerContainerMiddle = styled.div`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const InboxLowerContainerTemp = styled.div``;
