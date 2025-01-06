import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { AxiosInstance } from 'axios';
import { route as ziggyRoute } from 'ziggy-js';
import { PageProps as AppPageProps } from './';
import { Endpoints } from './constants';

declare global {
    interface Window {
       Echo: Echo,
    }

    interface Window {
        axios: AxiosInstance;
    }

    /* eslint-disable no-var */
    var route: (endpoint: Endpoints, data?: any) => string;
}

declare module '@inertiajs/core' {
    interface PageProps extends InertiaPageProps, AppPageProps {
        flash: string
    }
}
