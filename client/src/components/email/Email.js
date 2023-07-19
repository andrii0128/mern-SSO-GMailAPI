import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadEmails, loadEmailsFromDB } from '../../actions/email';
import { confirm } from "react-confirm-box";
import options from '../layout/Option';
import EmailItem from './EmailItem';

const Email = ({auth: { user }, emails, loadEmails, loadEmailsFromDB}) => {
  // useEffect(()=>{
  //   loadEmailsFromDB();
  // }, []);
  const loadFromGmail = async () => {
    const accessToken = user.tokens.accessToken;
    const refreshToken = user.tokens.refreshToken;
    const user_email = user.email;
    if(accessToken) {
      const result = await confirm("Do you want to load emails from GMail?", options);
      if(result){
        const emails = loadEmails({accessToken, refreshToken, user_email});
        return;
      }
    }
    else {
      alert("Sorry! You cann't load your emails. To do that, get access token first in Setting tab!");
    }
  }
  const loadFromDB = async () => {
    const email = user.email;
    const result = await confirm("Do you want to load emails from database?", options);
      if(result){
        loadEmailsFromDB({email});
        return;
      }
  }
  return (
    <section className="container">
      <h1 className="large text-success"><i className="fas fa-envelope" />{' '}Email</h1>
      <button type="button" className="btn btn-outline-secondary" onClick={loadFromGmail}>Load from Gmail</button>
      <button type="button" className="btn btn-outline-secondary" onClick={loadFromDB}>Load from DB</button>
      {emails.length} emails were found!
      {
        emails.map((value, index) => {
          return (
            <div>
              <EmailItem from={value.from} to={value.to} date={value.date} subject={value.subject} body={value.body} />
            </div>
          )
        })
      }
    </section>
  );
};

Email.propTypes = {
  auth: PropTypes.object.isRequired,
  emails: PropTypes.array.isRequired,
  loadEmails: PropTypes.func.isRequired,
  loadEmailsFromDB: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  emails: state.email.emails,
});

export default connect(mapStateToProps, { loadEmails, loadEmailsFromDB })(Email);
