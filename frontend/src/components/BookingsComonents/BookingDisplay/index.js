import { datePast } from "../../UtilityComponents/utilityFunctions";
import { Link } from 'react-router-dom'


function BookingDisplay ({ booking }) {
    const isPastBooking = datePast(booking.startDate)
    
    return (
        <div className="booking-display-container">
            <img src={booking.Spot.previewImage} alt='spot image' />
            <Link to={`/spots/${booking.Spot.id}`} ><p>{booking.Spot.name}</p></Link>
            <p>{booking.startDate} - {booking.endDate}</p>
            <Link to={`/bookings/${booking.id}/details`}>View booking details</Link>
            {!isPastBooking && <button onClick={e => window.alert("Feature coming soon!")}>Edit booking</button>}
            {!isPastBooking && <button onClick={e => window.alert("Feature coming soon!")}>Delete booking</button>}
        </div>
    )
}

export default BookingDisplay;