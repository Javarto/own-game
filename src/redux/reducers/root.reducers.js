import { combineReducers } from "redux";
import {persistReducer} from "redux-persist";
import user_object from "./user.reducers";
import firebase_items from "./menu.reducer";
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key:'currentUser',
    storage,
    whitelist: ['user_object', 'firebase_items']
}

const rootReducers = combineReducers({
    user_object:user_object,
    firebase_items: firebase_items,
});

export default persistReducer(persistConfig, rootReducers);