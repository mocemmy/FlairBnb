import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { addDays, subDays } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import {
  thunkCreateBooking,
  thunkGetSpotBookings,
} from "../../../store/bookings";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import Loading from "../../Loading";
import { thunkGetSpotDetails } from "../../../store/spots";
import { findCostOfStay } from "../../UtilityComponents/utilityFunctions";

function BookingForm({ type }) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [price, setPrice] = useState();
  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const bookings = useSelector((state) => state.bookings.SpotBookings);
  const spot = useSelector((state) => state.spots.singleSpot);

  useEffect(() => {
    if (spotId) {
      dispatch(thunkGetSpotBookings(spotId));
      dispatch(thunkGetSpotDetails(spotId));
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
        const totalPrice = findCostOfStay(spot.price, startDate, endDate)
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
    alreadyBookedDates.push(data);
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
      }

      if (response.booking.id) {
        history.push(`/bookings/${response.booking.id}/details`);
      }
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    history.push(`/spots/${spotId}`)
  }
  return (
    <>
      <form>
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
        {price && <p>Cost of stay: ${price}</p>}
        <button type="submit" onClick={handleSubmit}>
          Book Spot
        </button>
        <button onClick={handleCancel}>Cancel</button>
      </form>
    </>
  );
}

export default BookingForm;
