import api from '../utils/api';
import { WAITING, SET_EMAIL } from './types';

export const loadEmails = (formData) => async (dispatch) => {
    try {
        dispatch({type: WAITING, payload: true});
        const res = await api.post('/email', formData);
        dispatch({type: SET_EMAIL, payload: res.data});
        dispatch({type: WAITING, payload: false});
        return res.data;
    } catch (err) {
      
    }
};

export const loadEmailsFromDB = (formData) => async (dispatch) => {
    try {
        dispatch({type: WAITING, payload: true});
        const res = await api.post('/email/load', formData);
        // console.log(formData);
        // console.log(res.data);
        dispatch({type: SET_EMAIL, payload: res.data});
        dispatch({type: WAITING, payload: false});
        // return res.data;
    } catch (err) {
      
    }
};

