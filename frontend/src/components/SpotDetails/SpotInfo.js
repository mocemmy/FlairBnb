const SpotInfo = ({ spot }) => {
    const onClick = () => {
        window.alert("Feature coming soon");
      };
      const price = parseInt(spot.price).toFixed(2);

      let avgRating = parseInt(spot.avgStarRating).toFixed(2);

      if(!spot.avgStarRating) avgRating = "new";
  return (
    <>
      <div className="spot-info">
        <h2 className="owner-info">
          Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
        </h2>
        <p className="description">{spot.description}</p>
      </div>
      <div className="reserve">
        <div className="price-reviews-container">
          <p>
            <span id="price">${price}</span> night
          </p>
          <p id="stars">
            <i className="fa-solid fa-star"></i>{" "}
            {avgRating}
            <span id="num-revs">-{spot.numReviews}</span>
          </p>
        </div>
        <button className="reserve-button" onClick={onClick}>
          Reserve
        </button>
      </div>
    </>
  );
};


export default SpotInfo;