import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
// Keyframe for the image sliding in between VO and LT
const imageSlideIn = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Animated background
const backgroundAnimation = keyframes`
  0% {
    background: linear-gradient(to right, #43C6AC, #F8FFAE);
  }
  50% {
    background: linear-gradient(to right, #F8FFAE, #43C6AC);
  }
  100% {
    background: linear-gradient(to right, #43C6AC, #F8FFAE);
  }
`;

// Full-screen container
const SplashContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  animation: ${backgroundAnimation} 3s ease-in-out infinite;
  background: linear-gradient(to right, #007BFF, #00C6FF);
  color: white;
  text-align: center;
`;

// Container for the logo animation
const LogoTextContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Arial', sans-serif;
`;

// Styling for VO and LT parts
const VoText = styled.span`
  font-size: 50px;
  font-weight: bold;
  color: black;
  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: opacity 0.5s ease-in;
`;

const LtText = styled.span`
  font-size: 50px;
  font-weight: bold;
  position: relative;
  color: black;
  left: ${(props) => (props.showImage ? '10px' : '0px')};
  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: opacity 0.5s ease-in, left 1s ease-in-out;
`;

// Image that slides in between VO and LT
const MiddleImage = styled.img`
  width: 60px;
  height: 60px;
  margin: 0 10px;
  opacity: ${(props) => (props.show ? 1 : 0)};
  animation: ${imageSlideIn} 1s ease-in forwards;
`;

// Animated button pulse
const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

// Button styling
const StartButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 18px;
  color: linear-gradient(90deg, #43C6AC, #F8FFAE);
  background-color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  animation: ${pulseAnimation} 0.6s infinite;

  &:hover {
    background-color: linear-gradient(90deg, #43C6AC, #F8FFAE);
  }
`;

// Subtitle styling
const Subtitle = styled.h2`
  font-size: 24px;
  margin-top: 10px;
  font-family: 'Arial', sans-serif;
  color: white;
`;

const SplashPage = ({ onStart }) => {
  const navigate = useNavigate();
  const [showTyping, setShowTyping] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const handleStart = () => {
    navigate('/home'); // Navigate to the home page
  };
  useEffect(() => {
    // Show typing effect
    const typingTimer = setTimeout(() => {
      setShowTyping(true);
    }, 1000);

    // Show image after typing finishes
    const imageTimer = setTimeout(() => {
      setShowImage(true);
    }, 2000);

    const autoStartTimer = setTimeout(() => {
      handleStart(); // Automatically transition to home after 6 seconds
    }, 6000);

    return () => {
      clearTimeout(typingTimer);
      clearTimeout(imageTimer);
      clearTimeout(autoStartTimer);
    };
  }, [handleStart]);

  return (
    <SplashContainer>
      <div>
        <LogoTextContainer>
          <VoText show={showTyping}>V.O.</VoText>
          {showImage && (
            <MiddleImage
              src={`${process.env.PUBLIC_URL}/images/translate_logo.png`}
              alt="Translate Icon"
              show={showImage}
            />
          )}
          <LtText show={showTyping} showImage={showImage}>L.T</LtText>
        </LogoTextContainer>
        <Subtitle>Your Voice-to-Output Language Transcription App</Subtitle>
        <StartButton onClick={handleStart}>Get Started</StartButton>
      </div>
    </SplashContainer>
  );
};

export default SplashPage;
