# Структура JavaScript файлов

## Порядок загрузки (важно!)

Файлы должны загружаться в следующем порядке:

1. **config.js** - Конфигурация (API_BASE_URL)
2. **state.js** - Глобальное состояние (currentUser, chats, currentChatId)
3. **utils.js** - Вспомогательные функции (formatDate, showPage, etc.)
4. **auth.js** - Функции авторизации (handleLogin, logout)
5. **chat.js** - Функции для работы с чатами (loadChatHistory, createNewChat, etc.)
6. **ai.js** - Генератор ответов ИИ (generateAdminAIResponse, copyResponse, etc.)
7. **main.js** - Инициализация приложения (должен быть последним!)

## Почему такой порядок?

- `config.js` и `state.js` должны быть первыми, так как они определяют переменные, используемые другими файлами
- `utils.js` содержит функции, используемые в других модулях
- `auth.js`, `chat.js`, `ai.js` зависят от предыдущих файлов
- `main.js` должен быть последним, так как он использует все предыдущие модули и инициализирует приложение

## Важные замечания

⚠️ **Все функции и переменные должны быть в глобальной области видимости**, так как:
- Они используются в HTML атрибутах (например, `onclick="deleteChat(...)"`)
- Они вызываются из разных модулей

✅ **Правильно:**
```javascript
function deleteChat(chatId, event) { ... }  // Глобальная функция
```

❌ **Неправильно:**
```javascript
const deleteChat = (chatId, event) => { ... }  // Не будет доступна в onclick
export function deleteChat(...) { ... }  // Модули ES6 не работают без сборки
```

## Как изменить API URL

Откройте `js/config.js` и измените `API_BASE_URL`:
```javascript
const API_BASE_URL = 'https://your-ngrok-url.ngrok-free.app';
```

