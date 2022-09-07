export const CHANGE_GROUP = 'CHANGE_GROUP_NAME';
export const SIGN_OUT_RESET = 'SIGN_OUT_RESET';
export const SAVE_DATA = 'SAVE_DATA';
export const EDITING_MENU = 'EDITING_MENU';
export const ADD_ITEM = 'ADD_ITEM';
export const REMOVE_ITEM = 'REMOVE_ITEM';
export const SET_INITIAL_ITEMS = 'SET_INITIAL_ITEMS';

export const change_group_action = (data) => {
    return {
        type: CHANGE_GROUP,
        payload: data
    }
};

export const save_firebase_data_action = (uid, data) => {
    return {
            type: SAVE_DATA,
            payload: [uid, data]
        }
};

export const reset_firebase_data_action = () => {
    return {
            type: SIGN_OUT_RESET,
            payload: {}
        }
};

export const editing_firebase_menu = (estado) => {
    return {
        type: EDITING_MENU,
        payload:estado
    }
};

export const add_menu_item = (item, parent_id) => {
    return {
        type: ADD_ITEM,
        payload:[item, parent_id]
    }
};

export const remove_menu_item = (item, parent_id) => {
    return {
        type: REMOVE_ITEM,
        payload:[item, parent_id]
    }
};

export const set_initial_items = (data) => {
    return {
        type: SET_INITIAL_ITEMS,
        payload: data
    }
}