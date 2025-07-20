import React, { useEffect } from 'react';

const NotFoundPage = () => {
  useEffect(() => {
    const dots = document.querySelectorAll('.dot');
    dots.forEach(dot => {
      dot.style.top = `${Math.random() * 100}%`;
      dot.style.left = `${Math.random() * 100}%`;
      dot.style.width = `${Math.random() * 5 + 3}px`;
      dot.style.height = dot.style.width;
    });
  }, []);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      height: '100vh',
      position: 'relative',
      color: '#fff',
      backgroundColor: '#1c1c1c',
    }}>
      <style>
        {`
          @keyframes fadeInOut {
            0%, 100% {
              opacity: 0;
            }
            50% {
              opacity: 0.8;
            }
          }
        `}
      </style>
      <div style={{ zIndex: 2, color: '#ffba08' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Houston, we have a problem.</h1>
        <h2 style={{ fontSize: '6rem', margin: '0', color: '#fff' }}>404</h2>
        <p style={{ margin: '5px 0' }}>Page not found</p>
        <button
          style={{
            backgroundColor: '#ffba08',
            color: '#1c1c1c',
            border: 'none',
            padding: '10px 20px',
            fontSize: '1rem',
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#ffa500'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#ffba08'}
        >
          Learn more
        </button>
      </div>
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        zIndex: 1,
      }}>
        <img
          src={`${process.env.PUBLIC_URL}/images/astronaut2.svg`}
          alt="Astronaut"
          style={{ width: '30rem', height:'30rem'}}
        />
      </div>
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: '0',
        left: '0',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}>
        {Array.from({ length: 50 }).map((_, index) => (
          <div
            key={index}
            className="dot"
            style={{
              position: 'absolute',
              backgroundColor: 'white',
              borderRadius: '50%',
              animation: 'fadeInOut 3s infinite',
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default NotFoundPage;
