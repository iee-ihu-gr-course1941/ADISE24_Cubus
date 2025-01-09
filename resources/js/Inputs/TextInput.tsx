import { Icon, SVG } from "@/Icons/SVG";
import React from "react";

type TextInputProps = {
    placeholder?: string;
    defaultValue?: string;
    maxWidth?: string;
    error?: string;
    onUpdate?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};

export function TextInput({placeholder, defaultValue, maxWidth, error, onUpdate}: TextInputProps) {

    return (
        <div className="flex flex-col gap-4">
            <input
                className={`
                    px-0 pt-2 pb-3 w-fill

                    placeholder:font-bold placeholder:text-custom-gray-700
                    font-bold ${ !error ? 'text-custom-gray-400' : 'text-red-400' }

                    bg-transparent focus:outline-none focus:shadow-[none] focus:ring-transparent
                    border-x-0 border-t-0 border-b-2 focus:border-b-3 border-solid
                    ${
                        !error ?
                        'border-b-custom-gray-700 hover:border-b-custom-magenta-500 focus:border-b-custom-magenta-400' :
                        'border-b-custom-brown-600 hover:border-b-custom-brown-500 focus:border-b-custom-brown-500'
                    }

                    transition-colors
                `}
                style={{ maxWidth: maxWidth ?? '' }}
                placeholder={placeholder}
                defaultValue={defaultValue}
                onKeyUp={onUpdate} />

                { error && (
                <div className="flex items-center gap-4 rounded-full border border-red-400 bg-red-950 px-4 py-1">
                    <SVG icon={Icon.infoCircle} fill="fill-red-400" />
                    <p className="text-red-400 whitespace-pre-line">{error}</p>
                </div>
                )}
        </div>
    );
}
