import React, { useState, useEffect } from 'react';
import { Map, GoogleApiWrapper, Marker, DirectionsRenderer } from 'google-maps-react';
import LocationForm from './LocationForm';

const MapContainer = ({ google }) => {
    const [markers, setMarkers] = useState([]);
    const [autoCompleteService, setAutoCompleteService] = useState(null);
    const [placesService, setPlacesService] = useState(null);
    const [directions, setDirections] = useState(null);

    useEffect(() => {
        setAutoCompleteService(new google.maps.places.AutocompleteService());
        setPlacesService(new google.maps.places.PlacesService(document.createElement('div')));
    }, [google]);

    const fetchDirections = (destination) => {
        const service = new google.maps.DirectionsService();
        let start = "38.23645240438255,34.73528383248124";

        service.route(
            {
                origin: start,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING
            },
            (result, status) => {
                if (status === "OK" && result) {
                    setDirections(result);
                }
            }
        );
    };


    const onLocationSubmit = (location) => {
        autoCompleteService.getPlacePredictions(
            { input: location },
            (predictions, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
                    const firstPrediction = predictions[0];

                    // Fetch details of the first prediction to get accurate coordinates
                    placesService.getDetails(
                        { placeId: firstPrediction.place_id },
                        (place, detailsStatus) => {
                            if (detailsStatus === google.maps.places.PlacesServiceStatus.OK && place) {
                                const newMarker = {
                                    lat: place.geometry.location.lat(),
                                    lng: place.geometry.location.lng(),
                                };

                                setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
                            } else {
                                console.error('Unable to fetch details for the location:', detailsStatus);
                            }
                        }
                    );
                } else {
                    console.error('Place prediction request failed:', status);
                }
            }
        );
    };

    const mapStyles = {
        width: '100%',
        height: '100%',
    };

    return (
        <div>
            <LocationForm onLocationSubmit={onLocationSubmit} />
            <Map
                google={google}
                zoom={14}
                style={mapStyles}
                initialCenter={{ lat: 38.23645240438255, lng: 34.73528383248124 }}
            >
                {directions && <DirectionsRenderer directions = {directions} />}
                {markers.map((marker, index) => (
                    <Marker
                        key={index}
                        position={marker}
                        onClick={() => fetchDirections(marker)}
                    />
                ))}
            </Map>
        </div>
    );
};

export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
})(MapContainer);
