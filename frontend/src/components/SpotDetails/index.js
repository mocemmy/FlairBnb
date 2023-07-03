import {useParams} from 'react-router-dom';
import { useEffect } from 'react'
import './SpotDetails.css';
import { useSelector, useDispatch } from 'react-redux';
import { thunkGetSpotDetails } from '../../store/spots';

const SpotDetails = () => {
    const dispatch = useDispatch();
    const {spotId} = useParams();
    const spotDetails = useSelector(state => state.spots.singleSpot);

    useEffect(() => {
        dispatch(thunkGetSpotDetails(spotId))
    }, [dispatch])

    const onClick = () =>{
        window.alert("Feature coming soon");
    }

    if(!spotDetails.id) return null;
    return (
        <div className='spot-details'>
            <h1>{spotDetails.name}</h1>
            <div className='images-container'>
                <img src={spotDetails.SpotImages[0].url}/>
                <div className='image-grid'>
                    {spotDetails.SpotImages[1] && <img src={spotDetails.SpotImages[1].url} alt='image not found'/>}
                </div>
                <div className='image-grid'>
                    {spotDetails.SpotImages[2] && <img src={spotDetails.SpotImages[2].url} alt='image not found'/>}
                </div>
                <div className='image-grid'>
                    {spotDetails.SpotImages[3] && <img src={spotDetails.SpotImages[3].url} alt='image not found'/>}
                </div>
                <div className='image-grid'>
                    {spotDetails.SpotImages[4] && <img src={spotDetails.SpotImages[4].url} alt='image not found'/>}
                </div>
            </div>
            <div className='spot-info'>
                <p className='location'><span>{spotDetails.city}, {spotDetails.state}, {spotDetails.country}</span></p>
                <p className='owner-info'>Hosted by {spotDetails.Owner.firstName} {spotDetails.Owner.lastName}</p>
                <p className='description'>{spotDetails.description}</p>
            </div>
            <div className='reserve'>
                <p>${spotDetails.price} night</p>
                <button className="reserve" onClick={onClick}>Reserve</button>
            </div>
        </div>
    )
}

export default SpotDetails