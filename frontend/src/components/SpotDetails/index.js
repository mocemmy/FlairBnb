import { useParams } from "react-router-dom";
import { useEffect } from "react";
import "./SpotDetails.css";
import { useSelector, useDispatch } from "react-redux";
import { thunkGetSpotDetails } from "../../store/spots";
import Loading from "../Loading";
import SpotInfo from "./SpotInfo";
import SpotImages from "./SpotImages";
import './Images.css';
import RatingsReviews from "./RatingsReviews";

const SpotDetails = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const spotDetails = useSelector((state) => state.spots.singleSpot);

  useEffect(() => {
    dispatch(thunkGetSpotDetails(spotId));
  }, [dispatch]);

    let revCount = spotDetails.numReviews;
    let avgStars = spotDetails.avgStarRating;
    if(!spotDetails.numReviews) revCount = "new";
    if(!spotDetails.avgStarRating) avgStars = 0;

  const imageArr = spotDetails.SpotImages;

  if (!spotDetails.id) return <Loading />;
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
        <SpotImages imageArr={imageArr}/>
      </div>
      <div className="spot-info-container">
        <SpotInfo spot={spotDetails}/>
      </div>
    </div>
    <div className="reviews-container">
        <h2><i className="fa-solid fa-star"></i>{avgStars} {revCount} reviews</h2>
        <RatingsReviews />
    </div>
    </>
  );
};

export default SpotDetails;
