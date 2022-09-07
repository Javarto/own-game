export const ADD_ITEM = 'ADD_ITEM';
export const REMOVE_ITEM = 'REMOVE_ITEM';
export const REMOVE_SIGN_OUT = 'REMOVE_SIGN_OUT';
export const PEDIR_CUENTA = 'PEDIR_CUENTA';
export const CUENTA_PAGADA = 'CUENTA_PAGADA';
export const CLEAN_CLIENT = 'CLEAN_CLIENT';

export const add_menu_item = (item, parent_id, precio, nombre) => {
    return {
        type: ADD_ITEM,
        payload:[item, parent_id, Number(precio), nombre]
    }
};

export const remove_menu_item = (item, parent_id, precio, nombre) => {
    return {
        type: REMOVE_ITEM,
        payload:[item, parent_id, Number(precio), nombre]
    }
};

export const remove_all_cesta = () => {
    return {
        type: REMOVE_SIGN_OUT
    }
};

export const clean_client = () => {
    return {
        type: CLEAN_CLIENT
    }
};

export const cuenta_pagada = (uid, datos) => {
    return {
        type: CUENTA_PAGADA,
        payload: [uid, datos]
    }
};

export const pedir_cuenta = (uid) => {
    return {
        type: PEDIR_CUENTA,
        payload: uid
    }
};