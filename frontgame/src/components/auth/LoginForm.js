import React, { useState } from 'react';

const LoginForm = ({ onLoginSuccess }) => {
    const [cne, setCne] = useState('');
    const [dateNaissance, setDateNaissance] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simulation d'une connexion
        setTimeout(() => {
            if (cne && dateNaissance) {
                setLoading(false);
                if (onLoginSuccess) {
                    onLoginSuccess();
                }
            } else {
                setError('Veuillez remplir tous les champs');
                setLoading(false);
            }
        }, 1000);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #87CEEB 0%, #98FB98 100%)', // Sky to grass gradient
            fontFamily: '"Press Start 2P", cursive', // Using a retro font
            fontSize: '16px',
            position: 'relative',
            overflow: 'hidden', // Hide overflow from animations
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            {/* CSS for custom animations and retro look */}
            <style>
                {`
                /* Import a pixel-like font */
                @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

                body {
                    margin: 0;
                    overflow: hidden;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px) translateX(0px); }
                    50% { transform: translateY(-15px) translateX(10px); }
                }

                @keyframes cloudMove {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); } /* Move across the screen */
                }

                @keyframes cloudMoveReverse {
                    0% { transform: translateX(200%); }
                    100% { transform: translateX(-100%); }
                }

                @keyframes treeSway {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(-2deg); }
                    75% { transform: rotate(2deg); }
                }

                @keyframes leavesRustle {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.02); } /* Slight pulse effect */
                }

                /* Focus style for inputs */
                input:focus {
                    border-color: #4169E1 !important;
                    box-shadow: inset 2px 2px 4px rgba(0,0,0,0.3), 0px 0px 8px rgba(65,105,225,0.5) !important;
                }

                /* Button hover style */
                button:hover:not(:disabled) {
                    background: linear-gradient(180deg, #6495ED 0%, #4169E1 100%) !important;
                }
                `}
            </style>

            {/* Clouds */}
            <div style={{
                position: 'absolute',
                top: '20px',
                left: '-20%', // Start off-screen left
                width: '120px',
                height: '60px',
                background: 'linear-gradient(45deg, #E6E6FA 0%, #DDA0DD 100%)',
                borderRadius: '30px',
                boxShadow: 'inset -3px -3px 0px rgba(0,0,0,0.2)',
                animation: 'cloudMove 25s linear infinite, float 6s ease-in-out infinite',
                zIndex: 0
            }} />

            <div style={{
                position: 'absolute',
                top: '60px',
                right: '-25%', // Start off-screen right
                width: '150px',
                height: '75px',
                background: 'linear-gradient(45deg, #E6E6FA 0%, #DDA0DD 100%)',
                borderRadius: '37px',
                boxShadow: 'inset -3px -3px 0px rgba(0,0,0,0.2)',
                animation: 'cloudMoveReverse 30s linear infinite, float 8s ease-in-out infinite reverse',
                zIndex: 0
            }} />

            <div style={{
                position: 'absolute',
                top: '40px',
                left: '20%', // Starting position for a third cloud
                width: '100px',
                height: '50px',
                background: 'linear-gradient(45deg, #E6E6FA 0%, #DDA0DD 100%)',
                borderRadius: '25px',
                boxShadow: 'inset -3px -3px 0px rgba(0,0,0,0.2)',
                animation: 'cloudMove 20s linear infinite, float 7s ease-in-out infinite',
                animationDelay: '-5s', // Stagger start times
                zIndex: 0
            }} />

            {/* Tree */}
            <div style={{
                position: 'absolute',
                bottom: '50px', // Lift slightly above the absolute grass
                right: '10%',
                zIndex: 2,
                transformOrigin: 'bottom center', // For swaying animation
                animation: 'treeSway 5s ease-in-out infinite alternate', // Tree swaying
            }}>
                {/* Trunk */}
                <div style={{
                    width: '40px',
                    height: '120px',
                    background: '#8B4513',
                    marginLeft: '80px', // Adjust to center leaves
                    boxShadow: 'inset -4px 0px 0px rgba(0,0,0,0.3)',
                    border: '2px solid #654321',
                    borderRadius: '4px', // Slightly rounded trunk
                }} />
                {/* Leaves */}
                <div style={{
                    width: '200px',
                    height: '150px',
                    background: 'radial-gradient(circle, #228B22 30%, #32CD32 70%)',
                    borderRadius: '50%',
                    position: 'relative',
                    top: '-60px',
                    left: '-40px', // Adjust to center leaves over trunk
                    boxShadow: 'inset -8px -8px 0px rgba(0,0,0,0.2), 0px 4px 8px rgba(0,0,0,0.3)',
                    border: '3px solid #006400',
                    animation: 'leavesRustle 3s ease-in-out infinite', // Leaves rustling/pulsing
                }} />
            </div>

            {/* Grass */}
            <div style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0',
                height: '100px', // Make grass a bit taller
                background: 'repeating-linear-gradient(90deg, #228B22 0px, #228B22 10px, #32CD32 10px, #32CD32 20px)', // Wider pixel stripes
                borderTop: '6px solid #006400', // Thicker border
                boxShadow: 'inset 0px 5px 10px rgba(0,0,0,0.2)', // Shadow for depth
                zIndex: 1
            }} />

            {/* Main Content (form and title) */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                zIndex: 3, // Ensure form is above background elements
                position: 'relative',
                width: '100%', // Allow content to take full width for centering
                maxWidth: '600px', // Limit overall content width
            }}>
                {/* Title */}
                <h1 style={{
                    fontSize: '48px',
                    fontWeight: 'bold',
                    color: '#4B0082', // Dark purple
                    textShadow: '4px 4px 0px #8A2BE2, 2px 2px 0px rgba(0,0,0,0.5)', // Double shadow for retro effect
                    marginBottom: '40px',
                    fontFamily: '"Press Start 2P", cursive',
                    letterSpacing: '4px',
                    textAlign: 'center', // Center the title
                    marginTop: '50px' // Push title down from top
                }}>
                    SIGN IN
                </h1>

                {/* Login Terminal */}
                <div style={{
                    width: '90%', // Use percentage for responsiveness
                    maxWidth: '500px', // Max width for larger screens
                    background: '#000', // Black background
                    border: '8px solid #C0C0C0', // Gray border
                    borderRadius: '12px',
                    boxShadow: '0px 8px 16px rgba(0,0,0,0.5), inset 0px 0px 0px 4px #808080', // Outer and inner shadow
                    position: 'relative',
                    padding: '0', // Remove padding from container to let content handle it
                    boxSizing: 'border-box',
                }}>
                    {/* Terminal Header */}
                    <div style={{
                        background: '#C0C0C0',
                        height: '30px',
                        borderRadius: '4px 4px 0 0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        padding: '0 10px',
                        borderBottom: '2px solid #808080' // Separator line
                    }}>
                        {/* Book Icon / Terminal Button */}
                        <div style={{
                            width: '24px', // Slightly larger button
                            height: '18px',
                            background: '#4169E1', // Royal Blue
                            border: '2px solid #000080', // Dark Blue border
                            borderRadius: '3px', // Slightly rounded corners
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '14px',
                            color: '#FFF',
                            fontWeight: 'bold',
                            textShadow: '1px 1px #000',
                        }}>
                            📖
                        </div>
                    </div>

                    {/* Terminal Content */}
                    <div style={{
                        padding: '40px', // Padding inside the terminal
                        color: '#00FF00', // Green text for terminal
                        fontFamily: '"Press Start 2P", cursive', // Ensure font is applied here
                    }}>
                        <div>
                            {/* CNE Field */}
                            <div style={{ marginBottom: '30px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    marginBottom: '10px',
                                    color: '#F7E01F', // Yellow from original image
                                    textShadow: '2px 2px #000', // Black shadow
                                }}>
                                    CNE
                                </label>
                                <input
                                    type="text"
                                    value={cne}
                                    onChange={(e) => setCne(e.target.value)}
                                    required
                                    disabled={loading}
                                    style={{
                                        width: '100%',
                                        height: '40px',
                                        background: '#FFF',
                                        border: '3px solid #808080',
                                        borderRadius: '4px',
                                        fontSize: '16px',
                                        padding: '0 15px',
                                        fontFamily: '"Press Start 2P", cursive',
                                        boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.3)',
                                        outline: 'none',
                                        boxSizing: 'border-box', // Include padding in width
                                        color: '#333', // Input text color
                                    }}
                                />
                            </div>

                            {/* Password Field */}
                            <div style={{ marginBottom: '30px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    marginBottom: '10px',
                                    color: '#F7E01F', // Yellow from original image
                                    textShadow: '2px 2px #000', // Black shadow
                                }}>
                                    PASSWORD
                                </label>
                                <input
                                    type="password" // Changed to password type
                                    value={dateNaissance} // Keeping variable name as dateNaissance
                                    onChange={(e) => setDateNaissance(e.target.value)}
                                    required
                                    disabled={loading}
                                    style={{
                                        width: '100%',
                                        height: '40px',
                                        background: '#FFF',
                                        border: '3px solid #808080',
                                        borderRadius: '4px',
                                        fontSize: '16px',
                                        padding: '0 15px',
                                        fontFamily: '"Press Start 2P", cursive',
                                        boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.3)',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                        color: '#333',
                                    }}
                                />
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div style={{
                                    background: '#FF6B6B',
                                    color: '#FFF',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    marginBottom: '20px',
                                    border: '3px solid #FF0000',
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    boxShadow: '0px 4px 8px rgba(0,0,0,0.3)',
                                    fontFamily: '"Press Start 2P", cursive',
                                    fontSize: '14px',
                                }}>
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                onClick={handleSubmit}
                                style={{
                                    width: '100%',
                                    height: '50px',
                                    background: loading ? '#808080' : 'linear-gradient(180deg, #4169E1 0%, #000080 100%)', // Blue gradient
                                    color: '#FFF',
                                    border: '4px solid #000080',
                                    borderRadius: '8px',
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    fontFamily: '"Press Start 2P", cursive',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    boxShadow: loading ? 'inset 0px 0px 8px rgba(0,0,0,0.5)' : '0px 4px 8px rgba(0,0,0,0.3), inset 0px 2px 0px rgba(255,255,255,0.3)',
                                    transition: 'all 0.2s ease', // Smooth transition for hover/active
                                    transform: loading ? 'translateY(2px)' : 'translateY(0px)',
                                    textShadow: '2px 2px #000',
                                }}
                                onMouseDown={(e) => {
                                    if (!loading) {
                                        e.target.style.transform = 'translateY(2px)';
                                        e.target.style.boxShadow = 'inset 0px 0px 8px rgba(0,0,0,0.5)';
                                    }
                                }}
                                onMouseUp={(e) => {
                                    if (!loading) {
                                        e.target.style.transform = 'translateY(0px)';
                                        e.target.style.boxShadow = '0px 4px 8px rgba(0,0,0,0.3), inset 0px 2px 0px rgba(255,255,255,0.3)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!loading) {
                                        e.target.style.transform = 'translateY(0px)';
                                        e.target.style.boxShadow = '0px 4px 8px rgba(0,0,0,0.3), inset 0px 2px 0px rgba(255,255,255,0.3)';
                                    }
                                }}
                            >
                                {loading ? 'LOADING...' : 'ENTER'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;