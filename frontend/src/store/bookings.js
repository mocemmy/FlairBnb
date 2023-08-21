import { csrfFetch } from "./csrf"

const GET_SPOT_BOOKINGS = "bookings/GET_SPOT_BOOKINGS"

const actionGetSpotBookings = (bookings) => ({
    type: GET_SPOT_BOOKINGS,
    bookings
})

export const thunkGetSpotBookings = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/bookings`)

    if(response.ok){
        const data = await response.json()
        dispatch(actionGetSpotBookings(data.Bookings))
        return data
    } else {
        const errors = await response.json();
        return errors
    }
}



const initialState = {SpotBookings: null, UserBookings: null}

const bookingsReducer = (state = initialState, action ) => {
    let newState;
    switch (action.type) {
        case GET_SPOT_BOOKINGS:
            newState = {...state, SpotBookings: {}}
            newState.SpotBookings = action.bookings
            return newState;
        default:
            return state;
    }
}

export default bookingsReducer;