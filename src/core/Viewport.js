export default class Viewport {
    constructor() {
        this.height = window.innerHeight;
        this.width = window.innerWidth;

        // start:CANVAS
        const CANVAS = document.createElement('canvas');
        CANVAS.height = this.height;
        CANVAS.width = this.width;

        CANVAS.style.position = 'absolute';
        CANVAS.style.top = '0px';
        CANVAS.style.left = '0px';
        document.body.appendChild(CANVAS);
        const CONTEXT = CANVAS.getContext('2d');
        // end:CANVAS

        const onResize = () => {
            this.height = window.innerHeight;
            this.width = window.innerWidth;

            CANVAS.height = this.height;
            CANVAS.width = this.width;
        }

        window.onresize = onResize

        this.renderFrame = (image) => {
            const tempCanvas = new OffscreenCanvas(image.width, image.height);
            const tempContext = tempCanvas.getContext('2d');

            tempContext.putImageData(image, 0, 0, 0, 0, image.width, image.height);
            tempContext.scale(this.width / image.width, this.height / image.height);

            CONTEXT.clearRect(0, 0, this.width, this.height);
            CONTEXT.drawImage(tempCanvas, 0, 0, this.width, this.height);
        }
    }
}