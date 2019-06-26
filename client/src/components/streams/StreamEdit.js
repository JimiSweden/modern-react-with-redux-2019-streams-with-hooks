import _ from 'lodash'
import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { fetchStream, updateStream } from '../../actions'
import StreamForm from './StreamForm';

const StreamEdit = ({ stream, fetchStream, updateStream, match }) => {

    /* 
    when using router history (url) to fetch stream 
    the component needs to be isolated  and not rely on other coponents loading data
    (i.e. needs to fetch its own data)
    */

    useEffect(() => {
        // console.log('fetching stream w id : ', match.params.id)
        fetchStream(match.params.id)

    }, [fetchStream, match]);
    // console.log('stream id : ', match.params.id)
    // console.log('stream : ', stream)


    const onSubmit = (formValues) => {
        updateStream(match.params.id, formValues)
    }

    const editStreamObject = _.pick(stream, 'title', 'description');
    return (
        <div>
            <h3>Edit stream</h3>

            <StreamForm
                onSubmit={onSubmit}
                // initialValues is a special reduxForms value . must match properties of Fields                
                //initialValues={stream} //working but..contains id etc
                initialValues={editStreamObject}
                enableReinitialize //required to listen to changes, stream is always andefined first render.
            />
        </div>
    )
};


const mapStateToProps = (state, ownProps) => {
    //get the stream id from url
    return {
        stream: state.streams[ownProps.match.params.id]
    }
}

export default connect(
    mapStateToProps,
    { fetchStream, updateStream }
)(StreamEdit);