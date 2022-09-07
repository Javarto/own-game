import { CHANGE_GROUP, SAVE_DATA, SIGN_OUT_RESET, EDITING_MENU, SET_INITIAL_ITEMS } from "../actions/menu.actions";
import { db } from '../../firebase/firebase';
import { doc, updateDoc } from "firebase/firestore";


const default_firebase_items = {
    quests: null,
    name: '',
    completed: 0,
    rewards: false,
    friends: {},
    messages:[],
    ciudad:'',
    public:false,
    canceladas:null,
    diaryObjectives: null,
    used: 0,
    nextReward: 0,
    totalDone: 0
}


const firebase_items = (state = default_firebase_items, action) => {
    const setFunc = async (uid, data) => {
        await updateDoc(doc(db, "players", uid), {quests:data});
    }

    switch (action.type) {
        case SET_INITIAL_ITEMS: {
            return {
                ...state,
                quests: action.payload.quests,
                name: action.payload.name,
                completed: action.payload.completed,
                friends: action.payload.friends,
                messages: action.payload.messages,
                ciudad: action.payload.ciudad,
                public: action.payload.public,
                canceladas: action.payload.Canceladas,
                diaryObjectives: action.payload.diaryObjectives,
                used: action.payload.used,
                nextReward:action.payload.nextReward,
                totalDone:action.payload.totalDone
            }
        }
        case CHANGE_GROUP: {
            return {
                ...state,
                quests: action.payload
            }
        }

        case SIGN_OUT_RESET: {
            return default_firebase_items
                
        }
        case SAVE_DATA: {
            setFunc(action.payload[0], action.payload[1])
            return {
                ...state,
                items: action.payload[1]
            }
        }
        case EDITING_MENU: {
            return {
                ...state,
                editing: action.payload
            }
        }
        default: return state;
    }
};

export default firebase_items;