import {useHistory} from 'react-router-dom';
import {useState} from 'react';
import './tooltip.css';

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
            <ul>
            <li>{spot.city}</li>
            <li>{spot.state}</li>
            </ul>
        </div>
    )
}
export default SpotsCreator;