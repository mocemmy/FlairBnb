import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import spotsReducer, { thunkCreateSpot, thunkGetSpotDetails } from "../../store/spots";
import CreateUpdateSpotForm from '../CreateSpot/CreateUpdateSpotForm';
import Loading from '../Loading';

const UpdateSpot = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spots.singleSpot)

    useEffect(() => {
        dispatch(thunkGetSpotDetails(spotId));
    }, [dispatch])
    const defaultVals = {}
    const type = 'update';

    if(!spot.id) return <Loading />
    else {
        defaultVals.countryVal = spot.country;
        defaultVals.addressVal = spot.address;
        defaultVals.cityVal = spot.city;
        defaultVals.stateVal = spot.state;
        defaultVals.descriptionVal = spot.description;
        defaultVals.nameVal = spot.name;
        defaultVals.priceVal = spot.price;
        defaultVals.images = spot.SpotImages;
        // defaultVals.previewImageVal = 
    }
    return (
        <CreateUpdateSpotForm
            type={type}
            defaultValues={defaultVals}
        />
    )
}

export default UpdateSpot;