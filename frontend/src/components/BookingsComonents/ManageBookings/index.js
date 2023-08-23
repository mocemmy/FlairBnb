import { useDispatch, useSelector } from "react-redux";
import Loading from "../../Loading";
import { useEffect } from "react";
import { thunkGetBookingsCurr } from "../../../store/bookings";
import BookingDisplay from "../BookingDisplay";

function ManageBookings () {
    const user = useSelector(state => state.session.user)
    const bookings = useSelector(state => state.bookings.UserBookings)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(thunkGetBookingsCurr())
    }, [dispatch])


    if(!user || !bookings) return <Loading />
    const bookingsArr = Object.values(bookings)
    console.log(bookingsArr)
    return (
        <>
        <h1>Your Bookings</h1>
        {bookingsArr.map(booking => (
            <BookingDisplay booking={booking} key={booking.id} />
        ))}
        </>
    )
}

export default ManageBookings;