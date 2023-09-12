import Loading from "../Loading";
import RatingsReviews from "./RatingsReviews";

const SpotInfo = ({ spot, user }) => {
  if (!spot) return <Loading />;
  return (
    <div className="all-spot-info-container">
      <div className="spot-info">
        <h2 className="owner-info">
          Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
        </h2>
        <p className="description">{spot.description}</p>
      </div>

      <RatingsReviews
        spotId={spot.id}
        owner={spot.ownerId}
        user={user}
        price={spot.price}
      />
    </div>
  );
};

export default SpotInfo;
