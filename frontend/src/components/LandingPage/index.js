import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { thunkGetAllSpots } from '../../store/spots';
import SpotsCreator from './SpotsCreator';
import './LandingPage.css';

function LandingPage({ isLoaded }) {
    const dispatch = useDispatch();
    const spotsObj = useSelector(state => state.spots.allSpots);
    const spots = Object.values(spotsObj);
    console.log(spots);
    //load spots on mount:
    useEffect(() => {
        dispatch(thunkGetAllSpots());
    }, [dispatch])
    

    if(!spots) return null
    return (
        <div className='spots-container'>
            <div className='spots-list'>
                {spots.map(spotObj =><SpotsCreator spot={spotObj}/>)}
            </div>
        </div>
    )
}

export default LandingPage;