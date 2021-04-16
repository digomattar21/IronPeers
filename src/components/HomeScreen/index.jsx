import React from "react";
import { Link } from "react-router-dom";
import styled from 'styled-components'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

function HomeScreen() {
  return (
    <div>
      <h1>This is home</h1>
      <Link to="/login">Login</Link>
    </div>
  );
}

export default HomeScreen;



