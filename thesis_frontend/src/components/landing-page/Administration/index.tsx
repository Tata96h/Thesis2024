"use client"

import React from 'react';
import Image from 'next/image';

import { Fade } from 'react-awesome-reveal';
{/*
import { MoveRight,MoveLeft } from 'lucide-react';

const Work: React.FC = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const cards = [
    {
      image: '/images/Features/directeur.jpg',
      title: 'Directeur',
      description: 'Dr ADEGNI Mozart',
    },
    {
       image: '/images/Features/professeure.jpg',
      title: 'Professeure',
      description: 'Mme DAGAN Célia',
    },
    {
       image: '/images/Features/comptable.jpg',
      title: 'Comptable',
      description: 'Mme VOSSA Anabelle',
    },
    {
       image: '/images/Features/directeuradjoint.jpg ',
      title: 'Directeur adjoint',
      description: 'M SOGLO Baudouin',
    },
    
  ];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
  };
if(currentIndex>cards.length-3) {
  console.log(currentIndex)
  setCurrentIndex(0)
  console.log("hi")
}
  return (
    <div className="mt-2">
      <div className="w-11/12">
        <div className="relative md:pl-20">
          
          <div className="flex space-x-4">
            {cards.slice(currentIndex, currentIndex + 3).map((card, index) => (
              <div className="flex-none w-1/3 p-4 bg-white rounded-lg shadow-md" key={index}>
                <img className="w-full h-50 object-cover mb-4 rounded-lg" src={card.image} alt="Card" />
                <h3 className="text-lg font-bold">{card.title}</h3>
                <p className="text-gray-500">{card.description}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 ml-[-20px] mr-[-20px] relative  bottom-44 ">
            <button className="w-10 h-6 rounded-full bg-gray-300  relative right-4" onClick={handlePrev}><MoveLeft /></button>
            <button className="w-6 h-6 rounded-full bg-gray-300 relative left-10" onClick={handleNext}><MoveRight /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;

 */}


import Slider from "react-slick";

function Work() {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    speed: 5000,
    autoplaySpeed: 1000,
    cssEase: "linear"
  };

  const cards = [
    {
      image: '/images/Features/directeur.jpg',
      title: 'Directeur',
      description: 'Dr ADEGNI Mozart',
    },
    {
       image: '/images/Features/professeure.jpg',
      title: 'Professeure',
      description: 'Mme DAGAN Célia',
    },
    {
       image: '/images/Features/comptable.jpg',
      title: 'Comptable',
      description: 'Mme VOSSA Anabelle',
    },
    {
       image: '/images/Features/directeuradjoint.jpg ',
      title: 'Directeur adjoint',
      description: 'M SOGLO Baudouin',
    },
    
  ];


  return (
<div className='mx-auto max-w-7xl py-40 px-6' id="about-section" style={{marginTop:'-10%'}}>
                <div className='text-center mb-4' >
                    <Fade direction={'up'} delay={400} cascade damping={1e-1} triggerOnce={true}>
                        <h3 className='text-pink text-lg font-normal mb-3 ls-51 uppercase' >Administration</h3>
                    </Fade>
                    <Fade direction={'up'} delay={800} cascade damping={1e-1} triggerOnce={true}>
                        <p className='text-3xl lg:text-5xl font-semibold text-lightgrey'>Quelques membres de<br /> l´administration.</p>
                    </Fade>
                </div>
    
   <div className="w-11/12 mx-auto w-full ">
  <Slider {...settings}>
    {cards.map((card, index) => (
      <div className="flex-none p-2 bg-white rounded-lg shadow-md" key={index}>
        <img className="w-full h-50 object-cover mb-4 rounded-lg" src={card.image} alt="Card" />
        <p className="text-gray-500 font-bold">{card.description}</p>
        <h3 className="text-sm  text-black ">{card.title}</h3>
      </div>
    ))}
  </Slider>
</div>


 </div>
  );
}

export default Work;
