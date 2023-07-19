import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Category = ({auth: { user }}) => {
  return (
    <section className="container">
      <h1 className="large text-success"><i className="fas fa-code-branch" />{' '}Category</h1>
      
    </section>
  );
};

Category.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { })(Category);
