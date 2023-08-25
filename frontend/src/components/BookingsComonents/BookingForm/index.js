import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { addDays, subDays } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import {
  thunkCreateBooking,
  thunkGetSpotBookings,
  thunkUpdateBooking,
} from "../../../store/bookings";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import Loading from "../../Loading";
import { thunkGetSpotDetails } from "../../../store/spots";
import { findCostOfStay } from "../../UtilityComponents/utilityFunctions";
import { useModal } from "../../../context/Modal";
import "./BookingForm.css";

function BookingForm({ oldBooking, type }) {
  const [startDate, setStartDate] = useState(
    oldBooking ? addDays(new Date(oldBooking.startDate), 1) : new Date()
  );
  const [endDate, setEndDate] = useState(
    oldBooking ? addDays(new Date(oldBooking.endDate), 1) : new Date()
  );
  const [price, setPrice] = useState();
  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const { closeModal } = useModal();
  const bookings = useSelector((state) => state.bookings.SpotBookings);
  const spot = useSelector((state) => state.spots.singleSpot);

  let title, buttonText;
  if (type === "CREATE") {
    title = "Create a booking";
    buttonText = "Book Spot";
  } else {
    title = "Update your booking";
    buttonText = "Save";
  }

  useEffect(() => {
    if (spotId) {
      dispatch(thunkGetSpotBookings(spotId));
      dispatch(thunkGetSpotDetails(spotId));
    } else if (oldBooking?.Spot.id) {
      dispatch(thunkGetSpotBookings(oldBooking.Spot.id));
      dispatch(thunkGetSpotDetails(oldBooking.Spot.id));
    }
  }, [dispatch, spotId]);

  useEffect(() => {
    const validationErrors = {};
    if (!startDate || !endDate)
      validationErrors.dates = "Start and end dates are required";
    if (endDate - startDate < 0)
      validationErrors.dates = "End date cannot be before start date";
    if (endDate - startDate === 0)
      validationErrors.dates = "Start and end dates cannot be the same day";

    if (!Object.keys(validationErrors).length) {
      const totalPrice = findCostOfStay(spot.price, startDate, endDate);
      setPrice(totalPrice);
    }

    setErrors(validationErrors);
  }, [startDate, endDate]);

  if (!bookings || !spot) return <Loading />;

  const alreadyBookedDates = [];
  for (const booking of bookings) {
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    const data = {
      start: subDays(start, 0),
      end: addDays(end, 1),
    };
    if (oldBooking?.id !== booking.id) {
      alreadyBookedDates.push(data);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);
    const data = {
      startDate,
      endDate,
    };
    if (!Object.keys(errors).length) {
      let response, serverErrors;
      if (type === "CREATE") {
        response = await dispatch(thunkCreateBooking(spotId, data));
        if (!response.booking.id) {
          serverErrors = { serverErrors: response };
          setErrors(serverErrors);
        }
      } else {
        response = await dispatch(thunkUpdateBooking(oldBooking.id, data));
      }

      if (response.booking?.id) {
        history.push(`/bookings/${response.booking.id}/details`);
      } else if (oldBooking) {
        history.push(`/bookings/${oldBooking.id}/details`);
      }

      closeModal();
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    if(type ==="CREATE"){
      history.push(`/spots/${spotId}`);
    } else {
      closeModal();
    }
  };
  return (
    <div className="booking-form-container">
      <form className="booking-form">
        <h1>{title}</h1>
        <p>Price per night: <span id="price">${spot.price}</span></p>
        {hasSubmitted && errors.dates && (
          <p className="errors">{errors.dates}</p>
        )}
        {hasSubmitted && errors.serverErrors && (
          <p className="errors">{errors.serverErrors}</p>
        )}
        <label htmlFor="start-date">Start Date</label>
        <DatePicker
          allowSameDate={false}
          name="start-date"
          selected={startDate}
          excludeDateIntervals={alreadyBookedDates}
          onChange={(date) => setStartDate(date)}
          minDate={new Date()}
          maxDate={addDays(new Date(), 365)}
        />
        <label htmlFor="end-date">End Date</label>
        <DatePicker
          allowSameDate={false}
          name="end-date"
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          minDate={startDate ? addDays(startDate, 1) : new Date()}
          maxDate={addDays(new Date(), 365)}
        />
        {!!price && <p>Cost of stay: <span id='price'>${price}</span></p>}
        <div className="small-button-container">
          <button className="cancel-button" onClick={handleCancel}>Cancel</button>
          <button type="submit" onClick={handleSubmit}>
            {buttonText}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookingForm;
