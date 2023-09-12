import ReviewCreator from "./ReviewCreator";
import "./RatingsReviews.css";
import OpenModalButton from "../../OpenModalButton";
import PostReview from "./PostReview";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { thunkGetRevsForSpot } from "../../../store/reviews";
import Loading from "../../Loading";
import ReserveSpot from "../ReserveSpot";

const RatingsReviews = ({ user, owner, spotId, price }) => {
  const userOwnsSpot = user.id === owner;
  const dispatch = useDispatch();
  const reviewsObj = useSelector((state) => state.reviews.spot);
  let alreadyReviewed = false;

  useEffect(() => {
    dispatch(thunkGetRevsForSpot(spotId));
  }, [dispatch]);

  if (!reviewsObj[spotId]) return <Loading />;
  const reviews = Object.values(reviewsObj[spotId]);
  if (reviews && user)
    reviews.forEach((rev) => {
      if (rev.User.id === user.id) alreadyReviewed = true;
    });
  const revCount = reviews.length;
  const numStars = reviews.reduce((acc, curr) => curr.stars + acc, 0);
  let avgStars = "new";
  if (revCount > 0) {
    avgStars = (numStars / revCount).toFixed(2);
  }
  let reviewLabel = "reviews";
  if (revCount == 1) reviewLabel = "review";
  const spotInfo = { price, revCount, avgStars, reviewLabel };
  return (
    <>
      <div className="reserve-container">
        <ReserveSpot owned={userOwnsSpot} spotInfo={spotInfo} spotId={spotId} />
      </div>
      <div className="reviews-container">
        {revCount > 0 && (
          <h2>
            <i className="fa-solid fa-star"></i>&nbsp;
            {avgStars}&nbsp;&#183;&nbsp;{revCount}&nbsp;{reviewLabel}
          </h2>
        )}
        {revCount === 0 && (
          <h2>
            <i className="fa-solid fa-star"></i>&nbsp;{avgStars}
          </h2>
        )}
        {revCount === 0 && user && !userOwnsSpot && (
          <p>Be the first to post a review!</p>
        )}
        {user && !alreadyReviewed && user.id !== owner && (
          <OpenModalButton
            buttonText="Post Your Review"
            modalComponent={<PostReview type="CREATE" spotId={spotId} />}
          />
        )}
        <div className="review-content-container">
          {reviews.reverse().map((rev) => (
            <ReviewCreator key={rev.id} review={rev} />
          ))}
        </div>
      </div>
    </>
  );
};

export default RatingsReviews;
