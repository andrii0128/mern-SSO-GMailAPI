import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register, googleRegister} from '../../actions/auth';
import PropTypes from 'prop-types';

import {GoogleLogin} from 'react-google-login';
import {gapi} from 'gapi-script';

const Register = ({ setAlert, register, googleRegister, isAuthenticated }) => {
  const responseGoogleSuccess = async (response) => {
    try {
      const name = response.profileObj.name;
      const email = response.profileObj.email;
      googleRegister({name, email});
    } catch (error) {
      console.log(error); 
    }
  }
  
  const responseGoogleError = (response) => {
    console.log(response);
  }

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const client_id = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  gapi.load("client:auth2", () => {
    gapi.client.init({
      clientId: client_id,
      plugin_name: "chat",
    });
  });
  const { name, email, password, password2 } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
    } else {
      register({ name, email, password });
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <section className="container">
      <h1 className="large text-success">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user" /> Create Your Account
      </p>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onChange}
          />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            onChange={onChange}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
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
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </section>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  googleRegister: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { setAlert, register, googleRegister })(Register);
