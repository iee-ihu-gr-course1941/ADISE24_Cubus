const SOUNDS = {
    'play': '/audio/play.wav',
    'block-pickup': '/audio/block-pickup.flac',
    'airship-engines': '/audio/airship-engines.wav',
    'airship-ping': '/audio/airship-ping.flac',
    'win': '/audio/win.wav',
    'hover': '/audio/button-hover.wav',
    'chimes-starry': '/audio/chimes-starry.flac',
    'chimes-success': '/audio/chimes-success.mp3',
    'click': '/audio/click.wav',

    'soundtrack-lobby': '/audio/AvapXia-Skybound.mp3',
    'soundtrack-gameplay': '/audio/Xennial-The_Next_Level.mp3',
} as const;

export type Sounds = keyof typeof SOUNDS;

type SoundInterfaces = { [Property in Sounds]?: HTMLAudioElement };

export class AudioManager {
    private static instance: AudioManager;
    private audioInterfaces: SoundInterfaces;
    private volume: number;

    private constructor() {
        console.info(`[AudioManager] Preparing to load a total of (${Object.keys(SOUNDS).length}) sounds: `, SOUNDS);
        this.audioInterfaces = {};
        this.volume = 0.4;

        for(const [name, file] of Object.entries(SOUNDS)) {
            let audioElement = new Audio(file);
            audioElement.load();
            this.audioInterfaces[name as Sounds] = audioElement;
        }
    }

    public static getInstance() {
        if(!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
            console.info('[AudioManager] Instance created:', AudioManager.instance);
        }

        return AudioManager.instance;
    }

    public setVolume(newVolume: number) {
        this.volume = newVolume;
    }

    public play(name: Sounds, loop: boolean, endCallback?: () => void) {
        console.log('[AudioManager] this:', this);

        if(!this.audioInterfaces[name]) return;
        console.info('[AudioManager] Playing sound:', name, { loop, endCallback: endCallback != null}, 'from interface:', this.audioInterfaces[name]);

        this.audioInterfaces[name].volume = this.volume;
        this.audioInterfaces[name].loop = loop;
        this.audioInterfaces[name].play();

        this.audioInterfaces[name].onended = () => {
            this.audioInterfaces[name]!.onended = null;
            if(endCallback != null) endCallback();
        };
    }
}
