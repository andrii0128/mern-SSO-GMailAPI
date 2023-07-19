import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAuthURL, getAccessToken } from '../../actions/setting';

const Setting = ({auth: { user }, getAuthURL, getAccessToken}) => {
    const email = user.email;
    useEffect(() => {
        console.log("useEffect : ++++++");
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("code")) {
          const authorizationCode = urlParams.get("code");
          getAccessToken({authorizationCode, email});
        }
    }, []);
    const onHandleClick = async () => {
        const url = await getAuthURL();
        console.log(url);
        window.location.href = url;
    }
    const accessToken = user.tokens.accessToken;
    const refreshToken = user.tokens.refreshToken;
    const enabled = (
        <div>
            <p className="font-weight-bold">
                access_token : {accessToken}
            </p>
            <p className="font-weight-bold">
                refresh_token : {refreshToken}
            </p>
        </div>
    );
    const disabled = (
        <div>
            <p className="lead">
                <i className="fas fa-exclamation-triangle" />Your access token for Gmail APIs is not saved yet. Please get and save it!
            </p>
            <button className="btn btn-success" onClick={onHandleClick}>
                Get Access Token
            </button>
        </div>
    );
    return (
    <div className="container">
        <h1 className="large text-success"><i className="fas fa-cog" />{' '}Setting</h1>
        <div className="jumbotron">
            {accessToken ? enabled : disabled}
        </div>
    </div>
    );
};

Setting.propTypes = {
  auth: PropTypes.object.isRequired,
  getAuthURL: PropTypes.func.isRequired,
  getAccessToken: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { getAuthURL, getAccessToken })(Setting);
