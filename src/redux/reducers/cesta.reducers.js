import { ADD_ITEM, REMOVE_ITEM, REMOVE_SIGN_OUT, PEDIR_CUENTA, CUENTA_PAGADA, CLEAN_CLIENT} from "../actions/cesta.actions";
import { database } from '../../firebase/firebase';

import { ref, set } from "firebase/database";

const default_cesta_items = {

    cestaCompra: {},
    backUpCompra: {},
    total: 0,
    cuenta: false
}


const cesta_items = (state = default_cesta_items, action) => {

    switch (action.type) {
        case ADD_ITEM: {
                let ids = state.cestaCompra;
                for (let id of action.payload[1]) {
                    if (ids.hasOwnProperty(id)) {
                        ids = ids[id];
                        if (id !== action.payload[1].slice(-1)[0]) {
                            ids['total'] = ids['total'] + 1;
                        }
                    } else {
                        if (id !== action.payload[1].slice(-1)[0]) {
                            ids[id] = {total: 1};
                        } else {
                            ids[id] = {total:0};
                        }
                        ids = ids[id];
                    }
                }
                if (ids.hasOwnProperty(action.payload[0])) {
                    ids['total'] = ids['total'] + 1;
                    ids[action.payload[0]] = ids[action.payload[0]] + 1;
                    return {
                        ...state,
                        cestaCompra: state.cestaCompra,
                        backUpCompra: {...state.backUpCompra, [action.payload[3]]: state.backUpCompra[action.payload[3]] + 1, total: state.total + action.payload[2], cuenta:false},
                        total: state.total + action.payload[2]
                    }

                } else {
                    ids['total'] = ids['total'] + 1;
                    ids[action.payload[0]] = 1;
                    let retVal = state.backUpCompra.hasOwnProperty(action.payload[3]) ? state.backUpCompra[action.payload[3]] + 1 : 1
                    return {
                        ...state,
                        cestaCompra:state.cestaCompra,
                        backUpCompra: {...state.backUpCompra, [action.payload[3]]: retVal, total: state.total + action.payload[2], cuenta:false},
                        total: state.total + action.payload[2]
                    }
                }
        }
        case REMOVE_ITEM: {
            let ids = state.cestaCompra;
            let ids2 = state.backUpCompra;
            for (let id of action.payload[1]) {
                ids = ids[id];
                ids['total'] = ids['total'] - 1;
            }
            if ( ids[action.payload[0]] - 1 === 0) {
                delete ids[action.payload[0]];
            }
            else {
                ids[action.payload[0]] = ids[action.payload[0]] - 1;
            }
            
            if ( ids2[action.payload[3]] - 1 === 0) {
                delete ids2[action.payload[3]];
                return {
                    ...state,
                    cestaCompra:state.cestaCompra,
                    backUpCompra: {...state.backUpCompra, total: state.total - action.payload[2], cuenta:false},
                    total: state.total - action.payload[2]
                }
            } else {
                return {
                    ...state,
                    cestaCompra:state.cestaCompra,
                    backUpCompra: {...state.backUpCompra, [action.payload[3]]: state.backUpCompra[action.payload[3]] - 1, total: state.total - action.payload[2], cuenta:false},
                    total: state.total - action.payload[2]
                }
            }
        }
        case REMOVE_SIGN_OUT: {
            return {
                ...state,
                cestaCompra: {}
            }
        }
        case CLEAN_CLIENT: {
            return {
                cestaCompra: {},
                backUpCompra: {},
                total: 0,
                cuenta: false
            }
        }
        case PEDIR_CUENTA: {
            set(ref(database, 'pepito/' + action.payload), {
                mesa1: {...state.backUpCompra, cuenta:true}
            });
            return {
                ...state,
                backUpCompra:{...state.backUpCompra, cuenta:true},
                cuenta: true
            }
        }
        case CUENTA_PAGADA: {
            set(ref(database, 'pepito/' + action.payload[0]), {
                mesa1: action.payload[1]['mesa1']
            });
            return {
                ...state,
                backUpCompra:{...state.backUpCompra, cuenta:'Done'},
                cuenta: 'Done'
            }
        }
        default: return state;
    }
};

export default cesta_items;