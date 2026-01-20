import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { updateCart } from '../utils/cartUtils'; //import homemade updateCart function
import { useNavigate } from 'react-router-dom';  //it enable redirecting to another page
// --- NEW FUNCTION: Helper to get token from local storage ---
const getUserToken = () => {
    // retrieve userInfo from localStorage
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        // Analyze JSON and return access token
        return JSON.parse(userInfo).access;
    }
    return null;
};

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartState, setCartState] = useState(

        localStorage.getItem('cart') 
            ? JSON.parse(localStorage.getItem('cart'))
            // we set a default structure to prevent it from having empty values
            : { cartItems: [], itemsPrice: '0.00', shippingPrice: '0.00', taxPrice: '0.00', totalPrice: '0.00' }
    );
  const navigate = useNavigate();
  // Handle Checkout ---
  const handleCheckout = () => {
      // security check : check if the cart is empty
      if (cartState.cartItems.length === 0) {
          alert('Your cart is empty! (購物車是空的，不能結帳)');
          return; // just end the function and prevent user from entering
      }

      const token = getUserToken();
      if (!token) {
          alert('Please sign in to proceed to checkout.');
          navigate('/login');
          return;
      }
      navigate('/shipping');
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // This will be proxied to http://127.0.0.1:8000/api/products/
        const { data } = await axios.get('/api/products/'); 
        setProducts(data);
        setLoading(false);
      } catch (err) {
        // If the backend is not running, this will catch the error
        console.error("API Fetch Error:", err);
        setError("Failed to fetch products. Is the Django server running?");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

    // Logic to add an item to the cart
    const addToCartHandler = (product) => {
        console.log('--- Add to Cart Clicked ---'); //checked if clicked is completed
        // Check if the item already exists in the cart
        const existItem = cartState.cartItems.find((x) => x.product === product.id);

        let updatedItems;

        if (existItem) {
            // If the item exists, update the quantity (simplified to +1 here)
            updatedItems = cartState.cartItems.map((x) =>
                x.product === existItem.product ? { ...x, qty: x.qty + 1 } : x
            );

        } else {
            // If the item does not exist, add a new item to the cart
            const newItem = {
                product: product.id,
                name: product.name,
                image: product.image,
                price: parseFloat(product.price), // Ensure price is a number
                qty: 1, // Default quantity is 1
            };
            updatedItems = [...cartState.cartItems, newItem];
        }
        
        // Update state and recalculate all prices using cartUtils
        const newState =updateCart({ ...cartState, cartItems: updatedItems });
        setCartState({ ...newState });
        // Temporary: Force reload to show updated cart summary without proper state refresh
        //window.location.reload();
    };
    // ... 上面是 addToCartHandler ...

    // This is the function used to remove items from the cart
    const removeFromCartHandler = (id) => {
        // 1.use filter to filter out those unwanted goods
        // only keep those ID != (product.id)
        const updatedItems = cartState.cartItems.filter((x) => x.product !== id);

        // 2.  recalculate the total price(use updateCart)
        const newState = updateCart({ ...cartState, cartItems: updatedItems });

        // 3. refresh the screen
        setCartState({ ...newState });

        // 4. manually update the 'LocalStorage'，just to ensure the data deleted wont come back
        localStorage.setItem('cart', JSON.stringify(newState));
    };


  // --- Rendering Logic ---
  if (loading) return <div>Loading Products...</div>;
  if (error) return <div>Error: {error}</div>;
return (
    <div style={{ padding: '20px' }}>
      <h1>商品列表 (Products)</h1>

      {/* --- Shopping Cart Summary Section --- */}
      <div style={{
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          color: '#000000',
          border: '1px solid #ddd',
          borderRadius: '8px'
      }}>
          <h2>購物車摘要 (Cart Summary)</h2>

          {/* 👇👇👇 list all the added items 👇👇👇 */}
          {cartState.cartItems.length === 0 ? (
              <p>購物車是空的 (Cart is empty)</p>
          ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                  {cartState.cartItems.map((item) => (
                      <li key={item.product} style={{ borderBottom: '1px solid #eee', padding: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                          {/* product names and quantity */}
                          <span>
                              <strong>{item.name}</strong> <br/>
                              數量: {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                          </span>

                          {/* remove button : to remove the unwanted products */}
                          <button
                              onClick={() => removeFromCartHandler(item.product)}
                              style={{
                                  backgroundColor: '#dc3545', // 紅色
                                  color: 'white',
                                  border: 'none',
                                  padding: '5px 10px',
                                  borderRadius: '3px',
                                  cursor: 'pointer',
                                  marginLeft: '10px'
                              }}
                          >
                              Remove (移除)
                          </button>
                      </li>
                  ))}
              </ul>
          )}

          {/* Displays the current state of the cart */}
          <p><strong>項目總數:</strong> {cartState.cartItems.length} 種商品</p>
          <p><strong>總金額:</strong> ${cartState.totalPrice}</p>

          {/* CHECKOUT BUTTON: Linked to the handleCheckout function */}
          <button
              onClick={handleCheckout}
              disabled={cartState.cartItems.length === 0}  //disable this checkout button when the cart is empty
              style={{
                  //set a condition using ? : here to suggest the users not to click
                  backgroundColor: cartState.cartItems.length === 0 ? '#ccc' : '#28a745',
                  cursor: cartState.cartItems.length === 0 ? 'not-allowed' : 'pointer',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  marginTop: '10px',
                  fontWeight: 'bold'
              }}
          >
              Proceed to Checkout (前往結帳)
          </button>
      </div>

      {/* --- Products Grid Section --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {products.map((product) => (
          <div
            key={product._id || product.id} // Supporting both Django ID formats
            style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}
          >
            <img
                src={`${product.image}`}
                alt={product.name}
                style={{ width: '100%', height: 'auto', maxHeight: '200px', objectFit: 'cover' }}
            />
            <h3>{product.name}</h3>
            <p>價格: ${parseFloat(product.price).toFixed(2)}</p>
            <p>庫存: {product.countInStock || product.count_in_stock}</p>

            {/* ADD TO CART BUTTON: Linked to the addToCartHandler function */}
            <button
                 onClick={() => addToCartHandler(product)}
                 style={{
                             backgroundColor: '#007bff',
                             color: 'white',
                             padding: '10px',
                             border: 'none',
                             borderRadius: '5px',
                             cursor: 'pointer'
                 }}
                 >
                 Add to Cart (加入購物車)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
  } // This closes the function ProductListPage()

export default ProductListPage;
