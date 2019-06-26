import _ from 'lodash';
import {
    STREAM_DELETED,
    STREAM_UPDATED,
    STREAM_CREATED,
    STREAM_FETCHED,
    STREAMS_FETCHED,
} from '../actions/types';


export default (state = {}, action) => {
    switch (action.type) {
        case STREAM_FETCHED:
        case STREAM_UPDATED:
        case STREAM_CREATED:
            return { ...state, [action.payload.id]: action.payload };

        case STREAMS_FETCHED:
            /*
            an array is returned from the api so we need to 
            map it to an object with each stream id as key, and stream as value

            lodash mapKeys(array, 'itemKeyToPickValueFrom') returns an object "replacing" the array
            {
                1: {object with id: 1}
            } 
            */
            //return state merged with the fetched 
            return { ...state, ..._.mapKeys(action.payload, 'id') };

        case STREAM_DELETED:
            /*
            lodash omit "removes the property from an object" 
            i.e. returns a new object excluding the propery selected
            _.omit(object, propertyToExclude)
             */
            // console.log('reducer deleted stream: ', action.payload);
            return _.omit(state, action.payload);

        default:
            return state;
    }
};