import { Icon } from "@/Icons/SVG";
import { Button } from "@/Inputs/Button";
import { PageProps } from "@/types";
import { User } from "@/types/models/tables/User";

export default function Index({ user, flash }: PageProps<{ user: User }>) {
    return (
        <div className="w-screen h-screen bg-backdrop relative text-custom-gray-400 font-bold flex flex-col">
            <section className="pt-[10%] flex flex-col gap-12 items-center grow">
                <p className="text-custom-pink-50 text-9xl">CUBUS</p>
                <Button text="Play Now" icon={Icon.largeStars} isLeft={true} />
            </section>

            <footer className="flex gap-4 p-8">
                <Button icon={Icon.cogs} />
                <Button icon={Icon.info} />
                <Button text="Give us a Star" icon={Icon.github} isLeft={true} />
            </footer>
        </div>
    );
}
