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
                    800: '#232326',
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
            },
            backgroundImage: {
                'radio-default-inner': 'radial-gradient(150% 100% ellipse at top, #000000 0%, #1B191F 39%)',
                'light-default-bottom': 'radial-gradient(150% 100% ellipse at bottom, #2D2937 0%, #1B191F 39%)',
                'bright-default-bottom': 'radial-gradient(150% 100% ellipse at bottom, #8E6FED 0%, #6330EF 52%)',
                'light-red-bottom': 'radial-gradient(150% 100% ellipse at bottom, #33031B 0%, #1B191F 39%)',
                'bright-red-bottom': 'radial-gradient(150% 100% ellipse at bottom, #BF3079 0%, #742327 52%)',
                'backdrop': 'radial-gradient(50% 50%, #EB5AF660, transparent), radial-gradient(100% 100% ellipse at bottom left, #6330EF80, #000000A0 80%), linear-gradient(to top, #000, #01092A)',
            },
            boxShadow: {
                'button-default': '0 0 8px 0 #8960F945',
                'button-default-hover': '0 0 0 4px #6330EF40',
                'button-red': '0 0 8px 0 #74232745',
                'button-red-hover': '0 0 0 4px #BF307940'
            }
        },
    },

    plugins: [forms],
};
