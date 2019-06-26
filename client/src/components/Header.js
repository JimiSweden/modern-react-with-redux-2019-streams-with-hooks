import React from 'react';
import { Link } from 'react-router-dom';

import GooglAuth from './GoogleAuth';

const Header = () => {
    return (
        <div className="ui secondary pointing menu">
            <Link to="/" className="item">
                Streamer
            </Link>
            <div className="right menu">
                <Link to="/" className="item">
                    All Streams
                </Link>
            </div>
            <GooglAuth />
        </div>
    );
};

export default Header;