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
                <div className="main-image" 
                style={{
                        backgroundImage: `url(${spotDetails.SpotImages[0].url})`,
                        backgroundSize: 'cover'
                    }}/>
                <div className='image-grid'>
                    {spotDetails.SpotImages[1] && <div 
                    style={{
                        backgroundImage: `url(${spotDetails.SpotImages[1].url})`,
                        backgroundSize: 'cover'
                    }}
                     className="secondary-image" />}
                    {spotDetails.SpotImages[2] && <div 
                    style={{
                        backgroundImage: `url(${spotDetails.SpotImages[2].url})`,
                        backgroundSize: 'cover'
                    }} className="secondary-image" />}
                    {spotDetails.SpotImages[3] && <div className="secondary-image" style={{
                        backgroundImage: `url(${spotDetails.SpotImages[3].url})`,
                        backgroundSize: 'cover'
                    }}/>}
                    {spotDetails.SpotImages[4] && <div 
                    style={{
                        backgroundImage: `url(${spotDetails.SpotImages[4].url})`,
                        backgroundSize: 'cover'
                    }} className="secondary-image" />}
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