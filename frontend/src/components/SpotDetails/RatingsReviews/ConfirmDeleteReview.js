import { useModal } from "../../../context/Modal";
import { useDispatch } from "react-redux";
import { thunkDeleteReview } from "../../../store/reviews";

const ConfirmDeleteReview = ({ spotId, reviewId }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = (e) => {
    e.preventDefault();
    dispatch(thunkDeleteReview(spotId, reviewId));
    closeModal();
  };

  return (
    <div className="delete-menu-container">
      <h1>Confirm Delete</h1>
      <p className="confirm-delete-message">
        Are you sure you want to delete this review?
      </p>
      <div className="buttons-container">
        <button className="delete-button" onClick={handleDelete}>Yes (Delete Review)</button>
        <button className="delete-button" onClick={closeModal}>No (Keep Review)</button>
      </div>
    </div>
  );
};

export default ConfirmDeleteReview;
