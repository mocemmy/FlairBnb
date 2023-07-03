import {useHistory} from 'react-router-dom';

function SpotsCreator ({spot}) {
    const history = useHistory();
    const onClick = (e) => {
        history.push(`/spots/${spot.id}`)
    }
    return (
        <div key={spot.id} className='grid-item'
        onClick={e => onClick(e)}
        >
            <div 
            className="image-container"
            style={{
                backgroundImage: `url(${spot.previewImage})`,
                backgroundSize: 'cover'
            }}
            >
            </div>
            <ul>
            <li>{spot.city}</li>
            <li>{spot.state}</li>
            </ul>
        </div>
    )
}
export default SpotsCreator;