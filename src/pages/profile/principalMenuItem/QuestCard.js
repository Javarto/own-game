import React, { Component } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

import Countdown from 'react-countdown';
import moment from 'moment';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { db } from '../../../firebase/firebase';
import {doc, updateDoc,arrayUnion, arrayRemove, increment } from "firebase/firestore";
import { queryUser } from '../../../firebase/firebase';

class QuestCard extends Component {
    constructor() {
        super();
        this.state = {
            open: false,
            repeat: false
        }
    }

    acceptQuest = (index, player) => {
        const hola = `friends.${player}.quests`;
        let newFriendData = this.props.firebase_items.friends[player].quests
        newFriendData[index] = {...newFriendData[index], accepted:true}
        queryUser(player).then(result => {
                if (!result.empty) {
                    updateDoc(doc(db, "players", result.docs[0]['id']), {messages:arrayUnion({message:`${this.props.firebase_items.name} ha aceptado tu quest "${newFriendData[index].quest}"`, player:this.props.firebase_items.name})});
                    updateDoc(doc(db, "players", this.props.user_object.currentUser.uid), {[hola]: newFriendData});
                } else {
                    console.log('No se ha encontrado a ese jugador');
                }
            });
        this.setState({open: false});
    }

    rejectQuest = (index, player) => {
        const hola = `friends.${player}.quests`;
        let newFriendData = this.props.firebase_items.friends[player].quests
        queryUser(player).then(result => {
                if (!result.empty) {
                    updateDoc(doc(db, "players", result.docs[0]['id']), {messages:arrayUnion({message:`${this.props.firebase_items.name} ha rechazado tu quest "${newFriendData[index].quest}"`, player:this.props.firebase_items.name})});
                    updateDoc(doc(db, "players", this.props.user_object.currentUser.uid), {[hola]: arrayRemove(newFriendData[index])});
                } else {
                    console.log('No se ha encontrado a ese jugador');
                }
            });
        this.setState({open: false});
    }

    handleValue = (rep, done) => {
        const summer = 100 / rep;
        const value = done * summer;
        return value;
    }

