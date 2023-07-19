import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Dashboard = ({auth: { user }}) => {
  return (
    <section className="container">
      <h1 className="large text-success"><i className="fas fa-file-signature" />{' '}Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user" /> Welcome {user && user.name}
      </p>
    </section>
  );
};

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { })(Dashboard);
