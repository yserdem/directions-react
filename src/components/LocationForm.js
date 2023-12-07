// LocationForm.js
import React, { useState } from 'react';

const LocationForm = ({ onLocationSubmit }) => {
    const [location, setLocation] = useState('');
    const [predictions, setPredictions] = useState([]);

    const handleInputChange = (e) => {
        setLocation(e.target.value);
        if (e.target.value) {
            // Use the AutocompleteService to get place predictions
            const autoCompleteService = new window.google.maps.places.AutocompleteService();
            autoCompleteService.getPlacePredictions({ input: e.target.value }, (predictions, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
                    setPredictions(predictions);
                } else {
                    setPredictions([]);
                }
            });
        } else {
            setPredictions([]);
        }
    };

    const handlePredictionClick = (prediction) => {
        setLocation(prediction.description);
        setPredictions([]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onLocationSubmit(location);
        setLocation('');
        setPredictions([]);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Enter Location:
                <input
                    type="text"
                    value={location}
                    onChange={handleInputChange}
                />
            </label>
            <ul>
                {predictions.map((prediction) => (
                    <li key={prediction.place_id} onClick={() => handlePredictionClick(prediction)}>
                        {prediction.description}
                    </li>
                ))}
            </ul>
            <button type="submit">Haritada işaretle</button>
        </form>
    );
};

export default LocationForm;
