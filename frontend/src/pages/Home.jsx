import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Security from '../components/Security';

const Home = () => {
    return (
        <main>
            <Hero />
            <Features />
            <HowItWorks />
            <Security />
        </main>
    );
};

export default Home;
