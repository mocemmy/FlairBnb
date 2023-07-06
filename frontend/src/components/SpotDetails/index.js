import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./SpotDetails.css";
import { useSelector, useDispatch } from "react-redux";
import { thunkGetSpotDetails } from "../../store/spots";
import Loading from "../Loading";
import SpotInfo from "./SpotInfo";
import SpotImages from "./SpotImages";
import './Images.css';
import RatingsReviews from "./RatingsReviews";
import OpenModalButton from "../OpenModalButton";
import PostReview from "./RatingsReviews/PostReview";
import { thunkGetRevsForUser } from "../../store/reviews";

const SpotDetails = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const spotDetails = useSelector((state) => state.spots.singleSpot);
  const user = useSelector(state => state.session.user)
  const userReviews = useSelector(state => state.reviews.user);

  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

// //   const
//   useEffect(() => {
//       dispatch(thunkGetRevsForUser(user.id))
//       console.log(userReviews)
//     }, [dispatch])
    
  useEffect(() => {
    dispatch(thunkGetSpotDetails(spotId));
  }, [dispatch]);

    let revCount = parseInt(spotDetails.numReviews).toFixed(0);
    let avgStars = parseInt(spotDetails.avgStarRating).toFixed(2);
    if(!spotDetails.numReviews) revCount = 0;
    if(!spotDetails.avgStarRating) avgStars = "new";

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
        {revCount === 0 && <p>No reviews yet</p>}
    {/* if user has already posted a review for spot, button shouldn't show up */}
       {user && <OpenModalButton
                buttonText="Post Your Review"
                modalComponent={<PostReview spotId={spotId}/>}
            />}
        <RatingsReviews />
    </div>
    </>
  );
};

export default SpotDetails;
