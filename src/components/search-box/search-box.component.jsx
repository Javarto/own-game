import React from 'react'
import SearchDropdown from './search-box-dropdown/searchdropdown.component';
import onClickOutside from 'react-onclickoutside';

import TextField from '@material-ui/core/TextField';

const data = [
    {
        type: 'Ciudades',
        data:[
            {
                name: 'Alicante'
            },
            {
                name: 'Madrid'
            },
            {
                name: 'Sevilla'
            },
            {
                name: 'Barcelona'
            },
            {
                name: 'Valencia'
            },
            {
                name: 'Málaga'
            },
            {
                name:'Murcia'
            },
            {
                name:'Cádiz'
            },
            {
                name:'Baleares'
            },
            {
                name:'Vizcaya'
            },
            {
                name:'Las Palmas'
            },
            {
                name:'La Coruña'
            },
            {
                name:'Santa Cruz de Tenerife'
            },
            {
                name:'Asturias'
            },
            {
                name:'Zaragoza'
            },
            {
                name:'Pontevedra'
            },
            {
                name:'Granada'
            },
            {
                name:'Tarragona'
            },
            {
                name:'Gerona'
            },
            {
                name:'Córdoba'
            },
            {
                name:'Almería'
            },
            {
                name:'Guipúzcoa'
            },
            {
                name:'Toledo'
            },
            {
                name:'Badajoz'
            },
            {
                name:'Navarra'
            },
            {
                name:'Jaén'
            },
            {
                name:'Castellón'
            },
            {
                name:'Cantabria'
            },
            {
                name:'Huelva'
            },
            {
                name:'Valladolid'
            },
            {
                name:'Ciudad Real'
            },
            {
                name:'León'
            },
            {
                name:'Lérida'
            },
            {
                name:'Cáceres'
            },
            {
                name:'Albacete'
            },
            {
                name:'Burgos'
            },
            {
                name:'Álava'
            },
            {
                name:'Salamanca'
            },
            {
                name:'Lugo'
            },
            {
                name:'La Rioja'
            },
            {
                name:'Orense'
            },
            {
                name:'Guadalajara'
            },
            {
                name:'Huesca'
            },
            {
                name:'Cuenca'
            },
            {
                name:'Zamora'
            },
            {
                name:'Palencia'
            },
            {
                name:'Ávila'
            },
            {
                name:'Segovia'
            },
            {
                name:'Teruel'
            },
            {
                name:'Soria'
            },
            {
                name:'Melilla'
            },
            {
                name:'Ceuta'
            }
        ]
    }
];



class SearchBox extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            searchField: '',
            value:'',
            clicked: false
        };
    }

    handleChanger = (e) => {
        this.setState({searchField: e.target.value });
        this.setState({value: e.target.value });
        if (this.state.value.length >= 1) {
            this.setState({clicked: true});
        } else {
            this.setState({clicked: false});
        }
    }

    handleClickOutside() {
        this.setState({value: ''});
        this.handler(this.state.searchField);
    }

    handler= (name) => {
        this.setState({searchField: name}, () => console.log('Submied'));
        this.setState({value: ''});
    }
    render() {
        const filteredLocations = data.map(tipo => ({'name':[tipo.type], 'data': tipo.data.filter(nombre => nombre.name.toLowerCase().includes(this.state.searchField.toLowerCase()))}));
        return (
            <div>
                <TextField 
                        margin='normal'
                        name='location' 
                        type='text' 
                        label="Jugador" 
                        variant="standard" 
                        color='primary' 
                        required
                        placeholder={this.props.placeholder}
                        onChange={this.handleChanger}
                        value={this.state.searchField}
                    />
            {
                (this.state.value).length >= 1  ? (
                    <SearchDropdown key='987' dat={filteredLocations} handler={this.handler}/>
                ) : null
            }
            </div>
        );
    }
}

export default onClickOutside(SearchBox);