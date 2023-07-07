import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./SpotDetails.css";
import { useSelector, useDispatch } from "react-redux";
import { thunkGetSpotDetails } from "../../store/spots";
import Loading from "../Loading";
import SpotInfo from "./SpotInfo";
import SpotImages from "./SpotImages";
import "./Images.css";
import RatingsReviews from "./RatingsReviews";
import OpenModalButton from "../OpenModalButton";
import PostReview from "./RatingsReviews/PostReview";
import { thunkGetRevsForSpot, thunkGetRevsForUser } from "../../store/reviews";
import ReviewCreator from "./RatingsReviews/ReviewCreator";

const SpotDetails = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const spotDetails = useSelector((state) => state.spots.singleSpot);
  const user = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(thunkGetSpotDetails(spotId));
  }, [dispatch]);


  
  if (!spotDetails.id) return <Loading />;

  const imageArr = spotDetails.SpotImages;
  return (
    <>
      <div className="spot-details">
        <div className="spot-header-container">
          <h1>{spotDetails.name}</h1>
          <p className="location">
            <span>
              {spotDetails.city}, {spotDetails.state}, {spotDetails.country}
            </span>
          </p>
        </div>
        <div className="images-container">
          <SpotImages imageArr={imageArr} />
        </div>
        <div className="spot-info-container">
          <SpotInfo user={user} spot={spotDetails} />
        </div>
      </div>
      
    </>
  );
};

export default SpotDetails;
