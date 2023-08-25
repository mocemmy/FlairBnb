import { datePast } from "../../UtilityComponents/utilityFunctions";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import OpenModalButton from "../../OpenModalButton";
import BookingForm from "../BookingForm";
import DeleteBooking from "../DeleteBooking";

function BookingDisplay({ booking }) {
  const isPastBooking = datePast(booking.startDate);

  return (
    <div className="booking-display-container" >
      <div className="image-container">

      <img className="spot-image" src={booking.Spot.previewImage} alt="spot image" />
      </div>
      <div className="booking-info-container">
      <Link className="spot-link image-container" to={`/spots/${booking.Spot.id}`}>
        {booking.Spot.name}
      </Link>
      <p>
        Dates Booked:<br></br> {booking.startDate} - {booking.endDate}
      </p>
      <Link to={`/bookings/${booking.id}/details`}>View booking details</Link>
      <div className="small-button-container booking">
      {!isPastBooking && (
        <OpenModalButton
          buttonText="Edit booking"
          modalComponent={<BookingForm type="UPDATE" oldBooking={booking} />}
        />
      )}
      {!isPastBooking && (
        <OpenModalButton
          buttonText="Delete booking"
          modalComponent={<DeleteBooking bookingId={booking.id} />}
        />
      )}
      </div>
      </div>
    </div>
  );
}

export default BookingDisplay;
