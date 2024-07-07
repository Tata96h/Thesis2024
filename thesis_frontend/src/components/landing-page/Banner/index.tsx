"use client"
import Image from 'next/image';
import { Fade } from "react-awesome-reveal";
import Link from 'next/link';


const Banner = () => {

    return (
        <div id="home-section" className='bg-lightpink'>
            <div className="mx-auto max-w-7xl pt-20 sm:pb-24 px-6">

                <div className='grid grid-cols-1 lg:grid-cols-12 space-x-1'>

                    <div className='col-span-6 flex flex-col justify-center'>
                        <Fade direction={'up'} delay={400} cascade damping={1e-1} triggerOnce={true}>
                            <h1 className="text-4xl lg:text-7xl font-semibold mb-5 text-lightgrey md:4px lg:text-start text-center">
                                Suivez votre <br /> fin de parcours.
                            </h1>
                        </Fade>
                        <Fade direction={'up'} delay={800} cascade damping={1e-1} triggerOnce={true}>
                            <p className='text-grey lg:text-lg font-normal mb-10 lg:text-start text-center'>En automatisant les tâches répétitives et en fournissant des outils de suivi et de gestion efficaces, nous permettons aux établissements éducatifs de se concentrer sur l´essentiel: <br /><i className='text-amber-600	'>l´excellence académique et le succès des étudiants.</i>  </p>
                        </Fade>
                        <Fade direction={'up'} delay={1000} cascade damping={1e-1} triggerOnce={true}>
                            <div className='md:flex align-middle justify-center lg:justify-start'>
                                {/* <button className='text-xl w-full md:w-auto font-medium rounded-full text-white py-5 px-6 bg-green-500 lg:px-14 mr-6'><Link href='#cook-section'>Commencer</Link></button> */}
                                <button className='flex border w-full md:w-auto mt-5 md:mt-0 justify-center rounded-full text-xl font-medium items-center py-5 px-10 text-dark hover:bg-green-400 hover:text-white hover:border-zinc-50 border-stone-500 '><Link href='/etudiant' >Commencer</Link></button>
                               
                            </div>
                        </Fade>
                    </div>

                    <div className='col-span-6 flex justify-center relative'>
                        <div className='flex bg-white p-2 gap-5 items-center bottom-10 left-10 rounded-xl absolute'>
                            <Image src={'/images/Banner/etudiant.jpg'} alt="pizza-image" width={68} height={68} />
                            <p className='text-lg font-normal'>Plus de 2000 <br /> étudiants.</p>
                        </div>
                        <Image src="/images/Banner/etudiant.jpg" alt="nothing" width={1000} height={805} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Banner;
