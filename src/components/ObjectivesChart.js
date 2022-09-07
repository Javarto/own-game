import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import Chart from 'react-google-charts';

class ObjectivesChart extends Component {
    render() {
        let datos = [['Fecha', 'Cumplidos']];
        const objectives = this.props.objectives;
        if ( !objectives ) {
            return <p>Loading...</p>
        }
        var filteredObj = Object.keys(objectives).map(objective => (objective.split('-')).reverse().join('-'));
        filteredObj.sort((a,b) => moment(a).diff(moment(b)));
        filteredObj.map(key => 
            datos.push([(key.split('-')).reverse().slice(0,2).join('/'), objectives[(key.split('-')).reverse().join('-')]])
        )
        return (
            <div>
                <Chart
                    height={'300px'}
                    chartType="LineChart"
                    loader={<div>Loading Chart</div>}
                    data={datos}
                    options={{
                    title: 'Objetivos Cumplidos',
                    hAxis: { title: 'Fecha', titleTextStyle: { color: '#333' } },
                    vAxis: { minValue: 0, title:'Completados' },
                    }}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        firebase_items: state.firebase_items
    }
}

export default connect(mapStateToProps)(ObjectivesChart);
