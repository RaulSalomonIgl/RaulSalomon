import { useRef, useEffect } from "react";

const LetterGlitch = ({
  glitchColors = ["#5e4491", "#A476FF", "#241a38"],
  glitchSpeed = 33,
  centerVignette = false,
  outerVignette = false,
  smooth = true,
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const letters = useRef([]);
  const grid = useRef({ columns: 0, rows: 0 });
  const context = useRef(null);
  const lastGlitchTime = useRef(Date.now());

  const FONT_SIZE = 16;
  const CHAR_WIDTH = 10;
  const CHAR_HEIGHT = 20;
  const UPDATE_FRACTION = 0.05;
  
  const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>0123456789".split("");

  const getRandomChar = () => CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
  const getRandomColor = () => glitchColors[Math.floor(Math.random() * glitchColors.length)];

  const calculateGrid = (width, height) => ({
    columns: Math.ceil(width / CHAR_WIDTH),
    rows: Math.ceil(height / CHAR_HEIGHT),
  });

  const initializeLetters = (columns, rows) => {
    grid.current = { columns, rows };
    letters.current = Array.from({ length: columns * rows }, () => ({
      char: getRandomChar(),
      color: getRandomColor(),
      targetColor: getRandomColor(),
      colorProgress: 1,
    }));
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = window.devicePixelRatio || 1;
    const { width, height } = parent.getBoundingClientRect();
    
    Object.assign(canvas, { width: width * dpr, height: height * dpr });
    Object.assign(canvas.style, { width: `${width}px`, height: `${height}px` });

    context.current?.setTransform(dpr, 0, 0, dpr, 0, 0);
    initializeLetters(...Object.values(calculateGrid(width, height)));
    drawLetters();
  };

  const drawLetters = () => {
    const ctx = context.current;
    if (!ctx || !letters.current.length) return;
    
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.font = `${FONT_SIZE}px monospace`;
    ctx.textBaseline = "top";
    
    letters.current.forEach(({ char, color }, index) => {
      const x = (index % grid.current.columns) * CHAR_WIDTH;
      const y = Math.floor(index / grid.current.columns) * CHAR_HEIGHT;
      ctx.fillStyle = color;
      ctx.fillText(char, x, y);
    });
  };

  const updateLetters = () => {
    const updateCount = Math.max(1, Math.floor(letters.current.length * UPDATE_FRACTION));
    for (let i = 0; i < updateCount; i++) {
      const index = Math.floor(Math.random() * letters.current.length);
      Object.assign(letters.current[index], {
        char: getRandomChar(),
        targetColor: getRandomColor(),
        colorProgress: smooth ? 0 : 1,
      });
    }
  };

  const animate = () => {
    const now = Date.now();
    if (now - lastGlitchTime.current >= glitchSpeed) {
      updateLetters();
      drawLetters();
      lastGlitchTime.current = now;
    }
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    context.current = canvasRef.current?.getContext("2d");
    resizeCanvas();
    animate();
    
    const handleResize = () => {
      cancelAnimationFrame(animationRef.current);
      resizeCanvas();
      animate();
    };
    
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [glitchSpeed, smooth]);

  return (
    <div className="relative w-full h-full bg-[#101010] overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-full" />
      {outerVignette && (
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,_rgba(16,16,16,0)_60%,_rgba(16,16,16,1)_100%)]" />
      )}
      {centerVignette && (
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,_rgba(0,0,0,0.8)_0%,_rgba(0,0,0,0)_60%)]" />
      )}
    </div>
  );
};

export default LetterGlitch;
