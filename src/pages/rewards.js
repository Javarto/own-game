import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import Button from '@material-ui/core/Button';
import Paper from '@mui/material/Paper';

import { db } from '../firebase/firebase';
import { doc, updateDoc } from "firebase/firestore";

class rewards extends Component {

    handleUse = (reward) => {
        if (this.props.firebase_items.rewards[reward] - 1 <= 0) {
            delete this.props.firebase_items.rewards[reward];
        } else {
            this.props.firebase_items.rewards[reward] = this.props.firebase_items.rewards[reward] -1;
        }
        updateDoc(doc(db, "players", this.props.user_object.currentUser.uid), {rewards:this.props.firebase_items.rewards});
    }

    handleUsePunish = (punish) => {
        if (this.props.firebase_items.punish[punish] - 1 <= 0) {
            delete this.props.firebase_items.punish[punish];
        } else {
            this.props.firebase_items.punish[punish] = this.props.firebase_items.punish[punish] -1;
        }
        updateDoc(doc(db, "players", this.props.user_object.currentUser.uid), {punish:this.props.firebase_items.punish});
    }

    render() {
        if (this.props.user_object.currentUser === null) {
            return <Redirect to='/login' />
        }
        if (this.props.firebase_items.rewards === null) {
            return <p>Loading</p>
        } else if (Object.keys(this.props.firebase_items.rewards).length === 0) {
            return <p>Completa misiones para obtener recompensas</p>
        }
        return (
            <div>
                <h3>Recompensas</h3>
                {
                    Object.keys(this.props.firebase_items.rewards).map(reward =>
                        <Paper elevation={3} style={{margin:'5px 10px', backgroundColor:'#81c784'}}>
                            <div style={{padding:5, display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                                <h3 style={{marginLeft:5}}>{`x${this.props.firebase_items.rewards[reward]}  ${reward}`}</h3>
                                <Button color='primary' variant='contained' style={{height:40, marginTop:10}}
                                    onClick={() => {this.handleUse(reward);}}>
                                    Usar
                                </Button>
                            </div>
                        </Paper>
                    )  
                }
                <h3>Deuda</h3>
                {
                    Object.keys(this.props.firebase_items.punish).map(punish =>
                        <Paper elevation={3} style={{margin:'5px 5px', backgroundColor:'#ff8a80'}}>
                            <div style={{padding:5, display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                                <h3 style={{marginLeft:5}}>{`x${this.props.firebase_items.punish[punish]}  ${punish}`}</h3>
                                <Button color='primary' variant='contained' style={{height:40, marginTop:10}}
                                    onClick={() => {this.handleUsePunish(punish);}}>
                                    Usar
                                </Button>
                            </div>
                        </Paper>
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

export default connect(mapStateToProps)(rewards);
