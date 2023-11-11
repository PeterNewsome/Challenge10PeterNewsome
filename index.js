// index.js
const fs = require('fs');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const ask = (query) => new Promise(resolve => readline.question(query, resolve));

const validateInput = (input, type) => {
    if (type === 'text' && input.length <= 3) return true;
    if (type === 'color' && (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)|^[a-zA-Z]+$/i).test(input)) return true;
    if (type === 'shape' && ['circle', 'triangle', 'square'].includes(input)) return true;
    return false;
};

const createShape = (shape, color, draw) => {
    switch (shape) {
        case 'circle':
            draw.circle(100).fill(color).move(100, 50);
            break;
        case 'triangle':
            draw.polygon('100,50 50,150 150,150').fill(color);
            break;
        case 'square':
            draw.rect(100, 100).fill(color).move(50, 50);
            break;
    }
};

const main = async () => {
    let text, textColor, shape, shapeColor;

    do {
        text = await ask('Enter up to three characters: ');
    } while (!validateInput(text, 'text'));

    do {
        textColor = await ask('Enter text color (keyword or hex): ');
    } while (!validateInput(textColor, 'color'));

    do {
        shape = await ask('Choose a shape (circle, triangle, square): ');
    } while (!validateInput(shape, 'shape'));

    do {
        shapeColor = await ask('Enter shape color (keyword or hex): ');
    } while (!validateInput(shapeColor, 'color'));

    readline.close();

    // Dynamic import for svgdom
    const { createSVGWindow } = await import('svgdom');
    const window = createSVGWindow();
    const document = window.document;

    // Dynamic import for @svgdotjs/svg.js
    const { SVG, registerWindow } = await import('@svgdotjs/svg.js');
    registerWindow(window, document);

    const canvas = SVG(document.documentElement);
    createShape(shape, shapeColor, canvas);
    canvas.text(text).fill(textColor).move(120, 80);

    fs.writeFileSync('logo.svg', canvas.svg());
    console.log('Generated logo.svg');
};

main().catch(err => console.error(err));