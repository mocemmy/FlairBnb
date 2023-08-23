import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import "./ReviewStars.css";
import { thunkCreateReview, thunkUpdateReview } from "../../../store/reviews";
import { useModal } from "../../../context/Modal";
import { thunkGetSpotDetails } from "../../../store/spots";

const PostReview = ({ spotId, type, oldReview }) => {
  const dispatch = useDispatch();
  const [review, setReview] = useState(oldReview ? oldReview.review : "");
  const [stars, setStars] = useState(oldReview ? oldReview.stars : null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [activeRating, setActiveRating] = useState(
    oldReview ? oldReview.stars : null
  );
  const { closeModal } = useModal();
  const [errors, setErrors] = useState("");

  useEffect(() => {
    const validationErrors = {};
    if (!stars) validationErrors.stars = "Star rating is required";
    if (!review) validationErrors.review = "Review is required";
    if (review?.length < 10)
      validationErrors.review = "Review must be longer than 10 characters";

    setErrors(validationErrors);
  }, [stars, review]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);
    const reviewBody = {
      review,
      stars,
    };
    if (!Object.keys(errors).length) {
      if (type === "CREATE") {
        try {
          await dispatch(thunkCreateReview(reviewBody, spotId));
        } catch (e) {
          const serverErrors = { serverErrors: e };
          setErrors(serverErrors);
        }
      } else {
        try {
          console.log(spotId)
          await dispatch(thunkUpdateReview(reviewBody, spotId, oldReview.id))
        } catch (e) {
          const serverErrors = { serverErrors: e };
          setErrors(serverErrors);
        }
      }
      closeModal();
    }
  };

  const numStars = [1, 2, 3, 4, 5]; //allows 5 stars
  return (
    <div className="review-modal-container">
      <form className="review-form" onSubmit={(e) => onSubmit(e)}>
        <h1>How was your stay?</h1>
        {errors && <p className="errors">{errors.serverErrors}</p>}
        {hasSubmitted && errors.stars && (
          <p className="errors">{errors.stars}</p>
        )}
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
          &nbsp;Stars
        </div>
        {hasSubmitted && errors.review && (
          <p className="errors">{errors.review}</p>
        )}
        <textarea
          placeholder="Leave your review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <button type="submit">Submit Your Review</button>
      </form>
    </div>
  );
};

export default PostReview;
