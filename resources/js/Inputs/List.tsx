import { AudioManager } from "@/AudioManager";
import React, { Fragment, PropsWithChildren } from "react";

type ListProps = PropsWithChildren<{
    title?: string;
    emptyText?: string;
    className?: string;
    maxListHeight?: string;
    onClick?: (value: string) => void;
}>;

export function List({title = '', emptyText = '', maxListHeight, className, children, onClick}: ListProps) {
    return (
        <div className={`
            min-w-[200px]
            rounded-[20px]
            text-bold text-custom-gray-400

            py-3.5

            border-t
            border-b-2
            bg-light-default-bottom border-t-custom-gray-700 border-b-custom-gray-800
            ${className}
            `}>
            { title.length !== 0 && <p className="font-bold text-custom-pink-50 px-8 pb-3.5 border-b border-b-custom-gray-400">{title}</p> }
            <ul className="h-full flex flex-col justify-stretch overflow-y-auto" style={{ maxHeight: maxListHeight}}>
                {
                    children && React.Children.map(children, child => ListRow({child, onClick}))
                }

                {
                    children == null && (
                        <div className="w-full h-full flex items-center justify-center">{emptyText}</div>
                    )
                }
            </ul>
        </div>
    );
}

type ListElementProps = PropsWithChildren<{ value?: string }>;

export function ListElement({ children }: ListElementProps) {
    return <Fragment>{children}</Fragment>;
}

type ListRowProps = {
    child?: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined;
    onClick?: (value: string) => void;
};

function ListRow({onClick, child}: ListRowProps) {
    const AudioInterface = AudioManager.getInstance();

    function onMouseClick() {
        AudioInterface.play('click', false);
        if(onClick && child && (child as React.ReactElement).props != null) onClick((child as React.ReactElement).props.value || '');
    }

    if(!React.isValidElement(child) || !onClick) return child;
    return (
        <button
            className="flex cursor-pointer border-b border-b-custom-gray-700 last:border-b-0"
            onMouseEnter={() => AudioInterface.play('hover', false)}
            onClick={onMouseClick}>
            {child}
        </button>
    );
}
