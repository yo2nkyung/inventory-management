import type { Config } from 'tailwindcss';
import { createThemes } from "tw-colors";
import colors from "tailwindcss/colors";

const baseColors = [
    "gray",
    "red",
    "yellow",
    "green",
    "blue",
    "indigo",
    "purple",
    "pink",
];

const shadeMapping = {
    "50": "900",
    "100": "800",
    "200": "700",
    "300": "600",
    "400": "500",
    "500": "400",
    "600": "300",
    "700": "200",
    "800": "100",
    "900": "50",
};

type ThemeColors = Record<string, Record<string, string>>;
type ShadeMapping = Record<string, string>;

const generateThemeObject = (
    palette: ThemeColors,
    mapping: ShadeMapping,
    invert = false
) => {
    const theme: ThemeColors = {};
    baseColors.forEach((color) => {
        theme[color] = {};
        Object.entries(mapping).forEach(([key, value]) => {
            const shadeKey = invert ? value : key;
            theme[color][key] = palette[color][shadeKey];
        });
    });
    return theme;
}

const lightTheme = generateThemeObject(colors as unknown as ThemeColors, shadeMapping);
const darkTheme = generateThemeObject(
    colors as unknown as ThemeColors,
    shadeMapping,
    true
);

const themes = {
    light: {
        ...lightTheme,
        white: "#FFFFFF",
    },
    dark: {
        ...darkTheme,
        white: colors.gray["950"],
        black: colors.gray["50"]
    }
}

const config: Config = {
    darkMode: "class",
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        // "./dashboard/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
        },
    },
    plugins: [createThemes(themes)],
};

export default config;
