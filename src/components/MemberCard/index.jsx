import React from 'react';
import styled from 'styled-components';

function MemberCard({member}) {
    return (
        <MemberCardContainer>
            <img src={member.profilePic}/>
            <h3>{member.username}</h3>
        </MemberCardContainer>
    )
}

export default MemberCard

const MemberCardContainer = styled.div`
    display: flex;
    align-items: center;
    >img{
        max-height: 36px;
        border-radius: 6px;
        margin-right: 5px;
    }
`;

