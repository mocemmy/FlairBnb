import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import OpenModalButton from "../OpenModalButton";
import BookingForm from "../BookingsComonents/BookingForm";

const ReserveSpot = ({ owned, spotInfo, spotId }) => {
  const { price, revCount, avgStars, reviewLabel } = spotInfo;
  let decPrice = (+price).toFixed(2);
  return (
    <div className="reserve-card">
      <div className="price-reviews-container">
        <p>
          <span id="price">${decPrice}</span> night
        </p>
        <div id="stars">
          {revCount > 0 && (
            <h2>
              <i className="fa-solid fa-star"></i>&nbsp;
              {avgStars}&nbsp;&#183;&nbsp;{revCount}&nbsp;{reviewLabel}
            </h2>
          )}
          {revCount === 0 && (
            <h2>
              <i className="fa-solid fa-star"></i>&nbsp;{avgStars}
            </h2>
          )}
        </div>
      </div>
      {!owned &&
      <OpenModalButton
        className="reserve-button"
        buttonText="Reserve"
        modalComponent={<BookingForm spotId={spotId} type="CREATE" />}
      />}
      {owned && <button className="reserve-button"  disabled={true}>Reserve</button>}
    </div>
  );
};

export default ReserveSpot;
