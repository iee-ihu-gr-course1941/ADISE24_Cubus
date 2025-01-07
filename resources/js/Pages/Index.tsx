import { Icon, SVG } from "@/Icons/SVG";
import { Button } from "@/Inputs/Button";
import { List, ListElement } from "@/Inputs/List";
import { PageProps } from "@/types";
import { User } from "@/types/models/tables/User";
import { useState } from "react";

export default function Index({ user, flash }: PageProps<{ user: User }>) {
    const [visibleLoginOptions, setVisibleLoginOptions] = useState<boolean>(false);

    return (
        <div className="w-screen h-screen bg-backdrop relative text-custom-gray-400 font-bold flex flex-col">
            <section className="pt-[10%] flex flex-col gap-12 items-center grow">
                <p className="text-custom-pink-50 text-9xl">CUBUS</p>
                <Button text="Play Now" icon={Icon.largeStars} isLeft={true} onClick={() => setVisibleLoginOptions(true)} />

                {
                    visibleLoginOptions &&
                    <List title="Connect With" onClick={(value) => console.log('Login with:', value)}>
                        <ListElement value="ihu">
                                <div className="w-full px-8 py-3.5 flex gap-2 items-center hover:bg-custom-purple-400 hover:text-custom-pink-50">
                                    <SVG icon={Icon.ieeIhu} />IEE IHU Account
                                </div>
                            </ListElement>
                        <ListElement value="mock">
                                <div className="group w-full px-8 py-3.5 flex gap-2 items-center hover:bg-custom-purple-400 hover:text-custom-pink-50">
                                    <SVG icon={Icon.wrench} fill="fill-custom-gray-400 group-hover:fill-custom-pink-50" />Mock Account
                                </div>
                            </ListElement>
                    </List>
                }
            </section>

            <footer className="flex gap-2 p-8">
                <Button icon={Icon.cogs} />
                <Button icon={Icon.info} />
                <Button text="Give us a Star" icon={Icon.github} isLeft={true} onClick={() => window.open('https://github.com/iee-ihu-gr-course1941/ADISE24_Cubus', '_blank')}/>
            </footer>
        </div>
    );
}
