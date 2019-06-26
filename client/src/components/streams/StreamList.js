import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { fetchStreams } from '../../actions';


const StreamList = ({ streams, currentUserId, isSignedIn, fetchStreams }) => {

    useEffect(() => {
        fetchStreams();
    }, [fetchStreams])

    const Streams = () => streams.map(stream => {
        return (
            <div key={stream.id} className="item">
                {/* note: buttons are right floated by semantic ui and hence need to be paced first.
                    would be better with flexdbox and grid.
                    TODO: grid and flexbox
                 */}
                <RenderAdmin stream={stream} />

                <i className="large middle aligned icon camera" />
                <div className="content">
                    <Link to={`/streams/${stream.id}`} className="header">
                        {stream.title}
                    </Link>

                    <div className="description">{stream.description}</div>
                </div>

            </div>
        )
    });

    const RenderAdmin = ({ stream }) => {
        if (!stream || currentUserId !== stream.userId) {
            return null;
        }

        const editLink = `/streams/edit/${stream.id}`
        const deleteLink = `/streams/delete/${stream.id}`


        return (
            <div className="right floated content">
                <Link to={editLink} className="ui button primary">
                    Edit
                </Link>
                <Link to={deleteLink} className="ui button negative">
                    Delete
                </Link>
            </div>
        );
    };

    const RenderCreateButton = () => {
        if (!isSignedIn) {
            return null;
        }
        return (
            /* TODO
             make it aperar on the right using flexbox 
             also implement this for admin buttons
             */
            <div className="">
                <Link
                    to="/streams/new"
                    className="ui button primary right floated"
                >
                    New Stream
                </Link>
            </div>
        );
    };


    return (
        <div>
            <RenderCreateButton />
            <h1>Streams</h1>
            <div className="ui celled list">
                <Streams />
            </div>
            {!streams &&
                <div>Loading streams</div>
            }
        </div>
    )
};


const mapStateToProps = (state) => {
    //pull the values (stream objects) from the container object (streams)
    return {
        streams: Object.values(state.streams),
        isSignedIn: state.auth.isSignedIn,
        currentUserId: state.auth && state.auth.user ? state.auth.user.id : null
    }
}

export default connect(
    mapStateToProps,
    { fetchStreams }
)(StreamList);