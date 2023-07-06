import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import OpenModalButton from '../../OpenModalButton';
import ConfirmDeleteReview from './ConfirmDeleteReview';

const ReviewCreator = ({ review }) => {
    const user = useSelector(state => state.session.user);
    const {spotId} = useParams();
    return (
        <div className="review-content">
            <div className="review-heading">
                <h5>{review.User.firstName}</h5>
                <h6>{review.createdAt}</h6>
                <p>{review.review}</p>
            </div>{ review.User.id === user.id &&
            <OpenModalButton
            buttonText="delete"
            modalComponent={<ConfirmDeleteReview reviewId={review.id} spotId={spotId}/>}
            />}

        </div>
    )
}

export default ReviewCreator;