import React, { Component } from 'react';
import './login.styles.css';

import { sign_in_action } from '../redux/actions/user.actions';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { setNewFirebase_account } from '../firebase/firebase';

import { Redirect } from 'react-router';
import { connect } from 'react-redux';

import logo from './descarga.png';

import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

const data =[
            {
                name: 'Alicante'
            },
            {
                name: 'Madrid'
            },
            {
                name: 'Sevilla'
            },
            {
                name: 'Barcelona'
            },
            {
                name: 'Valencia'
            },
            {
                name: 'Málaga'
            },
            {
                name:'Murcia'
            },
            {
                name:'Cádiz'
            },
            {
                name:'Baleares'
            },
            {
                name:'Vizcaya'
            },
            {
                name:'Las Palmas'
            },
            {
                name:'La Coruña'
            },
            {
                name:'Santa Cruz de Tenerife'
            },
            {
                name:'Asturias'
            },
            {
                name:'Zaragoza'
            },
            {
                name:'Pontevedra'
            },
            {
                name:'Granada'
            },
            {
                name:'Tarragona'
            },
            {
                name:'Gerona'
            },
            {
                name:'Córdoba'
            },
            {
                name:'Almería'
            },
            {
                name:'Guipúzcoa'
            },
            {
                name:'Toledo'
            },
            {
                name:'Badajoz'
            },
            {
                name:'Navarra'
            },
            {
                name:'Jaén'
            },
            {
                name:'Castellón'
            },
            {
                name:'Cantabria'
            },
            {
                name:'Huelva'
            },
            {
                name:'Valladolid'
            },
            {
                name:'Ciudad Real'
            },
            {
                name:'León'
            },
            {
                name:'Lérida'
            },
            {
                name:'Cáceres'
            },
            {
                name:'Albacete'
            },
            {
                name:'Burgos'
            },
            {
                name:'Álava'
            },
            {
                name:'Salamanca'
            },
            {
                name:'Lugo'
            },
            {
                name:'La Rioja'
            },
            {
                name:'Orense'
            },
            {
                name:'Guadalajara'
            },
            {
                name:'Huesca'
            },
            {
                name:'Cuenca'
            },
            {
                name:'Zamora'
            },
            {
                name:'Palencia'
            },
            {
                name:'Ávila'
            },
            {
                name:'Segovia'
            },
            {
                name:'Teruel'
            },
            {
                name:'Soria'
            },
            {
                name:'Melilla'
            },
            {
                name:'Ceuta'
            }
        ];

class signup extends Component {
    constructor() {
        super();
        this.state = {
            email:'',
            password: '',
            confirmPassword: '',
            name: '',
            mesas: 0,
            ciudad: '',
            error: {
                general: '',
                password: ''
            }
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.password !== this.state.confirmPassword) {
            this.setState({error:{general:this.state.error.general,password:'Passwords are not the same'}})
        } else {
            this.setState({error:{general:this.state.error.general,password:''}})
            createUserWithEmailAndPassword(auth, this.state.email, this.state.password)
            .then((userCredential) => {
                this.props.sign_in_action(userCredential.user);
                this.props.history.push(`/profile/${this.props.user_object.currentUser.uid}`);
            })
            .catch((error) => {

                this.setState({[this.state.error.general]: 'Unable to create account'})
            });
        }
    }

    componentWillUnmount() {
        if (this.props.user_object.currentUser !== null) {
            const data = {
                    name: this.state.name,
                    ciudad: this.state.ciudad,
                    quests: {},
                    completed: {},
                    friends: {},
                    messages:[],
                    public: false,
                    Canceladas: {},
                    diaryObjectives: {},
                    used: 0,
                    totalDone: 0,
                    nextReward: 100
                }

            setNewFirebase_account(this.props.user_object.currentUser.uid, data)
        }
    }

    handleChange = (event) => {
        this.setState({[event.target.name]:event.target.value})
    }

    render() {
        if (this.props.user_object.currentUser !== null) {
            return <Redirect to={`/profile/${this.props.user_object.currentUser.uid}`} />
        }
        return (
            <div className='signup-container'>
                <img alt='logo' src={logo} width="100" height="100" />
                <h1>OwnGame</h1>
                <form onSubmit={this.handleSubmit} className='signup-form'>
                    <TextField  
                        name='name'
                        margin='normal'
                        type='text' 
                        label="Nombre Jugador" 
                        variant="standard" 
                        required
                        onChange={this.handleChange} 
                    />
                    <TextField  
                        name='email'
                        margin='normal'
                        type='email' 
                        label="Email" 
                        variant="standard" 
                        required
                        onChange={this.handleChange} 
                    />
                    <TextField 
                        error={this.state.error.password !== ''} 
                        margin='normal'
                        name='password' 
                        type='password' 
                        label="Password" 
                        variant="standard" 
                        color='primary' 
                        required
                        onChange={this.handleChange}
                    />
                    <TextField 
                        error={this.state.error.password !== ''} 
                        helperText={this.state.error.password !== '' && this.state.error.password}
                        margin='normal'
                        name='confirmPassword' 
                        type='password' 
                        label="Confirm password" 
                        variant="standard" 
                        color='primary' 
                        required
                        onChange={this.handleChange}
                    />
                    <TextField 
                        margin='normal'
                        name='ciudad' 
                        select
                        label="Ciudad" 
                        variant="standard" 
                        color='primary' 
                        required
                        value={this.state.ciudad}
                        onChange={this.handleChange}
                    >
                    {data.map((option) => (
                        <MenuItem key={option.name} value={option.name}>
                        {option.name}
                        </MenuItem>
                    ))}
                    </TextField>
                    <Button type='submit' id='signup-button' variant="contained" color='primary'>Sign Up</Button>                
                    <small>Already has an account? {<Link to={'/login'}>Login</Link>}</small>
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
}

export default connect(mapStateToProps, mapDispatchToProps)(signup); 