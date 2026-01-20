import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function PlaceOrderScreen() {
    const navigate = useNavigate();

    // 1. Get Cart and Shipping info from LocalStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || { cartItems: [] };
    const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress'));
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    // Check if shipping address exists, if not redirect back
    useEffect(() => {
        if (!shippingAddress) {
            navigate('/shipping');
        }
    }, [shippingAddress, navigate]);

    // 2. Calculate Totals (if not already in cart object)
    // Simple calculation logic
    const itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);
    const shippingPrice = (itemsPrice > 100 ? 0 : 10).toFixed(2); // Example logic
    const totalPrice = (Number(itemsPrice) + Number(shippingPrice)).toFixed(2);

    // 3. Place Order Handler (The Real API Call)
    const placeOrderHandler = async () => {
        try {
            // Prepare the payload
            const orderData = {
                orderItems: cart.cartItems,
                shippingAddress: shippingAddress, // ✅ Use the REAL address from LocalStorage
                paymentMethod: 'PayPal',
                itemsPrice: itemsPrice,
                shippingPrice: shippingPrice,
                totalPrice: totalPrice,
            };

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.access}`, // Use token
                },
            };

            // Send to Backend
            const { data } = await axios.post(
                'http://127.0.0.1:8000/api/orders/add/',
                orderData,
                config
            );

            console.log('Order Created:', data);

            // Clear Cart after success
            // localStorage.removeItem('cart');
            localStorage.removeItem('cart');

            // Redirect to the Order Detail Page we made earlier
            navigate(`/order/${data.id}`);

        } catch (error) {
            console.error('Place Order Error:', error);
            alert('Order creation failed. Check console for details.');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Place Order</h1>

            {/* 1. Shipping Information Preview */}
            <div style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '20px' }}>
                <h2>Shipping To:</h2>
                <p>
                    <strong>Address: </strong>
                    {shippingAddress?.address}, {shippingAddress?.city}, {shippingAddress?.postalCode}, {shippingAddress?.country}
                </p>
            </div>

            {/* 2. Order Items Preview */}
            <div style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '20px' }}>
                <h2>Order Items:</h2>
                {cart.cartItems.length === 0 ? <p>Your cart is empty</p> : (
                    <ul>
                        {cart.cartItems.map((item, index) => (
                            <li key={index} style={{ marginBottom: '10px' }}>
                                <img src={item.image} alt={item.name} style={{ width: '50px', marginRight: '10px' }} />
                                {item.name} x {item.qty} = ${(item.price * item.qty).toFixed(2)}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* 3. Order Summary & Button */}
            <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
                <h2>Order Summary</h2>
                <p>Items: ${itemsPrice}</p>
                <p>Shipping: ${shippingPrice}</p>
                <h3>Total: ${totalPrice}</h3>

                <button
                    onClick={placeOrderHandler}
                    style={{
                        backgroundColor: 'black',
                        color: 'white',
                        padding: '15px',
                        width: '100%',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        marginTop: '10px'
                    }}
                >
                    Place Order (確認下單)
                </button>
            </div>
        </div>
    );
}

export default PlaceOrderScreen;