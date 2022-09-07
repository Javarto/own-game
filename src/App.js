import React, { Component } from 'react';
import {Route, Switch } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core';
import './App.css';
import Navbar from './components/Navbar';

import home from './pages/home';
import login from './pages/login';
import signup from './pages/signup';


import { createTheme } from '@material-ui/core/styles';
import Profile from './pages/profile/profile';
import rewards from './pages/rewards';
import friends from './pages/friends';
import messages from './pages/messages';
import FriendsProfile from './pages/profile/FriendsProfile';

const theme = createTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#673ab7',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#ef5350',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
});

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className="App">
            <Navbar />
            <div className='container'>
              <Switch>
                <Route exact path="/" component={home} />
                <Route exact path="/profile/:uid" component={Profile} />
                <Route exact path="/friend/profile/:name" component={FriendsProfile} />
                <Route exact path="/rewards/:uid" component={rewards} />
                <Route exact path="/friends/:uid" component={friends} />
                <Route exact path="/messages/:uid" component={messages} />
                <Route exact path="/login" component={login} />
                <Route exact path="/signup" component={signup} />
              </Switch>
            </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;

