import { datePast } from "../../UtilityComponents/utilityFunctions";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import OpenModalButton from "../../OpenModalButton";
import BookingForm from "../BookingForm";
import DeleteBooking from "../DeleteBooking";

function BookingDisplay({ booking }) {
  const isPastBooking = datePast(booking.startDate);

  return (
    <div className="booking-display-container">
      <img src={booking.Spot.previewImage} alt="spot image" />
      <Link to={`/spots/${booking.Spot.id}`}>
        <p>{booking.Spot.name}</p>
      </Link>
      <p>
        {booking.startDate} - {booking.endDate}
      </p>
      <Link to={`/bookings/${booking.id}/details`}>View booking details</Link>
      {!isPastBooking && (
        <OpenModalButton
          buttonText="Edit booking"
          modalComponent={<BookingForm type="UPDATE" oldBooking={booking} />}
        />
      )}
      {!isPastBooking && (
        <OpenModalButton
          buttonText="Delete booking"
          modalComponent={<DeleteBooking bookingId={booking.id}/>}
        />
      )}
    </div>
  );
}

export default BookingDisplay;
