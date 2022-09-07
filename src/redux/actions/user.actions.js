export const SIGN_IN = 'SIGN_IN';
export const SIGN_OUT = 'SIGN_OUT';
export const SIGN_UP = 'SIGN_UP';

export const sign_in_action = (session) => {
    return {
        type: SIGN_IN,
        payload: session
    }
};

export const sign_out_action = (session) => {
    return {
        type: SIGN_OUT,
        payload: session
    }
};

export const sign_up_action = (session) => {
    return {
        type: SIGN_IN,
        payload: session
    }
};