import useUserEvents from "@/Connection/useUserEvents";
import { Icon, SVG } from "@/Icons/SVG";
import { Button } from "@/Inputs/Button";
import { LandingButton } from "@/Inputs/LandingButton";
import { List, ListElement } from "@/Inputs/List";
import { PopupContainer, usePopup } from "@/Popup";
import { PageProps } from "@/types";
import { User } from "@/types/models/tables/User";
import { useState } from "react";
import Base from "./Base";

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
        <Base className="flex flex-col">
            <PopupContainer />
            <section className="pt-[10%] flex flex-col gap-12 items-center grow">

                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 205.49 72.51" className="fill-pink-50 w-[500px]">
                    <polygon className="fill-transparent" points="53.72 42.81 59.84 48.92 36.25 72.51 0 36.25 36.25 0 59.84 23.59 53.72 29.71 47.17 36.25 53.72 42.81"/>
                    <path d="M36.25,60.27l-24-24,24-24L53.72,29.71l6.12-6.12L36.25,0,0,36.25,36.25,72.51,59.84,48.93l-6.12-6.12Z"/>
                    <path d="M98.48,39.89q0,15.47-14.4,15.46-14,0-14-15.1V20.44h7.75V40.35q0,8.32,6.51,8.32t6.39-8V20.44h7.73Z"/>
                    <path d="M109.57,54.75V20.44h12.49q5.75,0,8.83,2.11A6.78,6.78,0,0,1,134,28.48a7,7,0,0,1-1.87,4.86,9.9,9.9,0,0,1-4.8,2.89v.1a9.49,9.49,0,0,1,5.85,2.7,7.57,7.57,0,0,1,2.19,5.48A9.17,9.17,0,0,1,132,52c-2.24,1.84-5.32,2.76-9.21,2.76Zm7.73-28.61v8.13h3.39a5.66,5.66,0,0,0,3.77-1.16,3.94,3.94,0,0,0,1.38-3.19q0-3.78-5.65-3.78Zm0,13.87v9.05h4.18a6.43,6.43,0,0,0,4.2-1.25,4.13,4.13,0,0,0,1.52-3.39,3.91,3.91,0,0,0-1.49-3.24A6.64,6.64,0,0,0,121.53,40Z"/>
                    <path d="M172.58,39.89q0,15.47-14.4,15.46-14,0-14-15.1V20.44H152V40.35q0,8.32,6.5,8.32t6.39-8V20.44h7.73Z"/>
                    <path d="M182.09,53.43V45.78a14.86,14.86,0,0,0,4.52,2.62,14.6,14.6,0,0,0,4.93.87,11.31,11.31,0,0,0,2.55-.26,6.12,6.12,0,0,0,1.82-.73,3.26,3.26,0,0,0,1.09-1.1,2.73,2.73,0,0,0,.36-1.38,3,3,0,0,0-.58-1.79,6,6,0,0,0-1.57-1.46,15.4,15.4,0,0,0-2.35-1.29c-.91-.42-1.89-.84-3-1.27a15.08,15.08,0,0,1-6-4.09,9,9,0,0,1-2-5.84A9.4,9.4,0,0,1,183,25.45,9.19,9.19,0,0,1,186,22.28a13,13,0,0,1,4.29-1.83,22.14,22.14,0,0,1,5.17-.58,30.6,30.6,0,0,1,4.75.32,19.29,19.29,0,0,1,3.81,1v7.16a11.75,11.75,0,0,0-1.88-1.06,14.83,14.83,0,0,0-2.09-.75,15.07,15.07,0,0,0-2.14-.44,14.47,14.47,0,0,0-2-.15,10.29,10.29,0,0,0-2.39.26,6,6,0,0,0-1.82.7A3.45,3.45,0,0,0,190.49,28a2.59,2.59,0,0,0-.41,1.42,2.69,2.69,0,0,0,.46,1.55,5.25,5.25,0,0,0,1.29,1.29,14.14,14.14,0,0,0,2,1.2c.8.39,1.7.79,2.71,1.2a31.72,31.72,0,0,1,3.69,1.83,13.4,13.4,0,0,1,2.81,2.19,8.79,8.79,0,0,1,1.8,2.79,9.93,9.93,0,0,1,.62,3.65,9.73,9.73,0,0,1-1.09,4.82,8.85,8.85,0,0,1-3,3.16,12.92,12.92,0,0,1-4.35,1.73,25.1,25.1,0,0,1-5.22.53,28.84,28.84,0,0,1-5.37-.48A16.27,16.27,0,0,1,182.09,53.43Z"/>
                </svg>

                <LandingButton text="Play Now" onClick={showLoginOptionsCallback} />

                <List
                    title="Connect With"
                    className={`relative z-20 w-[250px] ${!visibleLoginOptions ? 'pointer-events-none opacity-0' : 'opacity-100'} transition-all ease duration-500`}
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
                <Button icon={Icon.cogs} onClick={() => showPopup('settings', { title: 'Settings', showExit: true })} />
                <Button icon={Icon.info} onClick={() => showPopup('credits', { title: 'Credits', showExit: true })} />
                <Button text="Give us a Star" icon={Icon.github} isLeft={true} onClick={() => window.open('https://github.com/iee-ihu-gr-course1941/ADISE24_Cubus', '_blank')}/>

                <p className="ml-auto">Server Status: &nbsp;
                    <span className={`${connectionState === 'connected' ? 'text-green-400' : 'text-custom-brown-500' }`}>
                        {connectionState}
                    </span>
                </p>
            </footer>
        </Base>
    );
}
