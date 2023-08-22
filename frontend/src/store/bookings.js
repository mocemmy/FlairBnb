import { csrfFetch } from "./csrf"

const GET_SPOT_BOOKINGS = "bookings/GET_SPOT_BOOKINGS"
const GET_BOOKING_DETAILS = "bookings/GET_BOOKING_DETAILS"

const actionGetSpotBookings = (bookings) => ({
    type: GET_SPOT_BOOKINGS,
    bookings
})

const actionGetBookingDetails = (booking) => ({
    type: GET_BOOKING_DETAILS,
    booking
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

export const thunkCreateBooking = (spotId, data) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/bookings`, {
        method: "POST",
        body: JSON.stringify(data)
    })

    if(response.ok){
        const booking = await response.json()
        dispatch(actionGetBookingDetails(booking))
        return booking
    } else {
        const errors = await response.json()
        return errors
    }
}

export const thunkGetBookingDetails = (bookingId) => async (dispatch) => {
    const response = await csrfFetch(`/api/bookings/${bookingId}`)

    if(response.ok){
        const booking = await response.json()
        dispatch(actionGetBookingDetails(booking))
        return booking
    } else {
        const errors = response.json()
        return errors
    }
}



const initialState = {SpotBookings: null, UserBookings: null, SingleBooking: null}

const bookingsReducer = (state = initialState, action ) => {
    let newState;
    switch (action.type) {
        case GET_SPOT_BOOKINGS:
            newState = {...state, SpotBookings: action.bookings}
            return newState;
        case GET_BOOKING_DETAILS:
            newState = {...state, SingleBooking: action.booking}
            return newState;
        default:
            return state;
    }
}

export default bookingsReducer;