// frontend/src/store/session.js
import { csrfFetch } from './csrf';

const LOG_IN = 'sessions/LOG_IN';
const LOG_OUT = 'sessions/LOG_OUT';

const actionLogIn = (user) => ({
    type: LOG_IN,
    user
})

const actionLogOut = () => ({
    type: LOG_OUT
})

export const login = (user) => async (dispatch) => {
    const { credential, password } = user;
    const response = await csrfFetch('/api/session', {
        method: "POST",
        body: JSON.stringify({
            credential,
            password
        }),
    });

    const data = await response.json();
    dispatch(actionLogIn(data.user));
    return response;
}

export const restoreUser = () => async (dispatch) => {
    const response = await csrfFetch("/api/session");
    const data = await response.json();
    dispatch(actionLogIn(data.user));
    return response;
};

export const signup = (user) => async (dispatch) => {
    const { username, firstName, lastName, email, password } = user;
    const response = await csrfFetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        username,
        firstName,
        lastName,
        email,
        password,
      }),
    });
    const data = await response.json();
    dispatch(actionLogIn(data.user));
    return response;
};

export const logout = () => async (dispatch) => {
    const response = await csrfFetch('/api/session', {
      method: 'DELETE',
    });
    dispatch(actionLogOut());
    return response;
};

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
    let newState;
    switch(action.type){
        case LOG_IN:
            newState = { ...state };
            newState.user = action.user;
            return newState;
        case LOG_OUT:
            newState = { ...state };
            newState.user = null;
            return newState;
        default:
            return state;
    }
}

export default sessionReducer;