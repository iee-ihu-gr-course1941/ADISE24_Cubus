import { PropsWithChildren } from "react";

export default function Base({ className, children }: PropsWithChildren<{ className?: string }>) {
    return (
        <div className="w-screen h-screen bg-backdrop relative overflow-hidden animate-show">
            <div className="absolute z-50 w-screen h-screen pointer-events-none bg-[url('/ui-backdrop/noise.jpg')] opacity-[11%] scale-105 animate-noise"></div>
            <div className="absolute z-50 w-screen h-screen pointer-events-none bg-[url('/ui-backdrop/noise.jpg')] opacity-[5%] scale-105 animate-noise-alt"></div>
            <div className={`relative z-10 w-screen h-screen text-custom-gray-400 font-bold ${className}`}>
                {children}
            </div>

            <div className="fixed inset-0">
                <div>
                    <div className="absolute top-[10%] left-[20%] w-[2px] h-[2px] rounded-full bg-white animate-pulse-slow"></div>
                    <div className="absolute top-[25%] left-[10%] w-[3px] h-[3px] rounded-full bg-white animate-pulse"></div>
                    <div className="absolute top-[30%] left-[40%] w-[2px] h-[2px] rounded-full bg-white animate-pulse-fast"></div>
                    <div className="absolute top-[32%] left-[41%] w-[2px] h-[2px] rounded-full bg-white animate-pulse-slow"></div>
                    <div className="absolute top-[5%] right-[30%] w-[4px] h-[4px] rounded-full bg-white animate-pulse"></div>
                    <div className="absolute top-[15%] right-[15%] w-[1px] h-[1px] rounded-full bg-white animate-pulse-slower"></div>
                </div>

                <img src="/ui-backdrop/nebula.svg" className="absolute w-[4000px] -bottom-[22%] -left-[10%]" />
                <img src="/ui-backdrop/nebula-side.svg" className="absolute w-2/3 bottom-[22%] -right-[20%]" />
                <img src="/ui-backdrop/rock-formation.svg" className="absolute w-1/2 bottom-0 -right-[30px] animate-ground-hover" />
                <img src="/ui-backdrop/asteroid.svg" className="absolute w-[200px] bottom-[60%] right-[10%] animate-asteroid-hover" />
            </div>
        </div>
    );
}
