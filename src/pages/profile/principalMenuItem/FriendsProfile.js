import React, { Component } from 'react';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import Badge from '@material-ui/core/Badge';

import Button from '@material-ui/core/Button';

import QuestCard from './QuestCard';

class FriendsProfile extends Component {
    render() {
        const colour = 'rgb(255,255,255)';
        const cursor = 'default';
        return (
            <Accordion style={{marginBottom:5, borderRadius:10, backgroundColor: colour, cursor: cursor}}>
                    <AccordionSummary
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <div style={{width:'100%', padding:10, display:'flex', flexDirection:'row', justifyContent:'space-around'}}>
                            <div style={{width:'45%'}}>
                                <Badge badgeContent={Object.keys(this.props.firebase_items.quests[this.props.name]).length} color="error">
                                    <h3>{this.props.name}</h3>
                                </Badge>
                            </div>
                        </div>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div style={{display:'flex', flexDirection:'column', width:'100%'}}>
                            <div style={{width:'100%', textAlign:'center'}}>
                                <Button color='primary' variant='contained' style={{margin:'0 3px'}}
                                    onClick={() => this.setState({profile: !this.state.profile})}>
                                    {this.state.profile ? 'Completadas' : 'Activas'}
                                </Button>
                            </div>
                            {
                                this.state.profile ?
                                    <div style={{width:'100%'}}>
                                        <h3>Misiones Activas: {Object.keys(this.props.firebase_items.quests[this.props.name]).length}</h3>
                                        {
                                            Object.keys(this.props.firebase_items.quests[this.props.name]).map(item => 
                                                <QuestCard time={true} group={this.props.name} date={this.props.firebase_items.quests[this.props.name][item]} check={this.props.firebase_items.quests[this.props.name][item]} friend={null} item={item} rep={this.props.firebase_items.quests[this.props.name][item].rep} done={this.props.firebase_items.quests[this.props.name][item].done} quest={this.props.firebase_items.quests[this.props.name][item].quest} />
                                            )
                                        }
                                    </div>
                                : 
                                    <div>
                                    <h3>Misiones Completadas: {Object.keys(this.props.firebase_items.completed[this.props.name]).length}</h3>
                                    {
                                        Object.keys(this.props.firebase_items.completed[this.props.name]).map(item => 
                                            <QuestCard time={true} group={this.props.name} friend={null} check={null} item={item} date={this.props.firebase_items.completed[this.props.name][item]} rep={this.props.firebase_items.completed[this.props.name][item].rep} done={this.props.firebase_items.completed[this.props.name][item].done} quest={this.props.firebase_items.completed[this.props.name][item].quest} />
                                        )
                                    }
                                    </div>
                            }
                        </div>
                    </AccordionDetails>
                </Accordion>
        )
    }
}

export default FriendsProfile;
