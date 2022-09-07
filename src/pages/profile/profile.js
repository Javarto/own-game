import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import { db } from '../../firebase/firebase';
import {doc, updateDoc, increment } from "firebase/firestore";

import { save_firebase_data_action, editing_firebase_menu, set_initial_items } from '../../redux/actions/menu.actions';

import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';

import Chip from '@mui/material/Chip';

import { LinearProgress } from '@material-ui/core';

import Button from '@material-ui/core/Button';

import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import GroupQuest from './principalMenuItem/GroupQuest';

import CircularProgress from '@mui/material/CircularProgress';

import moment from 'moment';

import ObjectivesChart from '../../components/ObjectivesChart';

export function generatePassword(val) {
    var length = val,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

let datos = [['Fecha', 'Cumplidos']];

class Profile extends Component {
    constructor() {
        super();
        this.state= {
            open: false,
            group: ''
        }
    }

    handleValue = (rep, done) => {
        const summer = 100 / rep;
        const value = done * summer;
        return value
    }

    handleAddGroup = (uid, group) => {

        updateDoc(doc(db, "players", uid), {quests:{...this.props.firebase_items.quests, [group]: []}, completed:{...this.props.firebase_items.completed, [group]: []}, Canceladas:{...this.props.firebase_items.canceladas, [group]: []}});
        this.setState({group: '', open:false});
    }

    componentDidMount() {
        if (this.props.firebase_items.diaryObjectives !== null && !((this.props.firebase_items.diaryObjectives).hasOwnProperty(moment().format("DD-MM-YYYY")))) {
            const date = moment().format("DD-MM-YYYY");
            const place = `diaryObjectives.${date}`
            updateDoc(doc(db, "players", this.props.user_object.currentUser.uid), {[place]: 0, used: increment(1)});
        }
        if (this.props.firebase_items.diaryObjectives !== null && datos.length === 1) {
            const objectives = this.props.firebase_items.diaryObjectives;
            var filteredObj = Object.keys(objectives).map(objective => (objective.split('-')).reverse().join('-'));
            filteredObj.sort((a,b) => moment(a).diff(moment(b)));
            filteredObj.map(key => 
                datos.push([(key.split('-')).reverse().slice(0,2).join('/'), objectives[(key.split('-')).reverse().join('-')]])
            )
        }
    }

    render() {
        if (this.props.user_object.currentUser === null) {
            return <Redirect to='/login' />
        }
        if (this.props.firebase_items.quests === null) {
            return (
                <Box sx={{ display: 'flex' }}>
                    <CircularProgress />
                </Box>
            )
        }
        return (
            <div>
                {
                    this.state.open ?
                        <Dialog open={this.state.open}>
                            <DialogTitle>Añadir Grupo</DialogTitle>
                            <DialogContent>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="Nombre Grupo"
                                    type="email"
                                    fullWidth
                                    variant="standard"
                                    value={this.state.group}
                                    onChange={(e) => this.setState({group: e.target.value})}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => {this.setState({group: '', open:false});}}>Cancelar</Button>
                                <Button onClick={() => {this.handleAddGroup(this.props.user_object.currentUser.uid, this.state.group);}}>Añadir</Button>
                            </DialogActions>
                        </Dialog>
                    : null
                }
                <h3 style={{textAlign:'center', margin:0}}>Completadas:</h3>
                <div style={{width:'100%', height:'100%', display:'flex', flexDirection:'column',padding:15}}>
                    <div style={{width:'100%', display:'flex', flexDirection:'row', flexWrap:'nowrap'}}>
                        <LinearProgress color='secondary' style={{
                                        width:'85%',
                                        height:20,
                                        borderRadius:5,
                                        marginBottom:5,
                                    }} variant="determinate" value={this.handleValue(this.props.firebase_items.nextReward, this.props.firebase_items.totalDone)}/>
                        <div style={{display:'flex', flexDirection:'row', flexWrap:'nowrap', marginLeft:10}}>
                            <span>{this.props.firebase_items.totalDone}</span>
                            <span style={{margin:'0 3px'}}>/</span>
                            <span>{this.props.firebase_items.nextReward}</span>
                        </div>
                    </div>
                    <div style={{width:'100%', height:'100%', display:'flex', flexDirection:'row', flexWrap:'wrap'}}>
                        <span style={{fontSize:15, marginRight: 10, marginTop:2}}>Recompensa:</span>
                        <div style={{display:'flex', flexDirection:'row', flexWrap:'wrap'}}>
                            <Chip style={{margin:'0 2px 2px 2px', backgroundColor:'#fdd835'}} label={`x1 Uber eats"`} size="small" />
                        </div>
                    </div>
                </div>
                <div style={{display:'flex', flexDirection:'row'}}>
                    <h3>Dias activo:</h3>
                    <h3 style={{fontWeight:'bold', color:'green'}}>{this.props.firebase_items.used}</h3>    
                </div>
                <Container maxWidth="lg">
                    <Box sx={{ bgcolor: '#cfe8fc', borderRadius: 25, padding:10 }}>
                        <FormControlLabel control={<Switch checked={this.props.firebase_items.public} onChange={(e) => updateDoc(doc(db, "players", this.props.user_object.currentUser.uid), {public:e.target.checked})} />} label="Perfil público" />
                        <h2 style={{textAlign:'center'}}>Tabla</h2>
                        <ObjectivesChart objectives={this.props.firebase_items.diaryObjectives} />
                        {
                            (this.props.firebase_items.diaryObjectives).hasOwnProperty(moment().format("DD-MM-YYYY")) ? <h3>{`Objetivos cumplidos hoy: ${this.props.firebase_items.diaryObjectives[moment().format("DD-MM-YYYY")]}`}</h3> : <h3>Todavia no ha completado ningún objetivo hoy</h3>
                        }
                        <div>
                            {
                                Object.keys(this.props.firebase_items.quests).sort().map(group => 
                                    <GroupQuest friend={null} edit={true} completed={this.props.firebase_items.completed} quests={this.props.firebase_items.quests} canceladas={this.props.firebase_items.canceladas} name={group} />
                                    )
                            }
                        </div>
                        <Button color='primary' variant='contained'
                            onClick={() => this.setState({open:true})}>
                            Añadir Grupo
                        </Button>
                    </Box>
                </Container>
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

const mapDispatchToProps = {
    save_firebase_data_action,
    editing_firebase_menu,
    set_initial_items
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
