import React from 'react';
import { Route, Switch } from 'react-router-dom';
// import Header from './Views/Header/Header';
import Footer from './Views/Footer/Footer';
import LoginPage from './Views/LoginPage/LoginPage';

function App() {
  return (
    <>
    <div>
      <Switch>
        <Route exact path = "/" component = {LoginPage} />
        <Route exact path = "/register" component = {LoginPage} />
      </Switch>
    </div>
    <Footer/>
    </>
  );
}

export default App;