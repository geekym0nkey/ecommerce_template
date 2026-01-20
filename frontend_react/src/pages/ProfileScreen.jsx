import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ProfileScreen() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const navigate = useNavigate();

    // Helper function to get token from localStorage
    const getUserToken = () => {
        const userInfo = localStorage.getItem('userInfo');
        return userInfo ? JSON.parse(userInfo).access : null;
    };

    useEffect(() => {
        const fetchMyOrders = async () => {
            const token = getUserToken();
            
            // Redirect to login if no token is found
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                };
                
                // API call to fetch user's orders
                // Note: Ensure the URL matches your backend configuration
                const { data } = await axios.get('/api/myorders/', config);
                
                setOrders(data);
                setLoading(false);

            } catch (error) {
                // Handle errors (e.g., token expired or server error)
                setError(
                    error.response && error.response.data.detail
                        ? error.response.data.detail
                        : error.message
                );
                setLoading(false);
            }
        };

        fetchMyOrders();
    }, [navigate]);

    return (
        <div style={{ padding: '20px' }}>
            <h1>My Orders</h1>
            
            {loading ? (
                <h2>Loading...</h2>
            ) : error ? (
                <div style={{ color: 'red' }}>{error}</div>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Date</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Total</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Paid</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id || order.id}>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{order._id || order.id}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                    {order.createdAt ? order.createdAt.substring(0, 10) : 'N/A'}
                                </td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>${order.totalPrice}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                    {order.isPaid ? (
                                        <span style={{ color: 'green' }}>Paid at {order.paidAt}</span>
                                    ) : (
                                        <span style={{ color: 'red' }}>Not Paid</span>
                                    )}
                                </td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                    {/* Button to navigate to order detail page */}
                                    <button 
                                        onClick={() => navigate(`/order/${order._id || order.id}`)}
                                        style={{ padding: '5px 10px', cursor: 'pointer' }}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ProfileScreen;
