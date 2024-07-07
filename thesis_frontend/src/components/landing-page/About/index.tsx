"use client"
import Image from 'next/image';
import { Fade } from "react-awesome-reveal";


const Cook = () => {

    return (
        <div className='relative mb-15' id="cook-section" style={{marginTop:'-10%'}}>
            <div className="mx-auto max-w-7xl lg:pt-20 sm:pb-24 px-6">

                <div className='absolute right-0 bottom-[-7%] hidden lg:block img'>
                    <Image src={'/images/About/imgSM1.png'} alt="" width={463} height={622}  />
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-12 my-16 space-x-5'>

                    <div className='col-span-6 flex justify-start'>
                        <Image src="/images/About/about.jpg" alt="" width={836} height={808} />
                    </div>


                    <div className='col-span-6 flex flex-col justify-center'>
                        <Fade direction={'up'} delay={400} cascade damping={1e-1} triggerOnce={true}>
                            <h2 className='text-pink text-lg font-normal mb-3 ls-51 uppercase text-start'>Soutenez avec nous</h2>
                        </Fade>
                        <Fade direction={'up'} delay={800} cascade damping={1e-1} triggerOnce={true}>
                            <h3 className="text-3xl lg:text-5xl font-semibold text-black text-start">
                                Notre plateforme vous aide.
                            </h3>
                        </Fade>
                        <Fade direction={'up'} delay={1000} cascade damping={1e-1} triggerOnce={true}>
                            <p className='text-grey md:text-lg font-normal mb-10 text-justify mt-2'>Notre projet est une solution complète conçue pour simplifier et rationaliser le processus de gestion des soutenances académiques. Grâce à notre système, les responsables peuvent facilement planifier les dates et les heures des soutenances, assigner des jurys aux étudiants, et gérer les salles et les équipements nécessaires. Les étudiants bénéficient d´une interface intuitive pour s´inscrire à des créneaux de soutenance et soumettre leurs travaux. Les enseignants et les membres du jury accèdent à un tableau de bord centralisé pour consulter les informations sur les soutenances à venir, évaluer les travaux des étudiants, et fournir des commentaires. </p>
                            <p className='text-grey md:text-lg font-normal mb-10 text-justify mt-1'>Les enseignants et les membres du jury accèdent à un tableau de bord centralisé pour consulter les informations sur les soutenances à venir, évaluer les travaux des étudiants, et fournir des commentaires.</p>
                            <div className='flex align-middle justify-center md:justify-start'>
                                <button className='text-xl font-medium rounded-full text-white py-5 px-6 bg-blue-500 lg:px-10 mr-6'>Voir plus</button>
                            </div>
                        </Fade>
                    </div>



                </div>

            </div>
        </div >
    )
}

export default Cook;
