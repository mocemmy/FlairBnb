import {useHistory} from 'react-router-dom';
import {useState} from 'react';
import './tooltip.css';
import StarRating from './StarRating';

function SpotsCreator ({spot}) {
    const history = useHistory();
    const [showTip, setShowTip] = useState(false);
    const displayTip = () => {
        setShowTip(true)
    }
    const hideTip = () => {
        setShowTip(false);
    }
    const hidden = "tooltip-container " + showTip? "tool-tip" : "hidden";

    const onClick = (e) => {
        history.push(`/spots/${spot.id}`)
    }
    const price = spot.price.toFixed(2);
    return (
        <div key={spot.id} className='grid-item'
        onClick={e => onClick(e)}
        onMouseEnter={displayTip}
        onMouseLeave={hideTip}
        >
            <div 
            className="image-container"
            style={{
                backgroundImage: `url(${spot.previewImage})`,
                backgroundSize: 'cover'
            }}
            >
            {showTip && <p className={hidden}>{spot.name}</p>}
            </div>
            <ul className='spot-info-container'>
                <div className='city-star-container'>
            <li className='spot-location'>{spot.city}, {spot.state}</li>
            <StarRating spot={spot} />
                </div>
            <li><span className="price">${price}</span> night</li>
            </ul>
        </div>
    )
}
export default SpotsCreator;