import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Highlights from './components/Highlights';
import Testimonials from './components/Testimonials';
import Demo from './components/Demo';
import Features from './components/Features';
import Comparison from './components/Comparison';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';

function App() {
  return (
    <div className="font-sans text-gray-800">
      <Header />
      <main>
        <Hero />
        <Highlights />
        <Testimonials />
        <Demo />
        <Features />
        <Comparison />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}

export default App;