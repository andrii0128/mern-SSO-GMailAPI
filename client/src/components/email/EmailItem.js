import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {  } from '../../actions/email';
import { confirm } from "react-confirm-box";
import options from '../layout/Option';

const EmailItem = (props) => {
  return (
    <div className="container">
        <div className="jumbotron">
            <div className="font-weight-bold">from: {props.from}</div>      
            <div className="font-weight-bold">to: {props.to}</div>
            <div className="font-weight-bold">date: {props.date}</div>
            <div className="font-weight-bold">subject: {props.subject}</div>
            <div className="font-weight-bold">content:</div>
<pre>{props.body}</pre>
        </div>
    </div>
  );
};
export default EmailItem;
