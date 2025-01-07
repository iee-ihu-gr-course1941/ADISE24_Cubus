import React from "react";

type TextInputProps = {
    placeholder?: string;
    defaultValue?: string;
    maxWidth?: string;
    onUpdate?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};

export function TextInput({placeholder, defaultValue, maxWidth, onUpdate}: TextInputProps) {
    return (
        <input
            className="
                px-0 pt-2 pb-3 w-fill

                placeholder:font-bold placeholder:text-custom-gray-700
                font-bold text-custom-gray-400

                bg-transparent focus:outline-none focus:shadow-[none] focus:ring-transparent
                border-x-0 border-t-0 border-b-2 focus:border-b-3 border-solid border-b-custom-gray-700
                hover:border-b-custom-magenta-500 focus:border-b-custom-magenta-400
            "
            style={{ maxWidth: maxWidth ?? '' }}
            placeholder={placeholder}
            defaultValue={defaultValue}
            onKeyUp={onUpdate} />
    );
}
