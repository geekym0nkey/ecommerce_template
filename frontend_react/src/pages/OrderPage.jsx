import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function OrderPage() {
    const { id } = useParams(); // fetch :id from the website
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const userInfoFromStorage = localStorage.getItem('userInfo');
                const token = userInfoFromStorage ? JSON.parse(userInfoFromStorage).access : null;
                console.log("目前的 Token 是:", token); // <--- check if token exist
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                };
                const { data } = await axios.get(`http://127.0.0.1:8000/api/orders/${id}/`, config);
                //the line below checks the integrity of data
                console.log("🔥 這是後端傳回來的完整訂單資料:", data);
                setOrder(data);
                console.log("訂單資料抓取成功！", data);
                //if the data is saved successfully, we should exit the "loading" page
                setLoading(false);
            } catch (error) {
                console.error("抓取訂單失敗", error);
                setLoading(false);    //we should still exit the loading page even if the order is not fetched successfully
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) return <div>載入中...</div>;
    if (error) return <div style={{color: 'red'}}>{error}</div>;
    if (!order) return <div>找不到訂單</div>;

    return (
        <div className="container mt-5">
            <h1>訂單編號：{order.id}</h1>
            <div className="card p-3">
                <h3>收件資訊</h3>
                <p>地址：{order.shipping_address?.address}, {order.shipping_address?.city}</p>
                <p>總金額：${order.total_price}</p>
                <hr />
                <h3>商品明細</h3>
                {order.order_items.map((item) => (
                    <div key={item.id}>
                        {item.name} x {item.qty} = ${item.price * item.qty}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default OrderPage;
