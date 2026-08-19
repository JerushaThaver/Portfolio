document.addEventListener("DOMContentLoaded", () => {

    const interactiveText = document.querySelector(".interactive-text");
    const canvas = interactiveText?.querySelector(".text-canvas");
    const original = interactiveText?.querySelector(".text-original");

    if (!interactiveText || !canvas || !original) return;

    const ctx = canvas.getContext("2d");

    let characters = [];

    let mouse = {
        x: -1000,
        y: -1000
    };

    let targetMouse = {
        x: -1000,
        y: -1000
    };

    let animationFrame;
    let active = false;

    const CONFIG = {
        fontSize: 18,
        lineHeight: 1.8,

        influenceRadius: 90,
        pushStrength: 35,

        spring: 0.08,
        damping: 0.82,

        returnSpeed: 0.08
    };


    /* =========================================
       CANVAS SIZE
       ========================================= */

    function resizeCanvas() {

        const rect = interactiveText.getBoundingClientRect();

        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        canvas.style.width = rect.width + "px";
        canvas.style.height = rect.height + "px";

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        createCharacters();
    }


    /* =========================================
       CREATE CHARACTER POSITIONS
       ========================================= */

    function createCharacters() {

        characters = [];

        const rect = interactiveText.getBoundingClientRect();

        const paragraphs = original.querySelectorAll("p");

        /*
         * Get the actual font being used by your portfolio.
         */
        const sample = paragraphs[0];

        const style = window.getComputedStyle(sample);

        const fontSize = parseFloat(style.fontSize);
        const lineHeight = parseFloat(style.lineHeight);

        const fontFamily = style.fontFamily;
        const fontWeight = style.fontWeight;
        const letterSpacing = parseFloat(style.letterSpacing) || 0;

        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

        let currentY = 0;

        paragraphs.forEach((paragraph, paragraphIndex) => {

            const text = paragraph.textContent.trim();

            /*
             * Get paragraph position relative to article-text.
             */
            const paragraphRect = paragraph.getBoundingClientRect();

            const paragraphTop =
                paragraphRect.top -
                rect.top;

            const paragraphLeft =
                paragraphRect.left -
                rect.left;

            const paragraphWidth = paragraphRect.width;

            let x = paragraphLeft;
            let y = paragraphTop + fontSize;

            /*
             * Break text into individual characters.
             */
            for (let i = 0; i < text.length; i++) {

                const char = text[i];

                const width =
                    ctx.measureText(char).width +
                    letterSpacing;

                /*
                 * Wrap characters exactly according to
                 * the paragraph width.
                 */
                if (
                    char !== " " &&
                    x + width > paragraphLeft + paragraphWidth
                ) {

                    x = paragraphLeft;
                    y += lineHeight;

                }

                /*
                 * Spaces don't need to be rendered,
                 * but they still occupy width.
                 */
                if (char === " ") {

                    x += width;
                    continue;
                }

                characters.push({

                    char,

                    originalX: x,
                    originalY: y,

                    x: x,
                    y: y,

                    vx: 0,
                    vy: 0,

                    width,

                    rotation: 0,
                    targetRotation: 0

                });

                x += width;
            }

        });
    }


    /* =========================================
       MOUSE
       ========================================= */

    interactiveText.addEventListener("pointerenter", () => {

        active = true;

        interactiveText.classList.add("is-active");

    });


    interactiveText.addEventListener("pointerleave", () => {

        active = false;

        interactiveText.classList.remove("is-active");

        targetMouse.x = -1000;
        targetMouse.y = -1000;

    });


    interactiveText.addEventListener("pointermove", (event) => {

        const rect = interactiveText.getBoundingClientRect();

        targetMouse.x =
            event.clientX - rect.left;

        targetMouse.y =
            event.clientY - rect.top;

    });


    /* =========================================
       PHYSICS
       ========================================= */

    function updateCharacters() {

        mouse.x +=
            (targetMouse.x - mouse.x) * 0.15;

        mouse.y +=
            (targetMouse.y - mouse.y) * 0.15;


        characters.forEach(char => {

            const dx =
                char.x - mouse.x;

            const dy =
                char.y - mouse.y;

            const distance =
                Math.sqrt(dx * dx + dy * dy);

            /*
             * Cursor influence.
             */
            if (distance < CONFIG.influenceRadius) {

                const force =
                    1 -
                    distance / CONFIG.influenceRadius;

                /*
                 * Prevent division by zero.
                 */
                const safeDistance =
                    Math.max(distance, 1);

                const nx =
                    dx / safeDistance;

                const ny =
                    dy / safeDistance;

                /*
                 * Push the character away
                 * from the cursor.
                 */
                char.vx +=
                    nx *
                    force *
                    CONFIG.pushStrength;

                char.vy +=
                    ny *
                    force *
                    CONFIG.pushStrength;

                /*
                 * Rotate based on direction
                 * from cursor.
                 */
                char.targetRotation =
                    nx *
                    force *
                    0.5;

            } else {

                char.targetRotation = 0;

            }


            /*
             * Spring back toward original position.
             */
            char.vx +=
                (char.originalX - char.x) *
                CONFIG.spring;

            char.vy +=
                (char.originalY - char.y) *
                CONFIG.spring;


            /*
             * Damping.
             */
            char.vx *= CONFIG.damping;
            char.vy *= CONFIG.damping;


            /*
             * Position.
             */
            char.x += char.vx;
            char.y += char.vy;


            /*
             * Smooth rotation.
             */
            char.rotation +=
                (char.targetRotation - char.rotation) *
                0.12;

        });
    }


    /* =========================================
       DRAW
       ========================================= */

    function draw() {

        const rect =
            interactiveText.getBoundingClientRect();

        const style =
            window.getComputedStyle(
                original.querySelector("p")
            );

        const fontSize =
            parseFloat(style.fontSize);

        const fontFamily =
            style.fontFamily;

        const fontWeight =
            style.fontWeight;

        const letterSpacing =
            parseFloat(style.letterSpacing) || 0;

        ctx.clearRect(
            0,
            0,
            rect.width,
            rect.height
        );


        ctx.font =
            `${fontWeight} ${fontSize}px ${fontFamily}`;

        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";

        /*
         * Use the same text colour as the
         * original portfolio.
         */
        ctx.fillStyle =
            style.color;


        characters.forEach(char => {

            ctx.save();

            ctx.translate(
                char.x,
                char.y
            );

            ctx.rotate(
                char.rotation
            );

            ctx.fillText(
                char.char,
                0,
                0
            );

            ctx.restore();

        });

    }


    /* =========================================
       ANIMATION
       ========================================= */

    function animate() {

        updateCharacters();
        draw();

        animationFrame =
            requestAnimationFrame(animate);

    }


    /* =========================================
       INITIALISE
       ========================================= */

    resizeCanvas();

    window.addEventListener(
        "resize",
        resizeCanvas
    );

    animate();

});