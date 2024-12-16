type WrapperProps = {
    enabled?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
}
const IconWrapper = ({children, onClick,enabled}: WrapperProps) => {
    return (
        <div onClick={onClick} className={`p-2 bg-gray-300 rounded-xl pointer-events-auto ${!enabled ? 'cursor-not-allowed opacity-[0.4]' : ' hover:bg-gray-400 cursor-pointer'}`}>
            {children}
        </div>
    )
}

type Props = {
    onClick?: () => void;
    enabled?: boolean;
    color?: string;
}

export const RotateIcon = ({onClick, enabled, color = 'currentColor'}: Props) => {
    return (
        <IconWrapper enabled={enabled} onClick={onClick}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
        </IconWrapper>
    )
}

export const FlipIcon = ({onClick,enabled, color = 'currentColor'}: Props) => {
    return (
        <IconWrapper enabled={enabled} onClick={onClick}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
        </IconWrapper>
    )
}
