import api from '../utils/api';
import { setAlert } from './alert';
import { loadUser } from './auth';

export const getAuthURL = () => async (dispatch) => {
    try {
        const res = await api.get('/setting');
        return res.data;
    } catch (err) {
      
    }
};

export const getAccessToken = (formData) => async (dispatch) => {
    try {
        const res = await api.post('/setting', formData);
        dispatch(loadUser());
    } catch (err) {
      
    }
};

