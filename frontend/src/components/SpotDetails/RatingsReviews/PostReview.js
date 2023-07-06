import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import "./ReviewStars.css";
import { thunkCreateReview } from "../../../store/reviews";
import { useModal } from "../../../context/Modal";
import { thunkGetSpotDetails } from "../../../store/spots";

const PostReview = ({spotId}) => {
  const dispatch = useDispatch();
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(null);
  const [activeRating, setActiveRating] = useState(stars);
  const {closeModal} = useModal();

  const onSubmit = (e) => {
    e.preventDefault();
    const reviewBody = {
      review,
      stars,
    };
    dispatch(thunkCreateReview(reviewBody, spotId));
    // dispatch(thunkGetSpotDetails(spotId))
    closeModal();
  };

  const numStars = [1, 2, 3, 4, 5]; //allows 5 stars
  return (
    <div className="review-modal-container">
      <form className="review-form" onSubmit={(e) => onSubmit(e)}>
        <h1>How was your stay?</h1>
        <textarea
          placeholder="Leave your review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <div className="stars-container">
          {numStars.map((num) => (
            <div
              key={num}
              className={activeRating >= num ? "filled" : "empty"}
              onMouseEnter={() => setActiveRating(num)}
              onMouseLeave={() => setActiveRating(stars || 0)}
              onClick={() => setStars(num)}
            >
              <i className="fa-solid fa-star"></i>
            </div>
          ))}
        </div>
        <button
          type="submit"
          disabled={review.length > 10 && !!stars ? false : true}
        >
          Submit Your Review
        </button>
      </form>
    </div>
  );
};

export default PostReview;
