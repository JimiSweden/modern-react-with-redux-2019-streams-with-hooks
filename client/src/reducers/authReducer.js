import { SIGNED_IN, SIGNED_OUT, UPDATE_USER } from '../actions/types';

const INITIAL_STATE = {
    isSignedIn: null,
    user: null
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SIGNED_OUT:
            return { ...state, isSignedIn: false };
        case SIGNED_IN:
            //todo:  get user info here.
            return { ...state, isSignedIn: true };
        case UPDATE_USER:
            // console.log('updating user : ', action.payload)
            return { ...state, user: action.payload }
        default:
            return state;
    }
}