import React, { Component } from 'react';
import {Link}  from 'react-router-dom';

import './navbar.styles.css';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';

import IconButton from '@mui/material/IconButton';
import EmailIcon from '@mui/icons-material/Email';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';

import LocalAtmIcon from '@mui/icons-material/LocalAtm';

import { auth } from '../firebase/firebase';
import { signOut } from '@firebase/auth';

import { connect } from 'react-redux';

import { sign_out_action } from '../redux/actions/user.actions';
import { reset_firebase_data_action, set_initial_items } from '../redux/actions/menu.actions';

import { db } from '../firebase/firebase';
import { onSnapshot, doc } from "firebase/firestore";

const subscribers = [];

class Navbar extends Component {
    constructor() {
        super();
        this.state = {
            listener: false
        }
    }
    
    handleClick = () => {
        signOut(auth).then(() => {
            const execute = () => {
                subscribers.forEach(subscriber => subscriber());
                this.props.sign_out_action(null);
                this.setState({listener:false});
                this.props.reset_firebase_data_action();
            }
            execute();
        })
        .catch((error) => {
            console.log(error)
        });
    }

    activateListener = (uid) => {
        if (this.state.listener === false) {
            this.setState({listener: true}, () => {
                const playerRef = doc(db, "players", uid);
                const unsub = onSnapshot(playerRef, async(snap) => {
                    await this.props.set_initial_items(snap.data());
                });
                subscribers.push(unsub);
            });
        }
    }

    render() {
        if (this.state.listener === false && this.props.user_object.currentUser !== null) {
            this.activateListener(this.props.user_object.currentUser.uid);
        }
        return (
            <AppBar>
                <Toolbar>
                    {this.props.user_object.currentUser !== null ? (
                        <div style={{width:'100%' ,display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                            <IconButton color='inherit' 
                                onClick={() => {this.handleClick();}}>
                                <LogoutIcon />
                            </IconButton>
                            <div>
                                <IconButton color='inherit' component={Link} to={`/profile/${this.props.user_object.currentUser.uid}`}>
                                    <AssignmentIcon />
                                </IconButton>
                                <IconButton color='inherit' component={Link} to={`/friends/${this.props.user_object.currentUser.uid}`}><SupervisorAccountIcon /></IconButton>
                                <Badge badgeContent={(this.props.firebase_items.messages).length} color="error">
                                    <IconButton color='inherit' component={Link} to={`/messages/${this.props.user_object.currentUser.uid}`}><EmailIcon /></IconButton>
                                </Badge>
                            </div>
                            <div>
                                <IconButton color='inherit'>
                                    <span style={{fontSize:15, margin:'0 5px'}}>{150}</span>
                                    <LocalAtmIcon />
                                </IconButton>
                            </div>
                        </div>
                        ) : (
                        <div>
                            <Button color='inherit' component={Link} to='/login'>Iniciar sesión</Button>
                            <Button color='inherit' component={Link} to='/signup'>Registrarse</Button>
                        </div>
                        )}
                </Toolbar>
            </AppBar>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user_object: state.user_object,
        firebase_items: state.firebase_items
    }
}

const mapDispatchToProps = {
    sign_out_action,
    reset_firebase_data_action,
    set_initial_items
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
