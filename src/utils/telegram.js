// Утилиты для работы с Telegram Mini App

let telegramApp = null;

// Инициализация Telegram SDK
export const initTelegram = async () => {
  try {
    const { init, retrieveLaunchParams, postEvent } = await import(
      "@telegram-apps/sdk"
    );

    // Инициализируем SDK
    init();

    // Получаем параметры запуска
    const launchParams = retrieveLaunchParams();

    telegramApp = {
      launchParams,
      postEvent,
      isAvailable: true,
    };

    // Разворачиваем Mini App на весь экран
    try {
      postEvent("web_app_expand");
    } catch (e) {
      console.log("Expand not available");
    }

    // Устанавливаем цвет header
    try {
      postEvent("web_app_set_header_color", { color: "#FFF9F5" });
    } catch (e) {
      console.log("Header color not available");
    }

    // Устанавливаем цвет background
    try {
      postEvent("web_app_set_background_color", { color: "#FFF9F5" });
    } catch (e) {
      console.log("Background color not available");
    }

    return telegramApp;
  } catch (error) {
    console.log("Telegram SDK not available:", error);
    telegramApp = { isAvailable: false };
    return telegramApp;
  }
};

// Отправка данных в бот
export const sendDataToBot = async (data) => {
  if (!telegramApp?.isAvailable) {
    console.log("Telegram not available, data:", data);
    return false;
  }

  try {
    telegramApp.postEvent("web_app_send_data", {
      data: JSON.stringify(data),
    });
    return true;
  } catch (error) {
    console.error("Error sending data to bot:", error);
    return false;
  }
};

// Отправка сообщения о победе
export const sendWinMessage = async (promoCode) => {
  const data = {
    type: "game_result",
    result: "win",
    message: `Победа! Промокод выдан: ${promoCode}`,
    promoCode,
    timestamp: Date.now(),
  };

  return sendDataToBot(data);
};

// Отправка сообщения о проигрыше
export const sendLoseMessage = async () => {
  const data = {
    type: "game_result",
    result: "lose",
    message: "Проигрыш",
    timestamp: Date.now(),
  };

  return sendDataToBot(data);
};

// Отправка сообщения о ничьей
export const sendDrawMessage = async () => {
  const data = {
    type: "game_result",
    result: "draw",
    message: "Ничья",
    timestamp: Date.now(),
  };

  return sendDataToBot(data);
};

// Haptic feedback
export const hapticFeedback = (type = "light") => {
  if (!telegramApp?.isAvailable) return;

  try {
    const impactTypes = {
      light: "light",
      medium: "medium",
      heavy: "heavy",
      rigid: "rigid",
      soft: "soft",
    };

    telegramApp.postEvent("web_app_trigger_haptic_feedback", {
      type: "impact",
      impact_style: impactTypes[type] || "light",
    });
  } catch (error) {
    console.log("Haptic feedback not available");
  }
};

// Notification feedback
export const notificationFeedback = (type = "success") => {
  if (!telegramApp?.isAvailable) return;

  try {
    telegramApp.postEvent("web_app_trigger_haptic_feedback", {
      type: "notification",
      notification_type: type, // success, warning, error
    });
  } catch (error) {
    console.log("Notification feedback not available");
  }
};

// Selection feedback
export const selectionFeedback = () => {
  if (!telegramApp?.isAvailable) return;

  try {
    telegramApp.postEvent("web_app_trigger_haptic_feedback", {
      type: "selection_change",
    });
  } catch (error) {
    console.log("Selection feedback not available");
  }
};

// Получение темы Telegram
export const getTelegramTheme = () => {
  if (!telegramApp?.isAvailable) return "light";

  try {
    const { themeParams } = telegramApp.launchParams || {};
    if (themeParams?.bg_color) {
      // Определяем тему по яркости фона
      const hex = themeParams.bg_color.replace("#", "");
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 128 ? "light" : "dark";
    }
  } catch (error) {
    console.log("Error getting theme:", error);
  }

  return "light";
};

// Проверка доступности Telegram
export const isTelegramAvailable = () => {
  return telegramApp?.isAvailable || false;
};

// Закрытие Mini App
export const closeMiniApp = () => {
  if (!telegramApp?.isAvailable) return;

  try {
    telegramApp.postEvent("web_app_close");
  } catch (error) {
    console.log("Close not available");
  }
};
