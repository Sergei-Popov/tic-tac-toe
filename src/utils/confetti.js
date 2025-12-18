import confetti from "canvas-confetti";

// Пастельные цвета для конфетти
const pastelColors = [
  "#FFB6C1", // pastel pink
  "#E6E6FA", // lavender
  "#FFDAB9", // peach
  "#98FF98", // mint
  "#DDA0DD", // plum
  "#F0E68C", // khaki light
  "#B0E0E6", // powder blue
];

// Базовое конфетти при победе
export const fireConfetti = () => {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  const randomInRange = (min, max) => Math.random() * (max - min) + min;

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    // Левая сторона
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: pastelColors,
    });

    // Правая сторона
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: pastelColors,
    });
  }, 250);
};

// Звезды при победе
export const fireStars = () => {
  const defaults = {
    spread: 360,
    ticks: 100,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    colors: ["#FFD700", "#FFA500", "#FF6347", "#FFB6C1", "#E6E6FA"],
    shapes: ["star"],
    scalar: 1.2,
  };

  const shoot = () => {
    confetti({
      ...defaults,
      particleCount: 40,
      origin: { x: 0.5, y: 0.5 },
    });
  };

  setTimeout(shoot, 0);
  setTimeout(shoot, 200);
  setTimeout(shoot, 400);
};

// Сердечки
export const fireHearts = () => {
  const heartShape = confetti.shapeFromPath({
    path: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
    matrix: [0.05, 0, 0, 0.05, -0.5, -0.5],
  });

  confetti({
    shapes: [heartShape],
    particleCount: 50,
    spread: 100,
    origin: { y: 0.6 },
    colors: ["#FFB6C1", "#FF69B4", "#FF1493", "#DB7093", "#FFC0CB"],
    scalar: 2,
    ticks: 200,
  });
};

// Комбинация всех эффектов
export const celebrateWin = () => {
  fireConfetti();
  setTimeout(() => fireStars(), 500);
  setTimeout(() => fireHearts(), 1000);
};

// Мягкий эффект для ничьей
export const softConfetti = () => {
  confetti({
    particleCount: 30,
    spread: 70,
    origin: { y: 0.6 },
    colors: pastelColors,
    ticks: 100,
    gravity: 1.2,
  });
};
