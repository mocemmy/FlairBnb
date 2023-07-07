import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { thunkGetAllSpots } from '../../store/spots';
import SpotsCreator from './SpotsCreator';
import './LandingPage.css';
import Loading from '../Loading';

function LandingPage() {
    const dispatch = useDispatch();
    const spots = Object.values(useSelector(state => state.spots.allSpots));
    //load spots on mount:
    useEffect(() => {
        dispatch(thunkGetAllSpots());
    }, [dispatch])
    
    if(!spots.length) return <Loading />
    return (
        <div className='spots-container'>
            <div className='spots-list'>
                {spots.map(spotObj =><SpotsCreator key={spotObj.id} spot={spotObj}/>)}
            </div>
        </div>
    )
}

export default LandingPage;