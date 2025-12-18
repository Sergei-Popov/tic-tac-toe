// Утилиты для работы с Telegram Mini App

let telegramApp = null;

// Токен бота из переменных окружения
const BOT_TOKEN = import.meta.env.VITE_BOT_TOKEN || null;

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
      // Извлекаем user_id из initData для отправки сообщений
      userId: extractUserId(launchParams),
    };

    console.log("Telegram Mini App initialized:", {
      isAvailable: true,
      userId: telegramApp.userId,
      platform: launchParams?.platform,
      botTokenConfigured: !!BOT_TOKEN,
    });

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
    telegramApp = { isAvailable: false, userId: null };
    return telegramApp;
  }
};

// Извлечение user_id из initData
const extractUserId = (launchParams) => {
  try {
    // initData содержит user в формате: user=%7B%22id%22%3A123456...
    const initData = launchParams?.initDataRaw;
    if (!initData) return null;

    const params = new URLSearchParams(initData);
    const userJson = params.get("user");
    if (!userJson) return null;

    const user = JSON.parse(decodeURIComponent(userJson));
    return user?.id || null;
  } catch (e) {
    console.log("Error extracting user_id:", e);
    return null;
  }
};

// Отправка сообщения напрямую через Telegram Bot API
const sendMessageToUser = async (message) => {
  if (!BOT_TOKEN) {
    console.warn(
      "⚠️ VITE_BOT_TOKEN не настроен. Добавьте токен бота в .env файл",
    );
    console.log("📤 Сообщение для отправки:", message);
    return false;
  }

  if (!telegramApp?.userId) {
    console.warn("⚠️ User ID не доступен. Приложение запущено вне Telegram?");
    console.log("📤 Сообщение для отправки:", message);
    return false;
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: telegramApp.userId,
          text: message,
          parse_mode: "HTML",
        }),
      },
    );

    const result = await response.json();

    if (!result.ok) {
      console.error("Telegram API error:", result.description);
      return false;
    }

    console.log("✅ Сообщение отправлено:", message);
    return true;
  } catch (error) {
    console.error("Error sending message:", error);
    return false;
  }
};

// Отправка сообщения о победе
export const sendWinMessage = async (promoCode) => {
  const message = `🎉 <b>Победа!</b>\n\nВаш промокод на скидку:\n<code>${promoCode}</code>\n\nСкопируйте и используйте при заказе!`;
  return sendMessageToUser(message);
};

// Отправка сообщения о проигрыше
export const sendLoseMessage = async () => {
  const message = `😔 <b>Проигрыш</b>\n\nНе расстраивайтесь! Попробуйте ещё раз и получите промокод на скидку! 🎁`;
  return sendMessageToUser(message);
};

// Отправка сообщения о ничьей
export const sendDrawMessage = async () => {
  const message = `🤝 <b>Ничья!</b>\n\nОтличная партия! Сыграйте ещё раз, чтобы получить промокод! 🎁`;
  return sendMessageToUser(message);
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
