import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom/cjs/react-router-dom.min"
import { thunkGetBookingDetails } from "../../../store/bookings";
import Loading from "../../Loading";
import { findCostOfStay, findNumDaysOfStay } from "../../UtilityComponents/utilityFunctions";

function BookingDetails () {
    const { bookingId } = useParams();
    const dispatch = useDispatch();
    const booking = useSelector(state => state.bookings.SingleBooking);
    
    useEffect(() => {
        if(bookingId){
            dispatch(thunkGetBookingDetails(bookingId))
        }
    }, [bookingId, dispatch])
    
    if(!booking || !booking.Spot) return <Loading />
    const numDays = findNumDaysOfStay(booking.startDate, booking.endDate)
    const price = findCostOfStay(booking.Spot.price, booking.startDate, booking.endDate)

    return (
        <>
            <h1>Booking details</h1>
            <Link to={`/spots/${booking.Spot.id}`}><p>Spot name: {booking.Spot.name}</p></Link>
            <p>Spot address: {booking.Spot.address} {booking.Spot.city} {booking.Spot.state}, {booking.Spot.country}</p>
            <p>Nights booked: {numDays}</p>
            <p>Price of stay: ${price}</p>
            <p>Dates booked: {booking.startDate} - {booking.endDate}</p>
        </>
    )
}

export default BookingDetails;