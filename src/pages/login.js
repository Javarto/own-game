import React, { Component } from 'react';
import './login.styles.css';

import { setPersistence, signInWithEmailAndPassword, browserSessionPersistence } from 'firebase/auth';
import { auth } from '../firebase/firebase';

import { sign_in_action } from '../redux/actions/user.actions';
import { set_initial_items } from '../redux/actions/menu.actions';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

import logo from './descarga.png';

import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

class login extends Component {
    constructor() {
        super();
        this.state = {
            email:'',
            password: '',
            error: '',
            loading: false
        }
    }

    handleSubmit = (e) => {
        this.setState({loading:true});
        e.preventDefault();
        setPersistence(auth, browserSessionPersistence)
        .then(() => {
            signInWithEmailAndPassword(auth, this.state.email, this.state.password)
                .then(userCredential => {
                    this.props.sign_in_action(userCredential.user);
                    this.props.history.push(`/profile/${this.props.user_object.currentUser.uid}`);
                })
                .catch((error) => {
                    this.setState({loading:false, error: 'Invalid email or password'});
            });
        });
    }

    handleChange = (event) => {
        this.setState({[event.target.name]:event.target.value})
    }

    render() {
        if (this.props.user_object.currentUser !== null) {
            return <Redirect to={`/profile/${this.props.user_object.currentUser.uid}`} /> 
        }
        if (this.state.loading) {
            return (
                <Box sx={{ display: 'flex' }}>
                    <CircularProgress />
                </Box>
            )
        }
        return (
            <div className='login-container'>
                <img alt='logo' src={logo} width="100" height="100" />
                <h1>OwnGame</h1>
                <form onSubmit={this.handleSubmit} className='login-form'>
                    <TextField 
                        error={this.state.error !== ''} 
                        name='email' 
                        type='email' 
                        label="Email" 
                        variant="standard" 
                        onChange={this.handleChange} 
                    />
                    <TextField 
                        error={this.state.error !== ''} 
                        helperText={this.state.error !== '' && this.state.error}
                        margin='normal' 
                        name='password' 
                        type='password' 
                        label="Password" 
                        variant="standard" 
                        color='primary' 
                        onChange={this.handleChange}
                    />
                    <Button type='submit' id='login-button' variant="contained" color='primary'>Login</Button>                
                    <small>Dont have an account yet? {<Link to={'/signup'}>SignUp</Link>}</small>
                </form>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        user_object: state.user_object
    }
}

const mapDispatchToProps = {
    sign_in_action,
    set_initial_items
}

export default connect(mapStateToProps, mapDispatchToProps)(login); 