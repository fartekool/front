// изменим если будет другой порт
const API_BASE_URL = 'http://127.0.0.1:8000'; 

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginButton = document.getElementById('login-button');
    const loginMessage = document.getElementById('message');
    const loginView = document.getElementById('login-view');
    const chatView = document.getElementById('chat-view');
    const welcomeMessage = document.getElementById('welcome-message');

    // Обработчик отправки формы входа
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Останавливаем стандартное поведение формы (перезагрузку)
        window.history.replaceState({}, document.title, window.location.pathname);

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        loginButton.disabled = true;
        loginButton.textContent = 'Вход...';
        loginMessage.textContent = ''; // Очистка предыдущих ошибок

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Обработка ошибок бэкенда (например, 401 Unauthorized)
                const errorMessage = data.detail || 'Ошибка входа. Проверьте учетные данные.';
                throw new Error(errorMessage);
            }

            const { token, email: userEmail } = data;
            if (!token) throw new Error('Токен не получен.');

            // --- УСПЕШНЫЙ ВХОД ---
            
            // 1. Сохраняем токен и данные
            localStorage.setItem('authToken', token);
            
            // 2. Переключаем вид (SPA-стиль)
            loginView.style.display = 'none';
            chatView.style.display = 'block';
            
            // 3. Обновляем приветственное сообщение
            welcomeMessage.textContent = `Вы вошли как: ${userEmail}`;
            
            // 4. Оповещение (можно заменить на ваш toast)
            console.log(`Успешный вход, ${userEmail}! Токен: ${token}`);
            
            
        } catch (error) {
            // Вывод ошибки пользователю
            loginMessage.textContent = error.message;
            console.error('Ошибка:', error);
            
        } finally {
            loginButton.disabled = false;
            loginButton.textContent = 'Войти';
        }
    });
    
    // TODO: Добавить логику для кнопки отправки чата
    document.getElementById('send-button').addEventListener('click', () => {
        alert('Чат пока не реализован!');
    });
});