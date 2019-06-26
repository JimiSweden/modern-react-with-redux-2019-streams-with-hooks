import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Modal from '../Modal';
import history from '../../history';
import { deleteStream, fetchStream } from '../../actions';

const StreamDelete = ({ stream, match, deleteStream, fetchStream }) => {

    useEffect(() => {
        fetchStream(match.params.id)
    }, [fetchStream, match]);

    // console.log('match : ', match)
    // console.log('stream ', stream)

    const onDismiss = () => {
        history.push('/')
    }

    const renderDeleteActions = () => {
        return (
            <Fragment>
                <button onClick={() => deleteStream(match.params.id)} className="ui button negative">
                    Yes
                </button>
                <Link to="/" className="ui button">
                    No, Cancel
                </Link>
            </Fragment>
        )
    }

    const renderContent = () => {
        const title = stream ? stream.title : '';
        return (
            <div>
                <p>Stream title : {title}</p>
                <p>Are you sure you want to delete this stream?</p>

            </div>
        )
    }

    return (
        <Modal
            title="Delete Stream"
            content={renderContent()}
            onDismiss={onDismiss}
            actions={renderDeleteActions()}
        />
    )
};

const mapStateToProps = (state, ownProps) => {
    return { stream: state.streams[ownProps.match.params.id] }
}

export default connect(
    mapStateToProps,
    { deleteStream, fetchStream }
)(StreamDelete);