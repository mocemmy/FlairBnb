import {useHistory} from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from 'react';
import { thunkGetSpotsCurrUser } from '../../store/spots';
import SpotsCreator from '../LandingPage/SpotsCreator';
import './ManageSpots.css';
import DeleteSpot from './DeleteSpot';
import OpenModalButton from '../OpenModalButton';

const ManageSpots = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const onClick = () => {
        history.push('/spots/new')
    }

    const spots = Object.values(useSelector(state => state.spots.allSpots));

    useEffect(() => {
        dispatch(thunkGetSpotsCurrUser());
    }, [dispatch])

    if(!spots.length) return null;

    return (
        <>
            <div className="manage-spots-header">
            <h1>Manage Your Spots</h1>
                <button onClick={(e) => onClick(e)}>Create a New Spot</button>
            </div>
            <div className='spots-container'>
                {spots.map(spot => (
                    <div className='spot-management-container'>
                    <SpotsCreator key={spot.id} spot={spot} />
                    <div className='button-container'>
                       <li>
                        <OpenModalButton
                            buttonText="delete"
                            modalComponent={<DeleteSpot spotId={spot.id}/>}
                        />
                       </li>
                    </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default ManageSpots;