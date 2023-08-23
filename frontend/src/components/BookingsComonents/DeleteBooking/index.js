import { useModal } from "../../../context/Modal";
import { useDispatch } from 'react-redux'
import { thunkDeleteBooking } from "../../../store/bookings";


const DeleteBooking = ({bookingId}) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = (e) => {
        e.preventDefault()
        dispatch(thunkDeleteBooking(bookingId))
        closeModal();
    }

    return (
        <div className="delete-menu-container">
        <h1>Confirm Delete</h1>
        <p className="confirm-delete-message">
          Are you sure you want to delete this booking?
        </p>
        <div className="buttons-container">
          <button className="delete-button" onClick={handleDelete}>Yes (Delete booking)</button>
          <button id="dont-delete" onClick={closeModal}>No (Keep booking)</button>
        </div>
      </div>
    )
}

export default DeleteBooking;