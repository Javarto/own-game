import React, { Component } from 'react';
import { connect } from 'react-redux';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import Badge from '@material-ui/core/Badge';

import Button from '@material-ui/core/Button';

import QuestCard from './QuestCard';

import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import QuestMenu from '../../../components/QuestMenu';
import backgroundRuby from "../../../images/ruby.jpg";
import backgroundDiamond from "../../../images/diamond.jpg";
import backgroundSteel from "../../../images/steel.jpg";
import backgroundGold from "../../../images/gold.jpg";
import backgroundWood from "../../../images/wood.png";

class GroupQuest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            profile:true,
            cancel: false,
            timestamp: true
        }
    }

    handleEdit = (e, tipo, info) => {
        this.setState({open: true, type: tipo, info:info})
        e.stopPropagation();
    }

    AddGroup = () => {
        this.setState({open: true, type: 0, info: 'Añadir nuevo grupo'});
    }

    AddItem = () => {
        this.setState({open: true, type: 1, info:'Añadir nuevo plato'});
    }
    
    handleValue = (rep, done) => {
        const summer = 100 / rep;
        const value = done * summer;
        return value;
    }

    handleClose = () => {
        this.setState({open: false});
    }

    handleOpen = (val) => {
        this.setState({open: val});
    }

    handleButton = () => {
        if (this.state.cancel) {
            this.setState({profile: !this.state.profile, cancel: false});
        } else {
            this.setState({profile: !this.state.profile})
        }
    }

    render() {

        const cursor = 'default';
        let style;
        const b = Object.keys(this.props.completed[this.props.name]).length;
        switch (true) {
            case b >= 5 && b < 12:
                style = {borderRadius:10, backgroundImage:`url(${backgroundWood})`, backgroundSize:'100% 100%', color:'#fff'};
                break;
            case b >= 12 && b < 25:
                style = {borderRadius:10, backgroundImage:`url(${backgroundSteel})`, backgroundSize:'100% 100%'};
                break
            case b >= 25 && b < 50:
                style = {borderRadius:10, backgroundImage:`url(${backgroundGold})`, backgroundSize:'100% 100%'};
                break
            case b >= 50 && b < 100:
                style = {borderRadius:10, backgroundImage:`url(${backgroundRuby})`, backgroundSize:'100% 100%', color:'#fff'};
                break
            case b >= 100:
                style = {borderRadius:10, backgroundImage:`url(${backgroundDiamond})`, backgroundSize:'100% 100%'};
                break
            default:
                style = {borderRadius:10, backgroundColor: 'rgb(255,255,255)'};
                break;
        }
        return (
            <div>
                {
                    this.state.open ? (
                        <QuestMenu group={this.props.name} friend={this.props.friend} handleClose={this.handleClose} open={this.state.open} />
                    ) : null
                }
                <Accordion style={{marginBottom:5, cursor: cursor, borderRadius:10}}>
                    <AccordionSummary
                        style={style}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <div style={{width:'100%', padding:10, display:'flex', flexDirection:'row', justifyContent:'space-around'}}>
                            <div style={{width:'70%'}}>
                                <Badge badgeContent={Object.keys(this.props.quests[this.props.name]).length} color="error">
                                    <h3>{this.props.name}</h3>
                                </Badge>
                            </div>
                            <h3>{Object.keys(this.props.completed[this.props.name]).length}</h3>
                        </div>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div style={{display:'flex', flexDirection:'column', width:'100%'}}>
                            <FormControlLabel control={<Switch checked={this.state.timestamp} onChange={(e) => this.setState({timestamp: !this.state.timestamp})} />} label="Mostrar Timestamp" />
                            <div style={{width:'100%', justifyContent:'center', display:'flex', flexDirection:'row'}}>
                                <Button color='primary' variant='contained' style={{margin:'0 3px'}}
                                    onClick={() => this.handleButton()}>
                                    {this.state.profile ? 'Completadas' : 'Activas'}
                                </Button>
                                <Button color='secondary' variant='contained' style={{margin:'0 3px'}}
                                    onClick={() => this.setState({cancel: !this.state.cancel})}>
                                    Canceladas
                                </Button>
                            </div>
                            {
                                this.state.profile  && this.state.cancel === false ?
                                    <div style={{width:'100%'}}>
                                        <h3>Misiones Activas: {Object.keys(this.props.quests[this.props.name]).length}</h3>
                                        {
                                            Object.keys(this.props.quests[this.props.name]).map(item => 
                                                <QuestCard friend={this.props.friend} time={this.state.timestamp} date={this.props.quests[this.props.name][item]} edit={this.props.edit} group={this.props.name} check={this.props.quests[this.props.name][item]} item={item} rep={this.props.quests[this.props.name][item].rep} done={this.props.quests[this.props.name][item].done} quest={this.props.quests[this.props.name][item].quest} reward={this.props.quests[this.props.name][item].reward} />
                                            )
                                        }
                                        {
                                            this.props.edit ?
                                                <Button color='primary' variant='contained'
                                                    onClick={() => this.setState({open:true})}>
                                                    Añadir Misión
                                                </Button>
                                            : null
                                        }
                                    </div>
                                : 
                                    this.state.cancel ?
                                        <div>
                                        <h3>Misiones Canceladas: {Object.keys(this.props.canceladas[this.props.name]).length}</h3>
                                        {
                                            Object.keys(this.props.canceladas[this.props.name]).map(item => 
                                                <QuestCard time={this.state.timestamp} group={this.props.name} friend={null} check={null} item={item} rep={this.props.canceladas[this.props.name][item].rep} done={this.props.canceladas[this.props.name][item].done} quest={this.props.canceladas[this.props.name][item].quest} reward={this.props.canceladas[this.props.name][item].reward} date={this.props.canceladas[this.props.name][item]} />
                                            )
                                        }
                                        </div>
                                    : 
                                        <div>
                                            <h3>Misiones Completadas: {Object.keys(this.props.completed[this.props.name]).length}</h3>
                                            {
                                                Object.keys(this.props.completed[this.props.name]).map(item => 
                                                    <QuestCard time={this.state.timestamp} date={this.props.completed[this.props.name][item]} group={this.props.name} friend={null} check={null} item={item} rep={this.props.completed[this.props.name][item].rep} done={this.props.completed[this.props.name][item].done} quest={this.props.completed[this.props.name][item].quest} reward={this.props.completed[this.props.name][item].reward} />
                                                )
                                            }
                                        </div>
                            }
                        </div>
                    </AccordionDetails>
                </Accordion>
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

export default connect(mapStateToProps)(GroupQuest);
