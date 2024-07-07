import React from "react";
import Link from "next/link";
import Contactusform from "./Contactus";

interface NavigationItem {
    name: string;
    href: string;
    current: boolean;
}

const navigation: NavigationItem[] = [
    { name: 'Accueil', href: '#Accueil-section', current: false },
    { name: 'A propos de nous', href: '#about-section', current: false },
    { name: 'Galerie', href: '#galerie-section', current: false },
]


function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const Data = () => {
    return (
        <div className="rounded-md max-w-sm w-full mx-auto">
            <div className="flex-1 space-y-4 py-1 ">
                <div className="sm:block ">
                    <div className="space-y-1 px-5 pt-2 pb-3 mb-20 ">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={classNames(
                                    item.current ? 'bg-gray-900 text-purple' : 'text-black hover:bg-green-100 hover:text-pink',
                                    'block  py-2 rounded-md text-base font-medium'
                                )}
                                aria-current={item.current ? 'page' : undefined}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="mt-5 ">
                        
                        <Link href="" className='flex justify-center text-base w-full font-medium rounded-full bg-transparent  pink text-pink py-3 px-4 lg:px-8 navbutton hover:text-dark hover:bg-green-100'>Contactez-nous</Link>
                        {/* <Contactusform />  */}

<button className='flex justify-center text-base w-full font-medium rounded-full text-white py-3 px-4 lg:px-8 navbutton bg-blue-500'>
                            Se connecter
                         </button>

                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Data;
