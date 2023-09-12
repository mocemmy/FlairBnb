import { useHistory } from "react-router-dom";
import { useState } from "react";
import "./tooltip.css";
import StarRating from "./StarRating";
import ReviewInfoDisplay from "../SpotDetails/RatingsReviews/ReviewInfoDisplay";

function SpotsCreator({ spot }) {
  const history = useHistory();

  const onClick = (e) => {
    history.push(`/spots/${spot.id}`);
  };
  const price = parseInt(spot.price).toFixed(2);
  return (
    <div
      key={spot.id}
      className="grid-item"
      onClick={(e) => onClick(e)}
      title={spot.name}
    >
      <div
        className="image-container"
        style={{
          backgroundImage: `url(${spot.previewImage})`,
          backgroundSize: "cover",
        }}
      >
      </div>
      <ul className="spot-info">
        <div className="city-star-container">
          <li className="spot-location">
            {spot.city}, {spot.state}
          </li>
          <StarRating spot={spot} />
        </div>
        <li>
          <span className="price">${price}</span> night
        </li>
      </ul>
    </div>
  );
}
export default SpotsCreator;
