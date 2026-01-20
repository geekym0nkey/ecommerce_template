import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ShippingScreen() {
    const navigate = useNavigate();

    // 1. Initialize State
    // Attempt to retrieve saved shipping address from localStorage first
    const initialAddress = localStorage.getItem('shippingAddress')
        ? JSON.parse(localStorage.getItem('shippingAddress'))
        : {};

    // If data exists in localStorage, use it; otherwise, default to empty string
    const [address, setAddress] = useState(initialAddress.address || '');
    const [city, setCity] = useState(initialAddress.city || '');
    const [postalCode, setPostalCode] = useState(initialAddress.postalCode || '');
    const [country, setCountry] = useState(initialAddress.country || '');

    // 2. Handle Form Submission
    const submitHandler = (e) => {
        e.preventDefault();

        // Package the form data into an object
        const formData = {
            address,
            city,
            postalCode,
            country
        };

        // Save to LocalStorage (Critical Step!)
        // This ensures data persists even if the user refreshes the page
        localStorage.setItem('shippingAddress', JSON.stringify(formData));
        console.log('Shipping Address Saved:', formData);

        // Redirect to the next step
        // (Usually the Payment method page or Place Order page)
        // For now, we redirect to a placeholder path or your PlaceOrder page
        navigate('/placeorder');
    };

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
            <h1>Shipping Information</h1>
            <form onSubmit={submitHandler}>

                {/* Address Field */}
                <div style={{ marginBottom: '15px' }}>
                    <label>Address</label>
                    <input
                        type="text"
                        required
                        style={{ width: '100%', padding: '10px' }}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>

                {/* City Field */}
                <div style={{ marginBottom: '15px' }}>
                    <label>City</label>
                    <input
                        type="text"
                        required
                        style={{ width: '100%', padding: '10px' }}
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </div>

                {/* Postal Code Field */}
                <div style={{ marginBottom: '15px' }}>
                    <label>Postal Code</label>
                    <input
                        type="text"
                        required
                        style={{ width: '100%', padding: '10px' }}
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                    />
                </div>

                {/* Country Field */}
                <div style={{ marginBottom: '15px' }}>
                    <label>Country</label>
                    <input
                        type="text"
                        required
                        style={{ width: '100%', padding: '10px' }}
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    style={{
                        backgroundColor: 'black',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    Continue
                </button>
            </form>
        </div>
    );
}

export default ShippingScreen;