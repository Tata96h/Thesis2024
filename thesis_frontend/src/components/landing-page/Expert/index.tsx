"use client"
import React from 'react';
import { Fade } from 'react-awesome-reveal';

const MultiCardCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const cards = [
    {
        profession: 'Doctorant en Gestion Commerciale',
        name: 'M ADJA Frimas',
        image: '/images/Expert/soutenant1.jpg',
        style:"15px",
        width:363,
        height:462,
    },
    {
        profession: 'Etudiante en Expertise comptable',
        name: 'Mlle MIGAN Eliane',
        image: '/images/Expert/soutenant2.jpg',
        style:"15px",
        width:800,
        height:462,
    },
    {
        profession: 'Etudiante en Statistiques',
        name: 'Mlle Esméralda ADANLE',
        image: '/images/Expert/soutenant3.jpg',
        style:"15px",
        width:331,
        height:262,
    },
    {
        profession: 'Etudiante en Statistiques',
        name: 'Mlle Esméralda ADANLE',
        image: '/images/Expert/soutenant3.jpg',
        style:"15px",
        width:331,
        height:262,
    },
    {
        profession: 'Etudiante en Statistiques',
        name: 'Mlle Esméralda ADANLE',
        image: '/images/Expert/soutenant3.jpg',
        style:"15px",
        width:331,
        height:262,
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
<div className='mx-auto max-w-2xl lg:max-w-7xl sm:py-4 lg:px-8'>
   <div className="text-center">
                        <Fade direction={'up'} delay={400} cascade damping={1e-1} triggerOnce={true}>
                            <h2 className='text-pink text-lg font-normal mb-3 tracking-widest uppercase ls-51'>Etudiants brillants</h2>
                        </Fade>
                        <Fade direction={'up'} delay={800} cascade damping={1e-1} triggerOnce={true}>
                            <h3 className="text-3xl lg:text-5xl font-semibold text-black">
Voir nos meilleurs étudiants                            </h3>
                        </Fade>
   </div>



    <div className="mt-2">
      <div className="">
        <div className="relative">
          
          <div className="flex space-x-4 ml-25">
            {cards.slice(currentIndex, currentIndex + 3).map((card, index) => (
              <div className="flex-none w-1/3 p-4 bg-white rounded-lg shadow-md" key={index}>
                <img className="w-full h-50 object-cover mb-4 rounded-lg" src={card.image} alt="Card" />
                <h3 className="text-lg font-bold">{card.profession}</h3>
                <p className="text-gray-500">{card.name}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 relative  bottom-44 ">
            <button className="w-10 h-6 rounded-full bg-gray-300 ml-20 relative right-4" onClick={handlePrev}>&lt;</button>
            <button className="w-6 h-6 rounded-full bg-gray-300 relative left-10" onClick={handleNext}>&gt;</button>
          </div>
        </div>
      </div>
    </div>
   </div>
  );
};

export default MultiCardCarousel;