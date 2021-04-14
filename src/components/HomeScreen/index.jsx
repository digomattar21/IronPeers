import React from "react";
import { Link } from "react-router-dom";

function HomeScreen() {
  return (
    <div>
      <h1>This is home</h1>
      <Link to="/login">Login</Link>
    </div>
  );
}

export default HomeScreen;
