import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import Paper from '@mui/material/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@mui/material/TextField';

import PrincipalMenuItem from './profile/principalMenuItem/PrincipalMenuItem';

import { queryUser } from '../firebase/firebase';
import { db } from '../firebase/firebase';
import { doc, updateDoc, arrayUnion} from "firebase/firestore";

import QuestMenu from '../components/QuestMenu';

class friends extends Component {
    constructor(props) {
        super(props);
        this.state = {
            friend: '',
            open: false,
            destination:'',
            errorFriend: ''
        }
    }

    handleOpen = (dest) => {
        this.setState({destination:dest, open: true });
    }

    AddFriend = (friend) =>{
        if (!this.props.firebase_items.friends.hasOwnProperty(friend) && friend !== this.props.firebase_items.name) {
            queryUser(friend).then(result => {
                if (!result.empty) {
                    updateDoc(doc(db, "players", result.docs[0]['id']), {messages:arrayUnion({player: this.props.firebase_items.name})});
                    updateDoc(doc(db, "players", this.props.user_object.currentUser.uid), {friends:{...this.props.firebase_items.friends, [friend]:{friend:false, quests:[]}}});
                } else {
                    this.setState({errorFriend: 'Jugador no encontrado'});
                }
            });
        }
    }

    handleClose = () => {
        this.setState({open: false});
    }

    render() {
        if (this.props.user_object.currentUser === null) {
            return <Redirect to='/login' />
        }
        return (
            <div style={{padding:'0 10px'}}>
                {
                    this.state.open ? (
                        <QuestMenu friend={this.state.destination} handleClose={this.handleClose} open={this.state.open} />
                    ) : null
                }
                <div style={{width:300, display:'flex', flexDirection:'row', flexWrap:'nowrap', justifyContent:'center'}}>
                    <TextField style={{width:'60%', marginRight:10, marginTop:10}}
                        error={this.state.errorFriend !== ''}
                        helperText={this.state.errorFriend}
                        margin="none"
                        label='Buscar amigo'
                        size="small"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={this.state.friend}
                        onChange={(e) => {this.setState({friend: e.target.value})}}
                    />
                    <Button color='primary' variant='contained' style={{width:'20%', height:40, marginTop:10}}
                        onClick={() => {this.AddFriend(this.state.friend);}}>
                        Añadir
                    </Button>
                </div>
                <h2>Amigos</h2>
                {
                    Object.keys(this.props.firebase_items.friends).sort().map(friend =>
                        <div key={friend}>
                            {this.props.firebase_items.friends[friend]['friend'] ?
                                <PrincipalMenuItem handleOpen={this.handleOpen} editing={false} friend={friend} />
                                :
                                <Paper elevation={3} style={{margin:'5px 5px', padding:10}}>
                                    <span style={{margin:'0 5px'}}>Esperando respuesta de</span>
                                    <span>{`"${friend}"`}</span>
                                </Paper>
                            }
                        </div>
                    )
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user_object: state.user_object,
        firebase_items: state.firebase_items
    }
}

export default connect(mapStateToProps)(friends);
