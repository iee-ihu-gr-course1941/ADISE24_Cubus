import { Config } from 'ziggy-js';

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    ziggy: Config & { location: string },
    flash: string,
};
