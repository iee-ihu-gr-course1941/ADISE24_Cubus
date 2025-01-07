import { PropsWithChildren } from "react";
import { Button } from "./Inputs/Button";
import { Icon, SVG } from "./Icons/SVG";
import { create } from "zustand";
import { TextInput } from "./Inputs/TextInput";
import { Portrait } from "./Icons/Portrait";
import { RadioButton } from "./Inputs/RadioButton";

type PopupDetails = PropsWithChildren<{
    title?: string;
    showExit?: boolean;
}>;

type PopupType = 'mock-login' | 'credits' | 'user-settings' | 'lobby-settings';

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
                        { popupDetails?.showExit == true && <Button icon={Icon.xmark} color="red" onClick={() => hidePopup()} /> }
                    </div>
                </header>

                    { popup === 'mock-login' && <PopupMockLogin /> }
                    { popup === 'credits' && <PopupCredits /> }
                    { popup === 'user-settings' && <PopupUserSettings /> }
                    { popup === 'lobby-settings' && <PopupLobbySettings /> }

            </div>
        </div>
    );
}

function PopupMockLogin() {

    return (
        <>
            <div className="max-w-[600px] px-6 pt-2 pb-4">
                <div className="flex items-center gap-2 rounded-full border border-custom-purple-400 bg-custom-purple-600 px-2 py-1">
                    <SVG icon={Icon.infoCircle} fill="fill-custom-pink-50" />
                    <p className="text-custom-pink-50">This is meant for testing purposes only.</p>
                </div>

                <div className="pt-12 pb-6 flex flex-col gap-1">
                    <label className="text-custom-pink-50">Mock ID</label>
                    <TextInput maxWidth='100%' placeholder="Mock ID" />
                </div>

                <p className="pb-2">You can use whatever id you want.</p>
                <p>If a user with that mock id doesn't exist it will create a new user, otherwise it will connect you to an existing one.</p>
            </div>

            <footer className="py-4 px-6 flex justify-end gap-[12px]">
                <Button icon={Icon.check} text="Confirm" />
            </footer>
        </>
    );
}

function PopupCredits() {
    return (
        <div className="w-[540px] px-6 pt-2 pb-4">
            <p className="text-custom-pink-50">CUBUS was made as a project for the course ADISE.</p>
            <p>The team thanks you for trying the game out.</p>

            <p className="pt-4 pb-2 text-custom-pink-50">Lead Developers</p>
            <p className="pb-1">Tryfonas Mazarakis</p>
            <p className="pb-1">Pandeli Bezolli</p>

            <p className="pt-4 pb-2 text-custom-pink-50">2D Artists</p>
            <p className="pb-1">Tryfonas Mazarakis</p>
            <p className="pb-1">Pandeli Bezolli</p>

            <p className="pt-4 pb-2 text-custom-pink-50">3D Artists</p>
            <p className="pb-1">Tryfonas Mazarakis</p>

            <p className="pt-4 pb-2 text-custom-pink-50">Music and Sound Effects</p>
            <p className="pb-1">Pandeli Bezolli</p>

        </div>
    );
}

function PopupUserSettings() {
    // WARN: THE ICONS ARE MANUALLY INSERTED & VISIBLE IN THIS LIST
    // This is required to not unintentionally leak public icons, although it would be really nice to have a way to grab all these icons beforehand.

    const icons = [
        'black-elegance.jpg',
        'black-mlady.jpg',
        'white-cowboy.jpg',
        'white-wizard.jpg',
        'yellow-elegance.jpg',
        'yellow-mlady.jpg',
    ];

    return (
        <>
            <div className="max-w-[600px] px-6 pt-2 pb-4">
                <div className="pb-6 flex flex-col gap-1">
                    <label className="pb-1 text-custom-pink-50">Your Username</label>
                    <TextInput maxWidth='100%' placeholder="best_cubus_player" />
                </div>

                <div className="pb-6 flex flex-col gap-1">
                    <label className="pb-1 text-custom-pink-50">Your Icon</label>
                    <div className="grid grid-cols-3 gap-4">
                        {
                            icons.map(icon => (
                                <button><Portrait key="icon" url={'/portraits/' + icon} /></button>
                            ))
                        }
                    </div>
                </div>
            </div>

            <footer className="py-4 px-6 flex justify-end gap-[12px]">
                <Button icon={Icon.check} text="Confirm" />
            </footer>
        </>
    );
}

function PopupLobbySettings() {
    return (
        <>
            <div className="w-[550px] px-6 pt-2 pb-4">
                <div className="pb-6 flex flex-col gap-1">
                    <label className="pb-1 text-custom-pink-50">Lobby's Name</label>
                    <TextInput maxWidth='100%' placeholder="Friends only" />
                </div>

                <div className="pb-6 flex flex-col gap-2">
                    <label className="pb-2 text-custom-pink-50">Player Count</label>
                    <div className="flex gap-4">
                        <RadioButton name="player-count" value="2" checked={true} label="2 Players" />
                        <RadioButton name="player-count" value="4" label="4 Players" />
                    </div>
                </div>
            </div>

            <footer className="py-4 px-6 flex justify-end gap-[12px]">
                <Button icon={Icon.check} text="Confirm" />
            </footer>
        </>
    );
}
