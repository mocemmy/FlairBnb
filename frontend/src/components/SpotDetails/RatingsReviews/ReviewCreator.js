import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import OpenModalButton from "../../OpenModalButton";
import ConfirmDeleteReview from "./ConfirmDeleteReview";
import PostReview from "./PostReview";

const getMonthName = (number) => {
  const date = new Date();
  date.setMonth(number - 1);
  return date.toLocaleString("en-Us", { month: "long" });
};

const ReviewCreator = ({ review }) => {
  const user = useSelector((state) => state.session.user);
  const { spotId } = useParams();
  let [year, month] = review.createdAt.split("-");
  month = getMonthName(month);
  if (!review) return null;
  return (
    <div className="review-content">
      <div className="review-heading">
        <h5>{review.User.firstName}</h5>
        <h6>
          {month}&nbsp;{year}
        </h6>
        <p>{review.review}</p>
      </div>
      <div className="small-button-container review-display">
        {user && review.User.id === user.id && (
          <OpenModalButton
          className="edit-delete-button"
            buttonText="edit"
            modalComponent={
              <PostReview oldReview={review} type="UPDATE" spotId={spotId} />
            }
          />
        )}
        {user && review.User.id === user.id && (
          <OpenModalButton
            className="edit-delete-button"
            buttonText="delete"
            modalComponent={
              <ConfirmDeleteReview reviewId={review.id} spotId={spotId} />
            }
          />
        )}
      </div>
    </div>
  );
};

export default ReviewCreator;
