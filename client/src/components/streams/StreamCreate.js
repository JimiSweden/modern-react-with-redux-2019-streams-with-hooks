import React from 'react';
import { connect } from 'react-redux';
import { createStream } from '../../actions';
import StreamForm from './StreamForm'


const StreamCreate = (props) => {

    //note: no need to do event.preventDefault when using redux-form
    const onSubmit = (formValues) => {
        // console.log('on submit handled: ', formValues)
        /*important: as we added the createStream inside onSubmit, 
        onSubmit had to be moved inside the component (i e to get props from redux)
        */
        props.createStream(formValues);
    }

    return (
        <div>
            <h3>Create a new stream</h3>
            <StreamForm onSubmit={onSubmit} />
        </div>
    )
};


export default connect(
    null,
    { createStream }
)(StreamCreate);