    handleCancel = (event, uid, id, check, friend, group) => {
        if(!check.hasOwnProperty('accepted')) {
            const canceledPlace = `Canceladas.${group}`;
            let newQuests = this.props.firebase_items.quests[group];
            const deletePlace = `quests.${group}`;

            updateDoc(doc(db, "players", uid), {[deletePlace]: arrayRemove(newQuests[id]), [canceledPlace]: arrayUnion(newQuests[id])});
        } else {
            let newQuests = this.props.firebase_items.friends[friend]['quests'];
            const hola = `friends.${friend}.quests`;
            const delQuest = this.props.firebase_items.friends[friend]['quests'][id];

            queryUser(friend).then(result => {
                if (!result.empty) {
                    updateDoc(doc(db, "players", result.docs[0]['id']), {messages:arrayUnion({message:`${this.props.firebase_items.name} ha cancelado tu mision "${newQuests[id].quest}"` ,player: this.props.firebase_items.name})});
                    updateDoc(doc(db, "players", uid), {[hola]: arrayRemove(delQuest)});
                } else {
                    console.log('No se ha encontrado a ese jugador');
                }
            });
        }



        event.stopPropagation();
    }
    handleDone = (uid, done, rep, id, check, friend, group, repeat) => {
        const today = moment().format("DD-MM-YYYY");
        const diary = `diaryObjectives.${today}`;
        if(!check.hasOwnProperty('accepted')) {
            const place = `quests.${group}`;
            let newQuests = this.props.firebase_items.quests[group];
            if (done + 1 < rep) {
                newQuests[id]['done'] = done + 1;
                updateDoc(doc(db, "players", uid), {[place]:newQuests, [diary]: increment(1)});

            } else {
                const completedPlace = `completed.${group}`;
                let newCompleted = this.props.firebase_items.completed[group];
                
                // Search index of same quest
                console.log(newQuests[id]);
                let uploaded = false;
                for (let x in newCompleted) {
                    if (newCompleted[x]['quest'] === newQuests[id].quest) {
                        if (newCompleted[x].hasOwnProperty('cantidad')) {
                            newCompleted[x]['cantidad']++;
                            uploaded = true;
                        } else {
                            newCompleted[x]['cantidad'] = 2;
                            uploaded = true;
                        }
                        newCompleted[x]['rep'] += newQuests[id]['rep'];
                        newCompleted[x]['done'] += newQuests[id]['done'] + 1;
                        newCompleted[x]['doneTime'] = today;
                        break;
                    }
                }
                if (!uploaded) {
                    newCompleted.push({...newQuests[id], done: done + 1, doneTime:today});
                }

                this.props.firebase_items.totalDone++;
                if (this.props.firebase_items.totalDone === this.props.firebase_items.nextReward ) {
                    updateDoc(doc(db, "players", this.props.user_object.currentUser.uid), {nextReward: increment(100)});
                }

                if (!repeat) {
                    updateDoc(doc(db, "players", uid), {[completedPlace]:newCompleted, [place]: arrayRemove(newQuests[id]), [diary]: increment(1), totalDone: increment(1)});
                } else {
                    newQuests[id]['done'] = 0;
                    updateDoc(doc(db, "players", uid), {[completedPlace]:newCompleted, [place]:newQuests, [diary]: increment(1), totalDone: increment(1)});
                }
            }
        } else {
            let newQuests = this.props.firebase_items.friends[friend]['quests'];
            const hola = `friends.${friend}.quests`;
            if (done + 1 < rep) {
                newQuests[id] = {...newQuests[id], done:done + 1};
                updateDoc(doc(db, "players", uid), {[hola]:newQuests, [diary]: increment(1)});

            } else {
                let newCompleted = this.props.firebase_items.completed.friends;
            
                const delQuest = this.props.firebase_items.friends[friend]['quests'][id];
                newCompleted.push({...newQuests[id], done:done + 1, doneTime:today});

                queryUser(friend).then(result => {
                    if (!result.empty) {
                        updateDoc(doc(db, "players", result.docs[0]['id']), {messages:arrayUnion({message:`${this.props.firebase_items.name} ha completado tu mision "${newQuests[id].quest}"` ,player: this.props.firebase_items.name})});
                        updateDoc(doc(db, "players", uid), {'completed.friends':newCompleted, [hola]: arrayRemove(delQuest), [diary]: increment(1)});
                    } else {
                        console.log('No se ha encontrado a ese jugador');
                    }
                });
            }
        }
    }

    handleTimerDone = (id, uid, timer, group, friend) => {
        if (moment().diff(moment(timer)) > 0) {
            if (friend !== null) {
                console.log('hola');
            } else {
                let newQuests = this.props.firebase_items.quests[group];
                const deletePlace = `quests.${group}`;
            
                updateDoc(doc(db, "players", uid), {[deletePlace]: arrayRemove(newQuests[id])});
            }
        }
    }

    handleDiff = (date) => {
        return moment(date).diff(moment());
    }

