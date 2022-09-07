import React, { Component } from 'react';

import { connect } from 'react-redux';

import moment from 'moment';

import { db } from '../firebase/firebase';
import { queryUser } from '../firebase/firebase';
import {doc, updateDoc, arrayUnion } from "firebase/firestore";


import Button from '@material-ui/core/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

class QuestMenu extends Component {
    constructor() {
        super();
        this.state= {
            mision:'',
            cantidad: 1,
            errorM:'',
            timer: {
                days: 0,
                hours: 0,
                minutes: 0
            },
            checked: false
        }
    }

    handleValue = (rep, done) => {
        const summer = 100 / rep;
        const value = done * summer;
        return value;
    }

    handleAdd = (quest, rep, time, friend, group) => {
        const questPlace = `quests.${group}`;

        if (friend === null) {
            if (time === null) {
                updateDoc(doc(db, "players", this.props.user_object.currentUser.uid), {[questPlace]: arrayUnion({quest:quest, done:0, rep:rep, timestamp:moment().format("DD-MM-YYYY")})});
            } else {
                let timer = (moment().add(time.days, 'days').add(time.hours, 'hours').add(time.minutes, 'minutes')).format();
                updateDoc(doc(db, "players", this.props.user_object.currentUser.uid), {[questPlace]: arrayUnion({quest:quest, done:0, rep:rep, timer:timer, timestamp:moment().format("DD-MM-YYYY")})});
            }

        } else {
            let newData = null;
            if (time === null) {
                newData = {quest:quest, done:0, rep:rep, accepted:false};
            } else {
                let timer = (moment().add(time.days, 'days').add(time.hours, 'hours').add(time.minutes, 'minutes')).format();
                newData = {quest:quest, done:0, rep:rep, timer:timer, accepted:false, timestamp:moment().format("DD-MM-YYYY")};
            }
            console.log(friend);
            this.sendQuest(newData, friend);
        }
    }

    sendQuest = (quest, dest) => {
        console.log(dest);
        const hola = `friends.${this.props.firebase_items.name}.quests`;
        queryUser(dest).then(result => {
                if (!result.empty) {
                    updateDoc(doc(db, "players", result.docs[0]['id']), {[hola]:arrayUnion(quest)});
                } else {
                    console.log(`No se ha encontrado a ${dest}`);
                }
            });
        this.setState({open: false});
    }

    render() {
        return (
            <div>
                <Dialog open={this.props.open}>
                            <DialogTitle>Añadir Misión</DialogTitle>
                            <DialogContent>
                            <h3>Misión</h3>
                            <div style={{display:'flex', flexDirection:'row', flexWrap:'nowrap'}}>
                                <TextField style={{width:'20%', marginRight:10, marginTop:5}}
                                    margin="none"
                                    label='Nº'
                                    type="number"
                                    size="small"
                                    variant="outlined"
                                    value={this.state.cantidad}
                                    onChange={(e) => {this.setState({cantidad: e.target.value})}}
                                />
                                <TextField style={{width:'80%'}}
                                    error={this.state.errorM !== ''}
                                    helperText={this.state.errorM}
                                    margin="none"
                                    label='Misión'
                                    type="text"
                                    fullWidth
                                    size="small"
                                    variant="standard"
                                    value={this.state.mision}
                                    onChange={(e) => {this.setState({mision: e.target.value})}}
                                />
                            </div>
                            <h3>Tiempo Límite</h3>
                            <FormControlLabel control={<Switch onChange={(e) => this.setState({checked:e.target.checked})} />} label="Tiempo límite" />
                            <div style={{display:'flex', flexDirection:'row', flexWrap:'nowrap'}}>
                                <TextField style={{width:'20%', marginRight:10, marginTop:5}}
                                    margin="none"
                                    disabled={!this.state.checked}
                                    label='Days'
                                    type="number"
                                    size="small"
                                    variant="outlined"
                                    value={this.state.timer.days}
                                    onChange={(e) => {this.setState({timer: {...this.state.timer, days:e.target.value}})}}
                                />
                                <TextField style={{width:'20%', marginRight:10, marginTop:5}}
                                    disabled={!this.state.checked}
                                    margin="none"
                                    label='Hours'
                                    type="number"
                                    size="small"
                                    variant="outlined"
                                    value={this.state.timer.hours}
                                    onChange={(e) => {this.setState({timer: {...this.state.timer, hours:e.target.value}})}}
                                />
                                <TextField style={{width:'20%', marginRight:10, marginTop:5}}
                                    disabled={!this.state.checked}
                                    margin="none"
                                    label='Minutes'
                                    type="number"
                                    size="small"
                                    variant="outlined"
                                    value={this.state.timer.minutes}
                                    onChange={(e) => {this.setState({timer: {...this.state.timer, minutes:e.target.value}})}}
                                />
                            </div>
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={() => {
                                if (this.state.mision === '') {
                                    this.setState({errorM: 'Rellene este campo'});
                                } else {
                                    if ( !this.state.checked ){
                                        this.handleAdd(this.state.mision, this.state.cantidad, null, this.props.friend, this.props.group);
                                        this.setState({mision: '', errorM:''});
                                        this.props.handleClose();
                                    } else {
                                        this.handleAdd(this.state.mision, this.state.cantidad, this.state.timer, this.props.friend, this.props.group);
                                        this.setState({mision: '', errorM:'', timer:{days:0,hours:0,minutes:0}, checked:false});
                                        this.props.handleClose();
                                    }
                                }

                            }}>Guardar</Button>
                            <Button onClick={() => {this.props.handleClose();}}>Cancel</Button>
                            </DialogActions>
                        </Dialog>
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

export default connect(mapStateToProps)(QuestMenu);
