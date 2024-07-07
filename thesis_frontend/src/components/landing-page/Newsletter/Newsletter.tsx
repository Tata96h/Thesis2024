"use client"
import Image from "next/image";
import { Fade } from "react-awesome-reveal";
import {Send} from 'lucide-react';


const Newsletter = () => {
    return (
        <div className='relative mb-3'style={{marginTop:'-10%',marginBottom:'12%'}}>
            <div className="bg-black text-white mx-auto max-w-2xl br-100
             md:max-w-7xl mt-48 rounded-lg">
                    
  <div className="flex justify-center">
    <div className="text-center md:max-w-xl lg:max-w-3xl">
      <h2 className="mb-12 mt-5 px-6 text-3xl font-bold">Contactez-nous</h2>
    </div>
  </div>
  <div className="flex flex-wrap">
    <div className="mb-12 w-full shrink-0 grow-0 basis-auto md:px-3 lg:mb-0 lg:w-5/12 lg:px-6">
      <form>
        <div className="relative mb-6" data-te-input-wrapper-init="">
          <input
            type="text"
            className=" text-black block min-h-[auto] w-full rounded border-0 py-[0.32rem] px-3  "
            id="exampleInput90"
            placeholder="Nom"
          />
          <label
            className="pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8]  peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:peer-focus:text-primary"
            
          >
            
          </label>
        </div>
        <div className="relative mb-6" data-te-input-wrapper-init="">
          <input
            type="email"
            className=" peer block min-h-[auto] w-full rounded border-0  py-[0.32rem] px-3 leading-[1.6]" 
            id="exampleInput91"
            placeholder="Adresse Email"
          />
          <label
            className="pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 "
            htmlFor="exampleInput91"
          >
          </label>
        </div>
        <div className="relative mb-6" data-te-input-wrapper-init="">
          <textarea
            className="peer bg-stone-50 block min-h-[auto] w-full rounded border-0 py-[0.32rem] px-3 leading-[1.6]"
            id="exampleFormControlTextarea1"
            rows={3}
            placeholder="Votre message"
            defaultValue={""}
          />
          <label
            htmlFor="exampleFormControlTextarea1"
            className="pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
          >
            
          </label>
        </div>
        <div className="mb-6 inline-block min-h-[1.5rem] justify-center pl-[1.5rem] md:flex">
          <input
            className="relative float-left mt-[0.15rem] mr-[6px] -ml-[1.5rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full  before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:ml-[0.25rem] checked:after:-mt-px checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-t-0 checked:after:border-l-0 checked:after:border-solid checked:after:border-white  checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:ml-[0.25rem] checked:focus:after:-mt-px checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-t-0 checked:focus:after:border-l-0 checked:focus:after:border-solid checked:focus:after:border-white dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
            type="checkbox"
            defaultValue=""
            id="exampleCheck96"
          />
          <label
            className="inline-block pl-[0.15rem] hover:cursor-pointer"
            htmlFor="exampleCheck96"
          >
            Envoyez une copie de ce message
          </label>
        </div>
        <button
          type="button"
          data-te-ripple-init=""
          data-te-ripple-color="light"
          className="mb-6 inline-block w-full rounded bg-blue-500 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-blue-500 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-blue-500 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-blue-500 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
        >
          Envoyez
        </button>
      </form>
    </div>
    <div className="w-full shrink-0 grow-0 basis-auto lg:w-7/12">
      <div className="flex flex-wrap">
        <div className="mb-12 w-full shrink-0 grow-0 basis-auto md:w-6/12 md:px-3 lg:px-6">
          <div className="flex items-start">
            <div className="shrink-0">
              <div className="inline-block rounded-md bg-primary-100 p-4 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.25 9.75v-4.5m0 4.5h4.5m-4.5 0l6-6m-3 18c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 014.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 00-.38 1.21 12.035 12.035 0 007.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 011.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 01-2.25 2.25h-2.25z"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-6 grow">
              <p className="mb-2 font-bold dark:text-white">
                Téléphone
              </p>
              <p className="text-neutral-500 dark:text-neutral-200">
+22940505050              </p>
              <p className="text-neutral-500 dark:text-neutral-200">
                +229 50100005
              </p>
            </div>
          </div>
        </div>
        <div className="mb-12 w-full shrink-0 grow-0 basis-auto md:w-6/12 md:px-3 lg:px-6">
          <div className="flex items-start">
            <div className="shrink-0">
              <div className="inline-block rounded-md bg-primary-100 p-4 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
            </div>
            <div className="ml-6 grow">
              <p className="mb-2 font-bold dark:text-white">Email</p>
              <p className="text-neutral-500 dark:text-neutral-200">
                ecole@gmail.com
              </p>
              {/* <p className="text-neutral-500 dark:text-neutral-200">
                +1 234-567-89
              </p> */}
            </div>
          </div>
        </div>
        <div className="mb-12 w-full shrink-0 grow-0 basis-auto md:w-6/12 md:px-3 lg:px-6">
          <div className="align-start flex">
            <div className="shrink-0">
              <div className="inline-block rounded-md bg-primary-100 p-4 text-primary">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
            </div>
            <div className="ml-6 grow">
              <p className="mb-2 font-bold dark:text-white">Siège</p>
              <p className="text-neutral-500 dark:text-neutral-200">
               Gbegamey
              </p>
              <p className="text-neutral-500 dark:text-neutral-200">
Cotonou-Bénin              </p>
            </div>
          </div>
        </div>
        <div className="mb-12 w-full shrink-0 grow-0 basis-auto md:w-6/12 md:px-3 lg:px-6">
          <div className="align-start flex">
            <div className="shrink-0">
              <div className="inline-block rounded-md bg-primary-100 p-4 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-newspaper"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>
              </div>
            </div>
            <div className="ml-6 grow">
              <p className="mb-2 font-bold dark:text-white">Information</p>
              <p className="text-neutral-500 dark:text-neutral-200">
                info@example.com
              </p>
              <p className="text-neutral-500 dark:text-neutral-200">
+229 50100005              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

                </div>
            </div>
    )
}

export default Newsletter;