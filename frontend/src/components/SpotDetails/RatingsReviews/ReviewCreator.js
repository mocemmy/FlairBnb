const ReviewCreator = ({review}) => {
    console.log()
    return (
        <div className="review-content">
            <div className="review-heading">
                <h5>{review.User.firstName}</h5>
                <h6>{review.createdAt}</h6>
                <p>{review.review}</p>
            </div>
        </div>
    )
}

export default ReviewCreator;