import useUserEvents from "@/Connection/useUserEvents";
import { Icon, SVG } from "@/Icons/SVG";
import { Button } from "@/Inputs/Button";
import { LandingButton } from "@/Inputs/LandingButton";
import { List, ListElement } from "@/Inputs/List";
import { PopupContainer, usePopup } from "@/Popup";
import { PageProps } from "@/types";
import { User } from "@/types/models/tables/User";
import { useState } from "react";

export default function Index({ user, flash }: PageProps<{ user: User }>) {
    const [visibleLoginOptions, setVisibleLoginOptions] = useState<boolean>(false);
    const { connectionState } = useUserEvents();
    const { showPopup } = usePopup();

    console.info('Initial Server Data:', user, flash);

    function showLoginOptionsCallback() {
        if(user != null) {
            window.open('/game', '_self');
            return;
        }

        setVisibleLoginOptions(true);
    }

    function handleLoginCallback(loginOption: string) {
        console.info('User selected login option:', loginOption);

        if(loginOption === 'ihu') {
            window.open(`${import.meta.env.VITE_APPS_LOGIN}&state=/game`, '_blank');
            return;
        }

        if(loginOption === 'mock') {
            showPopup('mock-login', { title: 'Mock Login', showExit: true });
            return;
        }
    }

    return (
        <div className="w-screen h-screen bg-backdrop relative overflow-hidden animate-show">
            <div className="absolute z-50 w-screen h-screen pointer-events-none bg-[url('/ui-backdrop/noise.jpg')] opacity-[11%] scale-105 animate-noise"></div>
            <div className="absolute z-50 w-screen h-screen pointer-events-none bg-[url('/ui-backdrop/noise.jpg')] opacity-[5%] scale-105 animate-noise-alt"></div>
            <div className="relative z-10 w-screen h-screen flex flex-col text-custom-gray-400 font-bold">
                <PopupContainer />
                <section className="pt-[10%] flex flex-col gap-12 items-center grow">
                    <p className="relative z-20 text-custom-pink-50 text-9xl">CUBUS</p>
                    <LandingButton text="Play Now" onClick={showLoginOptionsCallback} />

                    <List
                        title="Connect With"
                        className={`relative z-20 ${!visibleLoginOptions ? 'pointer-events-none opacity-0' : 'opacity-100'} transition-all ease duration-500`}
                        onClick={handleLoginCallback}>
                        <ListElement value="ihu">
                            <div className={`
                                    w-full px-8 ${!visibleLoginOptions ? 'h-0 py-0' : 'h-[52px] py-3.5'}
                                    flex gap-2 items-center

                                    hover:bg-custom-purple-400 hover:text-custom-pink-50
                                    ${!visibleLoginOptions ? 'h-0 opacity-0' : 'h-[100px] opacity-100'}
                                    list-item-transition
                                `}>
                                <SVG icon={Icon.ieeIhu} />IEE IHU Account
                            </div>
                        </ListElement>
                        <ListElement value="mock">
                            <div className={`
                                    group
                                    w-full px-8 ${!visibleLoginOptions ? 'h-0 py-0' : 'h-[52px] py-3.5'}
                                    flex gap-2 items-center

                                    hover:bg-custom-purple-400 hover:text-custom-pink-50
                                    ${!visibleLoginOptions ? 'h-0 opacity-0' : 'h-[100px] opacity-100'}
                                    list-item-transition
                                `}>
                                    <SVG icon={Icon.wrench} fill="fill-custom-gray-400 group-hover:fill-custom-pink-50" />Mock Account
                                </div>
                            </ListElement>
                    </List>
                </section>

                <footer className="flex items-center gap-2 p-8">
                    <Button icon={Icon.cogs} />
                    <Button icon={Icon.info} onClick={() => showPopup('credits', { title: 'Credits', showExit: true })} />
                    <Button text="Give us a Star" icon={Icon.github} isLeft={true} onClick={() => window.open('https://github.com/iee-ihu-gr-course1941/ADISE24_Cubus', '_blank')}/>

                    <p className="ml-auto">Server Status: &nbsp;
                        <span className={`${connectionState === 'connected' ? 'text-green-400' : 'text-custom-brown-500' }`}>
                            {connectionState}
                        </span>
                    </p>
                </footer>
            </div>

            <div className="fixed inset-0">
                <img src="/ui-backdrop/nebula.svg" className="absolute w-[4000px] -bottom-[22%] -left-[10%]" />
                <img src="/ui-backdrop/nebula-side.svg" className="absolute w-2/3 bottom-[22%] -right-[20%]" />
                <img src="/ui-backdrop/rock-formation.svg" className="absolute w-1/2 bottom-0 -right-[30px] animate-ground-hover" />
                <img src="/ui-backdrop/asteroid.svg" className="absolute w-[200px] bottom-[60%] right-[10%] animate-asteroid-hover" />
            </div>
        </div>
    );
}
