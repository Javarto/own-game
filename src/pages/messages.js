import React, { Component } from 'react';
import { connect } from 'react-redux';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

import { Redirect } from 'react-router';

import { queryUser } from '../firebase/firebase';
import { db } from '../firebase/firebase';
import { doc, updateDoc, arrayRemove} from "firebase/firestore";

class messages extends Component {

    acceptFriend = (name) => {
        const hola = `friends.${this.props.firebase_items.name}.friend`;
        updateDoc(doc(db, "players", this.props.user_object.currentUser.uid),
        {
            messages:arrayRemove({player: name}),
            friends:{...this.props.firebase_items.friends, [name]:{friend:true, quests:[]}}
        });
        queryUser(name).then(result => {
            updateDoc(doc(db, "players", result.docs[0]['id']), {[hola]: true});
        });
    }
    deleteMes = (player, message) => {
        updateDoc(doc(db, "players", this.props.user_object.currentUser.uid),
        {
            messages:arrayRemove({message:message, player: player}),
        });
    }

    notFriend = (name) => {
        console.log(name);
    }

    render() {
        if (this.props.user_object.currentUser === null) {
            return <Redirect to='/login' />
        }
        if ( (this.props.firebase_items.messages).length === 0 ) {
            return (
                <div style={{padding:'0 20px'}}>
                    <h2>Mensajes</h2>
                    <h4>No tienes mensajes nuevos</h4>
                </div>
            )
        }
        return (
            <div>
                <h2>Mensajes</h2>
                <div>
                    {
                        (this.props.firebase_items.messages).map((mes) =>
                            <div>
                                {
                                    mes.hasOwnProperty('message') ?
                                        <Paper elevation={3} style={{margin:10, padding:10, maxWidth: 600}}>
                                            <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                                                <span style={{marginTop:10}}>{mes.message}</span>
                                                <IconButton color='inherit' style={{margin:'0 5px'}} onClick={() => {this.deleteMes(mes.player, mes.message);}}>
                                                    <ClearIcon color='error' />
                                                </IconButton>
                                            </div>
                                        </Paper>
                                    :
                                        <Paper elevation={3} style={{margin:'0 10px'}}>
                                            <h3 style={{padding:10}}>{`${mes.player} quiere competir contra usted`}</h3>
                                            <Button color='inherit' variant='contained' style={{margin:'0 5px 5px 5px'}} onClick={() => {this.acceptFriend(mes.player);}}>
                                                <CheckIcon color='success' />
                                            </Button>
                                            <Button color='inherit' variant='contained' style={{margin:'0 5px 5px 5px'}} onClick={() => {this.notFriend(mes.player);}}>
                                                <ClearIcon color='error' />
                                            </Button>
                                        </Paper>
                                }
                            </div>
                        )
                    }
                </div>
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

export default connect(mapStateToProps)(messages);
