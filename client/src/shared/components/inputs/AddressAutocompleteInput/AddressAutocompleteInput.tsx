import React, { useEffect, useRef, ForwardedRef, useImperativeHandle } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { TextField } from '../textfield/TextField';

interface AddressAutocompleteInputProps {
	apiKey: string | undefined;
	className?: string;
}

function AddressAutocompleteInputWithRef(
	{ apiKey = '', ...rest }: AddressAutocompleteInputProps & React.InputHTMLAttributes<HTMLInputElement>,
	ref?: ForwardedRef<HTMLInputElement>
) {
	const autoCompleteRef = useRef<HTMLInputElement>(null);

	const initializeService = () => {
		if (!window.google) throw new Error('[react-google-places-autocomplete]: Google script not loaded');
		if (!window.google.maps) throw new Error('[react-google-places-autocomplete]: Google maps script not loaded');
		if (!window.google.maps.places) throw new Error('[react-google-places-autocomplete]: Google maps places script not loaded');
		new window.google.maps.places.Autocomplete(autoCompleteRef.current as HTMLInputElement);
	};

	useImperativeHandle(ref, () => autoCompleteRef.current as HTMLInputElement);

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

	return <TextField ref={autoCompleteRef} {...rest} placeholder="Address" />;
}

export const AddressAutocompleteInput = React.forwardRef(AddressAutocompleteInputWithRef);
