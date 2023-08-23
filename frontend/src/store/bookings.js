import { csrfFetch } from "./csrf"

const GET_SPOT_BOOKINGS = "bookings/GET_SPOT_BOOKINGS"
const GET_BOOKING_DETAILS = "bookings/GET_BOOKING_DETAILS"
const GET_USER_BOOKINGS = "bookings/GET_USER_BOOKINGS"


const actionGetSpotBookings = (bookings) => ({
    type: GET_SPOT_BOOKINGS,
    bookings
})

const actionGetBookingDetails = (booking) => ({
    type: GET_BOOKING_DETAILS,
    booking
})

const actionGetUserBookings = (bookings) => ({
    type: GET_USER_BOOKINGS,
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

export const thunkGetBookingsCurr = () => async (dispatch) => {
    const response = await csrfFetch(`/api/bookings/current`)

    if(response.ok){
        const data = await response.json()
        dispatch(actionGetUserBookings(data.Bookings))
        return data
    } else {
        const errors = await response.json()
        return errors
    }
}

export const thunkUpdateBooking = (bookingId, data) => async (dispatch) => {
    const response = await csrfFetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        body: JSON.stringify(data)        
    })

    if(response.ok){
        const data = await response.json()
        dispatch(actionGetBookingDetails(data))
        return data
    } else {
        const errors = await response.json()
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
        case GET_USER_BOOKINGS:
            newState = {...state, UserBookings: {}}
            action.bookings.map(booking => newState.UserBookings[booking.id] = booking)
            return newState;
        default:
            return state;
    }
}

export default bookingsReducer;