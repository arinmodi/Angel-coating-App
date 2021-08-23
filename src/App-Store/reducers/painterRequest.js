import { FETCH_DATA,STATUS } from '../Actions/painterRequest';

const intialState = {
    Request_Data : [],
    Load : true
}

const Request_Reducer = (state = intialState,action) => {
    switch(action.type){
        case FETCH_DATA : 
            return { ...state, Request_Data : action.Data }
        
        case STATUS : 
            return { ...state, Load : action.Data }

        default : 
            return state
    }
};

export default Request_Reducer;