import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { addDays, subDays } from 'date-fns'
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetSpotBookings } from "../../../store/bookings";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import Loading from "../../Loading";

function BookingForm() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const bookings = useSelector(state => state.bookings.SpotBookings)
  

  useEffect(() => {
    dispatch(thunkGetSpotBookings(spotId))
  }, [dispatch, spotId])

  if(!bookings) return <Loading />

  const alreadyBookedDates = []
  for(const booking of bookings){
    const start = new Date(booking.startDate)
    const end = new Date(booking.endDate)
    const data = {
        start: subDays(start, 0),
        end: addDays(end, 1)
    }
    alreadyBookedDates.push(data)
  }

  return (
    <>
      <label htmlFor="start-date">Start Date</label>
      <DatePicker
        allowSameDate={false}
        name="start-date"
        selected={startDate}
        excludeDateIntervals={alreadyBookedDates}
        onChange={(date) => setStartDate(date)}
        minDate={new Date()}
      />
      <label htmlFor="end-date">End Date</label>
      <DatePicker
        allowSameDate={false}
        name="end-date"
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        minDate={startDate ? addDays(startDate, 1) : new Date()}
      />
    </>
  );
}

export default BookingForm;
