import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Routes from "../src/routes";

function App() {
  //Remove console.log in production
  if (process.env.NODE_ENV !== "development") console.log = () => { };

  return <Routes />;
}

export default App;
