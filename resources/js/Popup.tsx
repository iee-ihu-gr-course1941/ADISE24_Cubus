import { PropsWithChildren } from "react";
import { Button } from "./Inputs/Button";
import { Icon } from "./Icons/SVG";
import { create } from "zustand";

type PopupDetails = PropsWithChildren<{
    title?: string;
    showExit?: boolean;
    confirmText?: string;
    cancelText?: string;
    confirmCallback?: () => void;
    cancelCallback?: () => void;
}>;

type PopupType = 'mock-login';

type PopupState = {
    popup?: PopupType;
    popupDetails?: PopupDetails;
    showPopup: (title: PopupType, details: PopupDetails) => void;
    hidePopup: () => void;
}

export const usePopup = create<PopupState>((set) => ({
    popup: undefined,
    popupDetails: { showExit: true },
    showPopup: (popup, details) => set({popup, popupDetails: details}),
    hidePopup: () =>  set({popup: undefined, }),
}));

export function PopupContainer() {
    const { popup, popupDetails, hidePopup } = usePopup();

    function onCancelCallbackStrict(event: React.MouseEvent) {
        if(event.target !== event.currentTarget) return;

        if(popupDetails?.cancelCallback) popupDetails?.cancelCallback();
        hidePopup();
    }

    function onCancelCallback() {
        if(popupDetails?.cancelCallback) popupDetails?.cancelCallback();
        hidePopup();
    }

    function onConfirmCallback() {
        if(popupDetails?.confirmCallback) popupDetails?.confirmCallback();
        hidePopup();
    }

    if(popup == null) return;

    return (
        <div className="fixed inset-0 bg-black/75 pt-[128px]" onClick={onCancelCallbackStrict}>
            <div className="
                relative left-1/2 -translate-x-1/2

                w-fit min-w-[200px]
                rounded-[40px]
                text-bold text-custom-gray-400

                py-2

                border-t
                border-b-2
                bg-light-default-bottom border-t-custom-gray-700 border-b-custom-gray-800
                ">
                <header className="pl-[24px] pr-[16px] py-[8px] h-[62px] min-w-[300px] flex items-center">
                    <div>
                        { popupDetails?.title?.length !== 0 && <p className="font-bold text-custom-pink-50 px-4">{popupDetails?.title}</p> }
                    </div>
                    <div className="ml-auto">
                        { popupDetails?.showExit && <Button icon={Icon.xmark} color="red" onClick={onCancelCallback} /> }
                    </div>
                </header>

                <section>
                </section>

                <footer className="py-[14px] px-[12px] h-[64px] flex justify-end gap-[12px]">
                    { popupDetails?.cancelText && popupDetails?.cancelText?.length !== 0 &&
                        <Button icon={Icon.xmark} text={popupDetails?.cancelText} color="red" onClick={onCancelCallback} />
                    }
                    { popupDetails?.confirmText && popupDetails?.confirmText?.length !== 0 &&
                        <Button icon={Icon.check} text={popupDetails?.confirmText} onClick={onConfirmCallback} />
                    }
                </footer>
            </div>
        </div>
    );
}
