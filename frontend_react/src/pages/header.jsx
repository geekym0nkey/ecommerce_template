import React, { useState, useEffect } from 'react';
import { Link, useNavigate,useLocation } from 'react-router-dom';

function Header() {
    const [userInfo, setUserInfo] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();   // fetch current URL
    const hideOnPaths = ['/login', '/placeorder','/shipping']; // this is the list of webpages where the header should hides itself.
    // 1. initializing the user info
    useEffect(() => {
        const data = localStorage.getItem('userInfo');
        if (data) {
            setUserInfo(JSON.parse(data));
        }
    }, []);

    // 2. Logout Handler
    const logoutHandler = () => {
        // delete all sensitive data
        localStorage.removeItem('userInfo');
        localStorage.removeItem('cart'); // delete the cart after logout.. this is optional

        // refresh the state
        setUserInfo(null);
        setShowDropdown(false);

        // navigate to the login page
        navigate('/login');

        // refresh the webpage (we dont use redux at the moment)
        window.location.reload();
    };

    // a drop down menu
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    if (hideOnPaths.includes(location.pathname)) {
        return null;
    }
    return (
        <header style={{ background: '#333', color: '#fff', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Logo section */}
            <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
                首頁 MyShop
            </Link>

            {/* navigate section */}
            <nav style={{ position: 'relative' }}>
                <Link to="/cart" style={{ color: '#fff', textDecoration: 'none', marginRight: '20px' }}>
                    <i className="fas fa-shopping-cart"></i>
                      {'\u00A0\u00A0'}購物車 Cart
                </Link>

                {/* if there is userInfo shows name，no userInfo shows Login  */}
                {userInfo ? (
                    <div style={{ display: 'inline-block', position: 'relative' }}>

                        <button
                            onClick={toggleDropdown}
                            style={{
                                background: 'transparent',
                                color: '#fff',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '1rem'
                            }}
                        >
                            {userInfo.name || userInfo.username} <i className="fas fa-caret-down"></i>
                        </button>

                        {/* Dropdown Menu*/}
                        {showDropdown && (
                            <div style={{
                                position: 'absolute',
                                right: 0,
                                top: '30px',
                                backgroundColor: '#fff',
                                color: '#333',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                borderRadius: '4px',
                                minWidth: '120px',
                                zIndex: 100
                            }}>
                                <Link
                                    to="/profile"
                                    onClick={() => setShowDropdown(false)} // when you click the profile button the dropdown closes
                                    style={{ display: 'flex',alignItems: 'center', gap:'8px', padding: '10px', textDecoration: 'none', color: '#333', borderBottom: '1px solid #eee' ,minWidth: '160px'}}
                                >
                                   <span>個人檔案</span>
                                   <span style={{ fontSize: '1rem', color: '#666' }}>Profile</span>
                                </Link>
                                <button
                                    onClick={logoutHandler}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap:'8px',
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: '10px',
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#dc3545' // red-ink highlight the log out button
                                    }}
                                >
                                    <span>登出</span>
                                    <span style={{ fontSize: '1rem' }}>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    // if no "userInfo"(means you are no logged-in) shows 'Login' button
                    <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>
                        <i className="fas fa-user"></i> Login
                    </Link>
                )}

            </nav>
        </header>
    );
}

export default Header;