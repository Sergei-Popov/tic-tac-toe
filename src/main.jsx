import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { initTelegram, getTelegramTheme } from "./utils/telegram";
import { useGameStore } from "./store/gameStore";

// Инициализация Telegram Mini App
initTelegram().then(() => {
  // Инициализируем тему из хранилища или Telegram
  const store = useGameStore.getState();
  const telegramTheme = getTelegramTheme();

  // Если тема не установлена, используем тему из Telegram
  if (!store.theme) {
    store.theme = telegramTheme;
  }

  // Применяем тему
  document.documentElement.setAttribute("data-theme", store.theme);
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
