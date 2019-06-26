import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { signedIn, signedOut, updateUser } from '../actions';

/**
 * Create a new project at console.developers.google.com or use an existing one if you have
 * set your client id at property clientId (found at the beginning of this component ~row 37)
 * Oauth console.developers.google.com / streamy-react-redux-udemy-19
 * client id: [your client id]
 * client secret (only needed for flows)
 * 
 
 * gapi.auth2.getAuthInstance(). >> 
 * 
 * currentUser.get().
    getAuthResponse: ƒ (a)
    getBasicProfile: ƒ ()
    getGrantedScopes: ƒ ()
    getHostedDomain: ƒ ()
    getId: ƒ ()
    grant: ƒ (a)
    grantOfflineAccess: ƒ (a)
    hasGrantedScopes: ƒ (a)
    isSignedIn: ƒ ()
 * 
 * currentUser.get().getBasicProfile(). >
     getEmail: ƒ ()
     getFamilyName: ƒ ()
     getGivenName: ƒ ()
     getId: ƒ ()
     getImageUrl: ƒ ()
     getName: ƒ ()
 */

const GoogleAuth = ({ signedIn, signedOut, updateUser, isSignedIn, user }) => {

    const clientId = 'YOUR-CLIENT-ID-HERE.apps.googleusercontent.com'; //UPDATE ME PLEASE :)


    const [authApi, setAuthApi] = useState(null);

    useEffect(() => {
        if (isSignedIn === null) {
            return;
        }

        //set the username if logged in
        if (isSignedIn) {
            const profile = authApi.currentUser.get().getBasicProfile();
            const userInfo = {
                name: profile.getName(),
                email: profile.getEmail(),
                id: profile.getId()
            };
            /**  NOTE: as the auth api calls are in this component
             *  and the authApi might not be set when this runs
             *  we need to set/update the user info separate.
             *  the alternative to set everything inside the onAuthChange gets messy/cluttered
             * TODO: improve this, probably extracting the api calls to a custom hook 
             *  or use in the reducer
             * 
             * */
            // console.log('updating user : ', userInfo.name)
            updateUser(userInfo)

            //no need to call this if isSignedIn is null
        } else {
            updateUser(null)
        }

    }, [isSignedIn, authApi, updateUser])


    //listen for logged in status changes
    useEffect(() => {
        // TODO : read article on hooks, check on stackoverflow / udemy course if this is correct
        //if this function would be outside this useEffect it would make the useEffect dependencies change on every render
        function onAuthChange(signedInStatus) {
            // console.log('status changed - ', status)

            //update redux state using actions
            if (signedInStatus) {
                signedIn();
            } else {
                signedOut();
            }
        }



        //load authApi lib and initialize with our client id
        window.gapi.load('client:auth2', () => {
            window.gapi.client.init({
                clientId: clientId,
                scope: 'email'
            })
                .then(() => {
                    //set authApi.. const authApi = gapi.auth2.getAuthInstance()
                    window.gapi.auth2.getAuthInstance()
                        .then(authInstance => {
                            setAuthApi(authInstance);
                            //needs to be called one time with initial value
                            onAuthChange(authInstance.isSignedIn.get())
                            // console.log('authApi in then : ', authInstance)
                            authInstance.isSignedIn.listen(onAuthChange);
                        });
                });
        });

    }, [signedIn, signedOut])


    const onSignOutClick = () => {
        authApi.signOut();
    }
    const onSignInClick = () => {
        authApi.signIn();
    }

    // console.log('auth : ', authApi)
    // console.log('isSignedIn... : ', isSignedIn)
    // console.log('logged in user : ', user)

    const AuthButton = () => {
        if (isSignedIn === null) {
            //todo: spinner here.. loading/rotating user icon?
            return null;
        } else if (isSignedIn) {
            //todo: spinner if user == null ?
            return (
                <button
                    onClick={onSignOutClick}
                    className="ui red google button"
                >
                    <i className="google icon" />
                    Sign out {user ? user.name : ''}
                </button>
            )
        }
        return (
            <button
                onClick={onSignInClick}
                className="ui red google button"
            >
                <i className="google icon" />
                Sign in with Google
        </button>
        );
    }

    return (
        <div>
            {/* Google auth */}
            <AuthButton />
        </div>
    )
};

const mapStateToProps = (state) => {
    return {
        isSignedIn: state.auth.isSignedIn,
        user: state.auth.user,
    }
}

export default connect(
    mapStateToProps,
    //actions
    { signedIn, signedOut, updateUser })(GoogleAuth);