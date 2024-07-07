import { Disclosure } from '@headlessui/react';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import Drawer from "./Drawer";
import Drawerdata from "./Drawerdata";
import LoginModal from './Login';
import Image from 'next/image';
import { parse, stringify } from 'flatted';

interface NavigationItem {
    name: string;
    href: string;
    current: boolean;
}

const navigation: NavigationItem[] = [
    { name: 'Accueil', href: '#home-section', current: false },
    { name: 'A propos de nous', href: '#about-section', current: false },
    { name: 'Section', href: '#cook-section', current: false },
    { name: 'Galerie', href: '#gallery-section', current: false },
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [complexData, setComplexData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = {
                id: 1,
                name: 'Example',
                circularRef: {}
            };
            data.circularRef = data;  // Creating a circular reference

            try {
                const jsonString = stringify(data);
                console.log('Serialized complex data:', jsonString);
                
                const parsedData = parse(jsonString);
                setComplexData(parsedData);
            } catch (error) {
                console.error('Error serializing complex data:', error);
            }
        };

        fetchData();
    }, []);

    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => setIsLoginModalOpen(false);

    return (
        <Disclosure as="nav" className="navbar">
            <>
                <div className="mx-auto max-w-7xl p-3 md:p-6 lg:px-8">
                    <div className="relative flex h-12 sm:h-20 items-center">
                        <div className="flex flex-1 items-center sm:justify-between mt-5">
                            {/* LOGO */}
                            <div className="hidden sm:flex flex-shrink-0 items-center border-right logoSoutenance">
                                <Image src="/images/Navbar/sm.png" alt="logo" width={150} height={10} />
                            </div>

                            {/* LINKS */}
                            <div className="hidden lg:flex items-center border-right">
                                <div className="flex justify-end space-x-4">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={classNames(
                                                item.current ? 'bg-black' : 'navlinks hover:opacity-100',
                                                'px-3 py-4 rounded-md text-lg font-normal opacity-50 hover:text-black space-links'
                                            )}
                                            aria-current={item.href ? 'page' : undefined}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className='gap-6 hidden lg:flex'>
                                <div className='flex items-center gap-2'>
                                    <Image src={'/images/Navbar/phone.svg'} alt="phone-image" width={18} height={18} />
                                    <p className='text-lg font-medium'>+229 50100005</p>
                                </div>
                                
                                <Link href="/login" className='flex justify-end text-xl font-medium bg-blue-500 text-pink py-4 px-4 lg:px-8 navbutton rounded-full hover:text-gray'>
                                    Se connecter  
                                </Link>
                            </div>
                        </div>

                        {/* DRAWER FOR MOBILE VIEW */}
                        <div className='block lg:hidden'>
                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" onClick={() => setIsOpen(true)} />
                        </div>

                        {/* DRAWER LINKS DATA */}
                        <Drawer isOpen={isOpen} setIsOpen={setIsOpen}>
                            <Drawerdata />
                        </Drawer>

                        {/* LOGIN MODAL */}
                        <LoginModal isOpen={isLoginModalOpen} closeModal={closeLoginModal} />
                    </div>
                </div>
            </>
        </Disclosure>
    )
}

export default Navbar;
