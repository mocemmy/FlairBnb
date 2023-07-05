const ReviewCreator = ({review}) => {
    console.log(review.firstName, review.lastName)
    return (
        <div className="review-content">
            <h1>Review content here</h1>
        </div>
    )
}

export default ReviewCreator;