// Function to round a number to two decimal places
// This is the standard practice for handling currency calculations in e-commerce
const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
};

// Main function to calculate all prices for the cart state
export const updateCart = (state) => {
    // 1. Calculate items price
    // item.price is already the current price of that item in the cart
    state.itemsPrice = addDecimals(
        state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );

    // 2. Calculate shipping price (If order total > 100, free shipping, else 10)
    // Here we use the calculated itemsPrice to determine shipping
    state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);

    // 3. Calculate tax price (15% tax)
    // Taxes are calculated on the item price
    state.taxPrice = addDecimals(Number((0.15 * state.itemsPrice).toFixed(2)));

    // 4. Calculate total price
    state.totalPrice = (
        Number(state.itemsPrice) +
        Number(state.shippingPrice) +
        Number(state.taxPrice)
    ).toFixed(2);

    // Save the updated cart state to localStorage (to persist state across page reloads)
    localStorage.setItem('cart', JSON.stringify(state));

    return state;
};
