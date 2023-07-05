import { useSelector } from 'react-redux';
import OpenModalButton from '../../OpenModalButton';
import ConfirmDeleteReview from './ConfirmDeleteReview';

const ReviewCreator = ({review}) => {
    const user = useSelector(state => state.session.user);

    return (
        <div className="review-content">
            <div className="review-heading">
                <h5>{review.User.firstName}</h5>
                <h6>{review.createdAt}</h6>
                <p>{review.review}</p>
            </div>{ review.User.id === user.id &&
            <OpenModalButton
            buttonText="delete"
            modalComponent={<ConfirmDeleteReview reviewId={review.id}/>}
            />}

        </div>
    )
}

export default ReviewCreator;