import streams from '../apis/streams';
import history from '../history';

import {
    SIGNED_IN,
    SIGNED_OUT,
    UPDATE_USER,
    STREAM_CREATED,
    STREAM_DELETED,
    STREAM_UPDATED,
    STREAM_FETCHED,
    STREAMS_FETCHED,
    STREAM_CREATE_BEGIN,
    // STREAM_CREATE_SUCCESS,
    STREAM_CREATE_FAILURE
} from './types';

export const signedIn = () => {
    return {
        type: SIGNED_IN
    };
};

export const signedOut = () => {
    return {
        type: SIGNED_OUT
    };
};

export const updateUser = (userInfo) => {
    return {
        type: UPDATE_USER,
        payload: userInfo
    };
};


export const createStream = (formValues) => async (dispatch, getState) => {
    // console.log('creating stream');
    const userId = getState().auth.user.id;
    const streamToCreate = { ...formValues, userId }
    // console.log('streamToCreate', streamToCreate)
    try {

        //todo: show "saving" on create screen , reducer and display
        dispatch({
            type: STREAM_CREATE_BEGIN
        });

        //for testing what happends on error. 
        //throw { status: 'fatal error' }

        const response = await streams.post('/streams', streamToCreate);

        //TODO, REPLACE WITH SUCCESS
        dispatch({
            type: STREAM_CREATED,
            payload: response.data
        })


        //navigate user to root on success
        history.push('/');

    } catch (error) {
        console.log('error creating stream', error)

        //dispatch error here
        //TODO: implement reducer and display in StreamCreate
        dispatch({
            type: STREAM_CREATE_FAILURE,
            payload: error
        });
    }
};


export const updateStream = (id, formValues) => async dispatch => {
    //console.log('update stream values : ', formValues)
    const response = await streams.patch(`/streams/${id}`, formValues);
    dispatch({
        type: STREAM_UPDATED,
        payload: response.data
    });

    history.push('/');
};

export const deleteStream = (id) => async dispatch => {
    await streams.delete(`/streams/${id}`);
    //just return the id of deleted so it will be possible to remove the document inside reducer
    dispatch({
        type: STREAM_DELETED,
        payload: id
    });

    history.push('/')
};

export const fetchStream = (id) => async dispatch => {
    const response = await streams.get(`/streams/${id}`);

    dispatch({
        type: STREAM_FETCHED,
        payload: response.data
    });
};

export const fetchStreams = () => async dispatch => {
    const response = await streams.get('/streams');

    dispatch({
        type: STREAMS_FETCHED,
        payload: response.data
    });
};