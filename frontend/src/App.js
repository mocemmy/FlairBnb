import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import SpotDetails from "./components/SpotDetails";
import ManageSpots from "./components/ManageSpots";
import CreateSpot from "./components/CreateSpot";
import UpdateSpot from "./components/UpdateSpot";
import BookingForm from "./components/BookingsComonents/BookingForm";
import BookingDetails from "./components/BookingsComonents/BookingDetails";
import ManageBookings from "./components/BookingsComonents/ManageBookings";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route path="/spots/current">
            <ManageSpots />
          </Route>
          <Route path="/bookings/current">
            <ManageBookings />
          </Route>
          <Route path="/reviews/current">
            <h1>Manage Reviews</h1>
          </Route>
          <Route path="/spots/new">
            <CreateSpot />
          </Route>
          <Route path="/spots/:spotId/edit">
            <UpdateSpot />
          </Route>
          <Route path="/spots/:spotId/reserve">
            <BookingForm type="CREATE" />
          </Route>
          <Route path="/spots/:spotId">
            <SpotDetails />
          </Route>
          <Route path="/bookings/:bookingId/details">
            <BookingDetails />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
