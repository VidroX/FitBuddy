import React, { useState, useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { TextField } from '../textfield/TextField';

interface AddressAutocompleteInputProps {
	apiKey: string | undefined;
	className?: string;
}

function AddressAutocompleteInput({
	apiKey = '',
}: // className = undefined,
AddressAutocompleteInputProps & React.InputHTMLAttributes<HTMLInputElement>) {
	const [query, setQuery] = useState<string | undefined>('');
	const autoCompleteRef = useRef<HTMLInputElement>(null);
	const [autoComplete, setPlacesService] = useState<google.maps.places.Autocomplete | undefined>(undefined);

	const initializeService = () => {
		if (!window.google) throw new Error('[react-google-places-autocomplete]: Google script not loaded');
		if (!window.google.maps) throw new Error('[react-google-places-autocomplete]: Google maps script not loaded');
		if (!window.google.maps.places) throw new Error('[react-google-places-autocomplete]: Google maps places script not loaded');

		setPlacesService(new window.google.maps.places.Autocomplete(autoCompleteRef.current as HTMLInputElement));
		autoComplete?.addListener('place_changed', () => handlePlaceSelect());
	};

	useEffect(() => {
		const init = async () => {
			try {
				if (!window.google || !window.google.maps || !window.google.maps.places) {
					await new Loader({ apiKey, ...{ libraries: ['places'] } }).load();
				}
				initializeService();
			} catch (error) {
				console.log(error);
			}
		};

		init();
	}, []);

	// const getStyles = () => {
	// 	className;
	// };

	async function handlePlaceSelect() {
		const addressObject = autoComplete?.getPlace();
		const query = addressObject?.formatted_address;
		setQuery(query);
	}

	return <TextField ref={autoCompleteRef} onChange={(event) => setQuery(event.target.value)} placeholder="Address" value={query} />;
}

export default AddressAutocompleteInput;
