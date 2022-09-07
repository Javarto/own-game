import { SIGN_IN, SIGN_OUT, SIGN_UP } from "../actions/user.actions";

const default_user = {
    currentUser: null
};

const user_object = (state = default_user, action) => {
    switch (action.type) {
        case SIGN_IN: {
            return {
                ...state,
                currentUser: action.payload
            }
        }

        case SIGN_OUT: {
            return {
                ...state,
                currentUser: action.payload
            }
        }

        case SIGN_UP: {
            return {
                ...state,
                currentUser: action.payload
            }
        }
    
        default: return state;
    }
};

export default user_object;