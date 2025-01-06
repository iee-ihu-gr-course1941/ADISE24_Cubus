import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['"Space Grotesk"', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                'custom-gray': {
                    400: '#A897A8',
                    700: '#4E454E',
                },
                'custom-pink': {
                    50: '#FBEDFB',
                    100: '#FFCBFF',
                    600: '#BF3079',
                },
                'custom-magenta': {
                    400: '#EB5AF6',
                    500: '#B638F7',
                },
                'custom-purple': {
                    400: '#6330EF',
                    600: '#301985',
                    800: '#01092A',
                },
                'custom-brown': {
                    500: '#742327',
                    600: '#67322D',
                },
            }
        },
    },

    plugins: [forms],
};
