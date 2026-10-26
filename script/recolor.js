// Recolours pixel-art templates with a team / driver colour (the "borderColor" in the JSON).
//
// Template convention: paint the recolourable parts in pure magenta rgb(255, 0, 255) and their
// shading in dark magenta rgb(128, 0, 128). Every other colour (skin, hair, black, white...) is kept.
//
// Usage: <img data-recolor="assets/templates/car.png" data-color="rgb(255, 128, 0)">
//        ...then call recolorAll(container) once the images are in the page.

const recolorCache = new Map();   // "src|color" -> Promise<dataURL>
const templateCache = new Map();  // src -> Promise<ImageData>

// magenta family: strong red + blue, hardly any green
const isTintPixel = (r, g, b) => r > 32 && b > 32 && g < Math.min(r, b) * 0.35 && Math.abs(r - b) < 48;

const loadTemplate = (src) => {
    if (!templateCache.has(src)) {
        templateCache.set(src, new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                    const ctx = canvas.getContext('2d', { willReadFrequently: true });
                    ctx.drawImage(img, 0, 0);
                    resolve(ctx.getImageData(0, 0, canvas.width, canvas.height));
                } catch (error) { reject(error); }  // e.g. the image is from another origin
            };
            img.onerror = () => reject(new Error(`cannot load ${src}`));
            img.src = src;
        }));
    }
    return templateCache.get(src);
};

const recolorImage = (src, color) => {
    const key = `${src}|${color}`;
    if (!recolorCache.has(key)) {
        recolorCache.set(key, loadTemplate(src).then(template => {
            const [tr, tg, tb] = color.match(/\d+/g).map(Number);
            const out = new ImageData(new Uint8ClampedArray(template.data), template.width, template.height);
            const px = out.data;
            for (let i = 0; i < px.length; i += 4) {
                if (px[i + 3] && isTintPixel(px[i], px[i + 1], px[i + 2])) {
                    const f = (px[i] + px[i + 2]) / 510;   // 1 for the base magenta, ~0.5 for the dark shade
                    px[i] = tr * f;
                    px[i + 1] = tg * f;
                    px[i + 2] = tb * f;
                }
            }
            const canvas = document.createElement('canvas');
            canvas.width = out.width;
            canvas.height = out.height;
            canvas.getContext('2d').putImageData(out, 0, 0);
            return canvas.toDataURL();
        }));
    }
    return recolorCache.get(key);
};

// Fills every <img data-recolor="..." data-color="..."> inside `root`
const recolorAll = (root = document) => Promise.all(
    [...root.querySelectorAll('img[data-recolor][data-color]')].map(async (img) => {
        try {
            img.src = await recolorImage(img.dataset.recolor, img.dataset.color);
        } catch (error) {
            console.error(`Could not recolour ${img.dataset.recolor}: ${error}`);
        }
    })
);
