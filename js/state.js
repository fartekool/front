// Глобальное состояние приложения
let currentUser = null;
let chats = JSON.parse(localStorage.getItem('admin_chats')) || [];
let currentChatId = null;

