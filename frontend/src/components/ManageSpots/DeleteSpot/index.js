import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import "./DeleteSpot.css";
import { thunkDeleteSpot } from "../../../store/spots";

const DeleteSpot = ({spotId}) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = (e) => {
    e.preventDefault();
    dispatch(thunkDeleteSpot(spotId))
    closeModal();
  };
  return (
    <div className="delete-menu-container">
      <h1>Confirm Delete</h1>
      <p className="confirm-delete-message">
        Are you sure you want to remove this spot from the listings?
      </p>
      <div className="buttons-container">
        <button className="delete-button" onClick={handleDelete}>Yes (Delete Spot)</button>
        <button className="delete-button" onClick={closeModal}>No (Keep Spot)</button>
      </div>
    </div>
  );
};

export default DeleteSpot;
