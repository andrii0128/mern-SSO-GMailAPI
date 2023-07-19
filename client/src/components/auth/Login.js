import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login, googleLogin } from '../../actions/auth';

import {GoogleLogin} from 'react-google-login';
import {gapi} from 'gapi-script';

const Login = ({ login, googleLogin, isAuthenticated }) => {

  const responseGoogleSuccess = async (response) => {
    try {
      const email = response.profileObj.email;
      googleLogin({email});
  
    } catch (error) {
      console.log(error);
    }
  }
  
  const responseGoogleError = (response) => {
    console.log(response)
  }
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const client_id = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  gapi.load("client:auth2", () => {
    gapi.client.init({
      clientId: client_id,
      plugin_name: "chat",
    });
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <section className="container">
      <h1 className="large text-success">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user" /> Sign Into Your Account
      </p>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <br />
      <GoogleLogin
        clientId={client_id}
        buttonText="Continue with google"
        onSuccess={responseGoogleSuccess}
        onFailure={responseGoogleError}
        cookiePolicy={'single_host_origin'}
      />
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </section>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  googleLogin: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login, googleLogin })(Login);
