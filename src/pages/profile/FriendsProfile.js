import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';

import { queryUser } from '../../firebase/firebase';

import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';

import Chip from '@mui/material/Chip';

import { LinearProgress } from '@material-ui/core';

import GroupQuest from './principalMenuItem/GroupQuest';

import CircularProgress from '@mui/material/CircularProgress';

import moment from 'moment';

import ObjectivesChart from '../../components/ObjectivesChart';

class FriendsProfile extends Component {
    constructor() {
        super();
        this.state= {
            quests: null,
            completed:null,
            canceladas:null,
            public: null,
            diaryObjectives: null,
            nextReward: 0,
            used: 0,
            uid: null,
            totalDone:0
        }
    }

    componentDidMount() {
        queryUser(decodeURI((this.props.history.location.pathname.split('/').slice(-1))[0])).then(result => {
            if (!result.empty) {
                if (result.docs[0].data().public === true) {
                    this.setState({uid:result.docs[0].id, quests:result.docs[0].data().quests, completed:result.docs[0].data().completed, canceladas:result.docs[0].data().Canceladas, public:result.docs[0].data().public, diaryObjectives:result.docs[0].data().diaryObjectives, used: result.docs[0].data().used, nextReward: result.docs[0].data().nextReward, totalDone:result.docs[0].data().totalDone});
                } else {
                    this.setState({public:false});
                }
            }
        });
    }

    handleValue = (rep, done) => {
        const summer = 100 / rep;
        const value = done * summer;
        return value;
    }

    render() {
        if (this.props.user_object.currentUser === null) {
            return <Redirect to='/login' />
        }
        if (this.state.public=== null) {
            return (
                <Box sx={{ display: 'flex' }}>
                    <CircularProgress />
                </Box>
            )
        }
        if (this.state.public === false) {
            return (
                <h2>Perfil Privado</h2>
            )
        }
        return (
            <div>
                <h3 style={{textAlign:'center', margin:0}}>Completadas:</h3>
                <div style={{width:'100%', height:'100%', display:'flex', flexDirection:'column',padding:15}}>
                    <div style={{width:'100%', display:'flex', flexDirection:'row', flexWrap:'nowrap'}}>
                        <LinearProgress color='secondary' style={{
                                        width:'85%',
                                        height:20,
                                        borderRadius:5,
                                        marginBottom:5,
                                    }} variant="determinate" value={this.handleValue(this.state.nextReward, this.state.totalDone)}/>
                        <div style={{display:'flex', flexDirection:'row', flexWrap:'nowrap', marginLeft:10}}>
                            <span>{this.state.totalDone}</span>
                            <span style={{margin:'0 3px'}}>/</span>
                            <span>{this.state.nextReward}</span>
                        </div>
                    </div>
                    <div style={{width:'100%', height:'100%', display:'flex', flexDirection:'row', flexWrap:'wrap'}}>
                        <span style={{fontSize:15, marginRight: 10, marginTop:2}}>Recompensa:</span>
                        <div style={{display:'flex', flexDirection:'row', flexWrap:'wrap'}}>
                            <Chip style={{margin:'0 2px 2px 2px', backgroundColor:'#fdd835'}} label={`Modificar apariencia de la "Tabla"`} size="small" />
                        </div>
                    </div>
                </div>
                <div style={{display:'flex', flexDirection:'row'}}>
                    <h3>Dias activo:</h3>
                    <h3 style={{fontWeight:'bold', color:'green'}}>{this.state.used}</h3>    
                </div>
                <Container maxWidth="lg">
                    <Box sx={{ bgcolor: '#cfe8fc', borderRadius: 25, padding:10 }}>
                        <h2 style={{textAlign:'center'}}>Tabla</h2>
                        <ObjectivesChart objectives={this.state.diaryObjectives} />
                        {
                            (this.state.diaryObjectives).hasOwnProperty(moment().format("DD-MM-YYYY")) ? <h3>{`Objetivos cumplidos hoy: ${this.state.diaryObjectives[moment().format("DD-MM-YYYY")]}`}</h3> : <h3>Todavia no ha completado ningún objetivo hoy</h3>
                        }
                        <div>
                            {
                                Object.keys(this.state.quests).sort().map(group => 
                                    <GroupQuest friend={decodeURI((this.props.history.location.pathname.split('/').slice(-1))[0])} edit={false} completed={this.state.completed} quests={this.state.quests} canceladas={this.state.canceladas} name={group} />
                                    )
                            }
                        </div>
                    </Box>
                </Container>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user_object: state.user_object
    }
}

export default connect(mapStateToProps)(FriendsProfile);