    render() {
        return (
            <div>
            <Dialog
                open={this.state.open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                {"Repetir Quest?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Si pulsa "si", repetirá la quest sin necesidad de volver a escribirla ahorrándose tiempo.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        this.setState({open:false});
                        this.handleDone(this.props.user_object.currentUser.uid, this.props.done, this.props.rep, this.props.item, this.props.check, this.props.friend, this.props.group, false);
                    }}>No</Button>
                    <Button color='primary' variant='contained' onClick={() => {
                        this.setState({open:false});
                        this.handleDone(this.props.user_object.currentUser.uid, this.props.done, this.props.rep, this.props.item, this.props.check, this.props.friend, this.props.group, true);
                    }}>Si</Button>
                </DialogActions>
            </Dialog>
                <Paper elevation={3} style={{margin:5, padding:10}} key={this.props.item}>
                    <div style={{width:'100%', height:'100%', display:'flex', flexDirection:'column'}}>
                        {
                            (this.props.date).hasOwnProperty('timestamp') && this.props.time ? <span style={{padding:'5px 0'}} >{this.props.date.timestamp}</span> : null
                        }
                        {
                            this.props.check !== null && (this.props.check).hasOwnProperty('timer') ?
                                // onMount={() => {this.handleTimerDone(this.props.item, this.props.user_object.currentUser.uid, this.props.check.timer);}} onComplete={() => {this.handleTimerDone(this.props.item, this.props.user_object.currentUser.uid, this.props.check.timer);}} 
                                <Countdown date={Date.now() + this.handleDiff(this.props.check.timer)} onMount={() => {this.handleTimerDone(this.props.item, this.props.user_object.currentUser.uid, this.props.check.timer, this.props.group, this.props.friend);}} onComplete={() => {this.handleTimerDone(this.props.item, this.props.user_object.currentUser.uid, this.props.check.timer, this.props.group, this.props.friend);}} />
                            : 
                                null
                        }
                        <div style={{width:'100%', display:'flex', flexDirection:'row'}}>
                            <span style={{fontSize:17, fontWeight:'bolder', width:'85%'}}>{this.props.quest}</span>
                            {
                                this.props.check !== null && this.props.edit
                                ?
                                    <Button
                                        style={{color:'#e53935'}}
                                        onClick={(e) => {this.handleCancel(e, this.props.user_object.currentUser.uid, this.props.item, this.props.check, this.props.friend, this.props.group);}}
                                    >
                                        Cancelar
                                    </Button>
                                : null
                            }
                        </div>
                        <div style={{width:'100%', height:'100%', display:'flex', flexDirection:'row', flexWrap:'nowrap'}}>
                            <LinearProgress color='success' style={{
                                width:'85%',
                                height:20,
                                borderRadius:5,
                                marginTop:5,
                                marginBottom:5,
                            }} variant="determinate" value={this.handleValue(this.props.rep, this.props.done)}/>
                            <div>
                                {
                                    typeof(this.props.item) === 'number' &&  !this.props.accepted ?
                                        <div style={{display:'flex', flexDirection:'row', flexWrap:'nowrap'}}>
                                            <IconButton color='inherit' variant='contained' style={{height:25, margin:5}} onClick={() => {this.acceptQuest(this.props.item, this.props.friend);}}>
                                                <CheckIcon color='success' />
                                            </IconButton>
                                            <IconButton color='inherit' variant='contained' style={{ height:25,margin:5}} onClick={() => {this.rejectQuest(this.props.item, this.props.friend);}}>
                                                <ClearIcon color='error' />
                                            </IconButton>
                                        </div>
                                    : 
                                        <div>
                                            {
                                                this.props.done + 1 <= this.props.rep ?
                                                    <Button disabled={!this.props.edit} color='primary' variant='contained' style={{height:20,fontWeight:'bolder', marginTop:5, marginBottom:5, marginLeft:10}}
                                                        onClick={(e) => {
                                                             !(this.props.done + 1 < this.props.rep) ? this.setState({open:true}) :
                                                                this.handleDone(this.props.user_object.currentUser.uid, this.props.done, this.props.rep, this.props.item, this.props.check, this.props.friend, this.props.group, false)
                                                            e.stopPropagation();
                                                    }}>
                                                        <div style={{display:'flex', flexDirection:'row', flexWrap:'nowrap'}}>
                                                            <span>{this.props.done}</span>
                                                            <span style={{margin:'0 3px'}}>/</span>
                                                            <span>{this.props.rep}</span>
                                                        </div>
                                                    </Button>
                                                :
                                                    <div style={{display:'flex', flexDirection:'column', flexWrap:'nowrap', alignItems:'center'}}>
                                                        <div style={{textAlign:'center', fontWeight:'bolder', marginTop:5, marginBottom:5, marginLeft:10, color:'#4caf50'}}>Completado</div>
                                                        <div style={{display:'flex', flexDirection:'row', flexWrap:'nowrap', textAlign:'center'}}>
                                                                <span>{this.props.done}</span>
                                                                <span style={{margin:'0 3px'}}>/</span>
                                                                <span>{this.props.rep}</span>
                                                        </div>
                                                    </div>
                                            }
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                </Paper>
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

export default connect(mapStateToProps)(QuestCard);
