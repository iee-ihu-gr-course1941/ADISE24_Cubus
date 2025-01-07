import React, { Fragment, PropsWithChildren } from "react";

type ListProps = PropsWithChildren<{
    title?: string;
    className?: string;
    maxListHeight?: string;
    onClick?: (value: string) => void;
}>;

export function List({title = '', maxListHeight, className, children, onClick}: ListProps) {
    return (
        <div className={`
            w-fit min-w-[200px]
            rounded-[20px]
            text-bold text-custom-gray-400

            py-3.5

            border-t
            border-b-2
            bg-light-default-bottom border-t-custom-gray-700 border-b-custom-gray-800
            ${className}
            `}>
            { title.length !== 0 && <p className="font-bold text-custom-pink-50 px-8 pb-3.5 pb-2 border-b border-b-custom-gray-400">{title}</p> }
            <ul className={`flex flex-col justify-stretch overflow-y-auto`} style={{ maxHeight: maxListHeight}}>
                {
                    children && React.Children.map(children, child => ListRow({child, onClick}))
                }
            </ul>
        </div>
    );
}

type ListElementProps = PropsWithChildren<{ value?: string }>;

export function ListElement({ value, children }: ListElementProps) {
    return <Fragment>{children}</Fragment>;
}

type ListRowProps = {
    child?: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined;
    onClick?: (value: string) => void;
};

function ListRow({onClick, child}: ListRowProps) {
    if(!React.isValidElement(child) || !onClick) return child;
    return (
        <button
            className="flex cursor-pointer border-b border-b-custom-gray-700 last:border-b-0"
            onClick={() => onClick(child.props?.value || '')}>
            {child}
        </button>
    );
}
