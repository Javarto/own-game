import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import { sign_in_action } from '../redux/actions/user.actions';

class home extends Component {
    render() {
        return <Redirect to='/login' />
    }
}

const mapStateToProps = (state) => {
    return {
        user_object: state.user_object
    }
}

const mapDispatchToProps = {
    sign_in_action
}

export default connect(mapStateToProps, mapDispatchToProps)(home);
