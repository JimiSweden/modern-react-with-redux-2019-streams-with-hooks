import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { fetchStream } from '../../actions'
import flv from 'flv.js';

const StreamShow = ({ stream, fetchStream, match }) => {

    const videoRef = useRef(null);
    const videoCSSstyle = {
        width: '100%'
    }
    //load stream data
    useEffect(() => {
        fetchStream(match.params.id)
    }, [fetchStream, match]);

    const [playerCreated, setPlayerCreated] = useState(null);

    //cleanup / destroy player when navigating away
    useEffect(() => {
        if (playerCreated) {

            //returning a function in a useEffect hook means ~"please run this when unmounting" 
            //- read more on https://reactjs.org/docs/hooks-reference.html
            return () => {
                playerCreated.destroy();
                setPlayerCreated(false)
            };
        }
    }, [playerCreated]);

    //add video
    useEffect(() => {
        /*
            configuration documentation for OBS 
            https://github.com/illuspas/Node-Media-Server#from-obs
            
            STREAM_NAME must be equal in OBS and the client (stream displayer)
             EX: rtmp://localhost/live/1 (for the id 1)
            Settings -> Stream
                Stream Type : Custom Streaming Server
                URL : rtmp://localhost/live
                Stream key : STREAM_NAME
        */


        /**
        https://github.com/illuspas/Node-Media-Server#via-flvjs-over-http-flv
        flvjs will provide (fetch) the video stream and hook it up to the video control
         */

        // console.log('videoRef.current ', videoRef.current)
        // console.log('match.params', match.params)
        // console.log('stream ', stream)
        // console.log('playerCreated is : ', playerCreated)

        //videoRef.current will be null on first render - when the stream is set, so is the ref and therefore safe to use.
        if (stream && !playerCreated) {

            const player = flv.createPlayer({
                type: 'flv',
                url: `http://localhost:8000/live/${stream.id}.flv`
            });

            setPlayerCreated(player);

            //timeout after, or promise wrapping flv.createPlayer is needed, 
            // else the attachMediaElement is running to quick and video is not displayed
            // tried another solution , to put this in another useEffect
            // - but it doesn't work either.. it is a timing issue
            setTimeout(() => {
                // console.log('player created. .. ', player)
                // console.log('videoRef.current ', videoRef)

                player.attachMediaElement(videoRef.current);
                player.load();
                //optionally auto play is available, but most modern browser will prevent this.
            }, 500);

        }

        /*        
           listen for 'stream' to be updated and then render again, 
           needed as videoRef.current is null on first render
        */
    }, [stream]);


    const Stream = () => {
        if (!stream) {
            return (
                <div>Loading...</div>
            );
        }

        return (
            <div className="ui item">
                <video
                    ref={videoRef}
                    controls
                    style={videoCSSstyle}
                />
                <h1 className="header">{stream.title}</h1>
                <p className="content">{stream.description}</p>
                <div className="footer">author: {stream.userId}</div>
            </div>
        )
    }

    return (
        <Stream />
    )
};


const mapStateToProps = (state, ownProps) => {
    return {
        stream: state.streams[ownProps.match.params.id]
    }
}
export default connect(
    mapStateToProps,
    { fetchStream }
)(StreamShow);