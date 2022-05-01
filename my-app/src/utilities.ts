import { useEffect, useState } from "react";

export const BaseUrl = "https://grapevine-node-server.herokuapp.com/api";

export const formatDate = (date: Date) => {
    const day = date.toLocaleString('default', { day: '2-digit' });
    const month = date.toLocaleString('default', { month: 'short' });

    return `${day} ${month}`;
}

/** Array of `ViewportType` values */
export const viewportTypes = ["s", "m", "l", "xl", "xxl", "xxxl"] as const;

// Viewport sizes. No, we shouldn't just use the "Size" above
// as it's overloaded and there's no reason to believe
// that six variations of each means that they're the same now or in the future.
// Also notice that the design spec for viewports starts with "small" and not "extra-small"
// which is mirrored here.
export type ViewportType = typeof viewportTypes[number];

export type PerViewport<T> = { readonly [key in ViewportType]: T };

type ViewPortBounds = PerViewport<number>;

const viewportWidthMin: ViewPortBounds = {
    s: 0,
    m: 480,
    l: 640,
    xl: 1024,
    xxl: 1366,
    xxxl: 1920,
};

const viewportWidthMax: ViewPortBounds = {
    s: viewportWidthMin.m - 1,
    m: viewportWidthMin.l - 1,
    l: viewportWidthMin.xl - 1,
    xl: viewportWidthMin.xxl - 1,
    xxl: viewportWidthMin.xxxl - 1,
    xxxl: Number.MAX_SAFE_INTEGER,
};


const getWindowDimensions = (): ViewportType => {
    const { innerWidth } = window;
    return viewportTypes.find(v => viewportWidthMin[v] >= innerWidth && innerWidth <= viewportWidthMax[v]) || "xxxl";
}

export default function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}