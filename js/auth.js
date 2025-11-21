// Функции авторизации

function handleLogin() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const loginButton = document.getElementById('loginButton');
        const loginMessage = document.getElementById('loginMessage');
        
        loginButton.disabled = true;
        loginButton.textContent = 'Вход...';
        loginMessage.textContent = '';

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = data.detail || 'Ошибка входа. Проверьте учетные данные.';
                throw new Error(errorMessage);
            }

            const { token, email: userEmail } = data;
            if (!token) throw new Error('Токен не получен.');

            // Сохраняем токен и данные пользователя
            localStorage.setItem('authToken', token);
            currentUser = { email: userEmail };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            // Показываем информацию пользователя
            document.getElementById('userInfo').textContent = userEmail;

            // Загружаем историю чатов и переходим на основную страницу
            loadChatHistory();
            showPage('mainPage');

            // Инициализируем функционал основной страницы
            initializeMainPage();
        } catch (error) {
            loginMessage.textContent = error.message;
            console.error('Ошибка:', error);
        } finally {
            loginButton.disabled = false;
            loginButton.textContent = 'Войти';
        }
    });
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    currentUser = null;
    showPage('loginPage');
}

