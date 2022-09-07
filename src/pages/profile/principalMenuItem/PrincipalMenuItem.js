import React, { Component } from 'react';
import { connect } from 'react-redux';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import Badge from '@material-ui/core/Badge';

import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import { IconButton } from '@material-ui/core';

import QuestCard from './QuestCard';
import {Link}  from 'react-router-dom';

class PrincipalMenuItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
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

    handleOpen = (val) => {
        this.setState({open: val});
    }
    render() {

        const colour = 'rgb(255,255,255)';
        const cursor = 'default';
        return (
            <div>
                <Accordion style={{marginBottom:5, borderRadius:10, backgroundColor: colour, cursor: cursor}}>
                    <AccordionSummary
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <div style={{width:'100%', padding:10, display:'flex', flexDirection:'row', justifyContent:'space-around'}}>
                            <div style={{width:'45%'}}>
                                <Badge badgeContent={Object.keys(this.props.firebase_items.friends[this.props.friend]['quests']).length} color="error">
                                    <h3>{this.props.friend}</h3>
                                </Badge>
                            </div>
                            <div style={{widht:'55%', textAlign:'center'}}>
                                <IconButton color='primary' variant='contained' style={{height:40, marginTop:10}}  component={Link} to={`/friend/profile/${this.props.friend}`}>
                                    <PersonIcon />
                                </IconButton>
                                <IconButton color='primary' variant='contained' style={{height:40, marginTop:10}}
                                    onClick={(e) => e.stopPropagation()}>
                                    <ChatIcon />
                                </IconButton>
                                <IconButton color='primary' variant='contained' style={{height:40, marginTop:10}}
                                    onClick={(e) => {
                                        this.setState({destination: this.props.friend}, () => {this.props.handleOpen(this.props.friend);});
                                        e.stopPropagation();
                                    }}>
                                    <SendIcon />
                                </IconButton>
                            </div>
                        </div>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div style={{display: 'flex', flexDirection:'column', textAlign:'start', width:'100%'}}>
                            {
                                Object.keys(this.props.firebase_items.friends[this.props.friend]['quests']).length > 0 ? (
                                    Object.keys(this.props.firebase_items.friends[this.props.friend]['quests']).map(item =>
                                        <QuestCard date={this.props.firebase_items.friends[this.props.friend]['quests'][item]} time={true} edit={this.props.firebase_items.friends[this.props.friend]['quests'][item].accepted ? true : false} check={this.props.firebase_items.friends[this.props.friend]['quests'][item]} friend={this.props.friend} accepted={this.props.firebase_items.friends[this.props.friend]['quests'][item].accepted} item={Number(item)} rep={this.props.firebase_items.friends[this.props.friend]['quests'][item].rep} done={this.props.firebase_items.friends[this.props.friend]['quests'][item].done} quest={this.props.firebase_items.friends[this.props.friend]['quests'][item].quest} />)
                                ) : null
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

export default connect(mapStateToProps)(PrincipalMenuItem);
