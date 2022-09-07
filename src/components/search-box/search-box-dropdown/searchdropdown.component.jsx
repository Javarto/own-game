import React from 'react';
import './searchdropdown.styles.css';

class SearchDropdown  extends React.Component {
    render() {
        return (
            <div className='search-dropdown-container'>
        {
            this.props.dat.map( item => (
                <div key={item.name} className='search-part'>
                    <h4>{item.name}</h4>
                    {
                        item.data.map(comp => (
                            <div key={comp.name} className='search-comp' onClick={() => this.props.handler(comp.name)}>
                                {
                                    item === 'Ciudades' ?<i className="material-icons">place</i>: <div className='search-comp-symb'>&#127987;</div>
                                }
                                <span className='search-comp-name'>{comp.name}</span>
                            </div>
                        ))
                    }
                </div>
            ))
        }
    </div>
); 
    }
}

export default SearchDropdown;