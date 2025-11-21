// Инициализация основной страницы

// Функция для автоматического изменения высоты textarea
function autoResizeTextarea(textarea) {
    if (!textarea) return;
    
    // Сбрасываем высоту, чтобы получить правильный scrollHeight
    textarea.style.height = 'auto';
    
    // Устанавливаем новую высоту на основе содержимого
    const newHeight = Math.min(textarea.scrollHeight, 300); // max-height из CSS
    textarea.style.height = newHeight + 'px';
}

function initializeMainPage() {
    const askButton = document.getElementById('askButton');
    if (askButton) {
        const newAskButton = askButton.cloneNode(true);
        askButton.parentNode.replaceChild(newAskButton, askButton);
        
        newAskButton.addEventListener('click', async function() {
            if (newAskButton.dataset.loading === 'true') {
                return;
            }

            const question = document.getElementById('userQuestion');
            if (!question) return;
            
            const questionText = question.value;
            const responseArea = document.getElementById('responseArea');
            const responseText = document.getElementById('responseText');

            if (questionText.trim() === '') {
                question.focus();
                return;
            }

            const defaultButtonHTML = newAskButton.dataset.defaultHtml || newAskButton.innerHTML;
            newAskButton.dataset.defaultHtml = defaultButtonHTML;
            newAskButton.dataset.loading = 'true';
            newAskButton.disabled = true;
            newAskButton.innerHTML = '<span class="spinner"></span>';

            try {
                if (!currentChatId) {
                    createNewChat();
                }
    
                const chat = chats.find(c => c.id === currentChatId);
                if (chat) {
                    chat.messages.push({
                        text: questionText,
                        sender: 'user',
                        timestamp: new Date().toISOString()
                    });
                    
                    // В заголовке всегда показываем последний запрос пользователя
                    chat.title = questionText.length > 30 ? questionText.substring(0, 30) + '...' : questionText;
                    
                    chat.lastUpdated = new Date().toISOString();
                    saveChats();
                    loadChatHistory();
                }
    
                let aiResponse;

                try {
                    // Пытаемся получить настоящий ответ от вашего сервера
                    if (typeof sendQuestionToServer === 'function') {
                        aiResponse = await sendQuestionToServer(questionText);
                    }
                } catch (e) {
                    // Если сервер вернул ошибку, используем заглушку
                    aiResponse = null;
                }

                if (!aiResponse) {
                    aiResponse = '<p>Ответ временно недоступен. Пожалуйста, попробуйте позже.</p>';
                }
                
                if (responseText) {
                    responseText.innerHTML = aiResponse || '';
                }

                if (chat) {
                    if (aiResponse) {
                        // Сохраняем HTML в сообщение для отображения
                        chat.messages.push({
                            text: aiResponse,
                            sender: 'bot',
                            timestamp: new Date().toISOString(),
                            isHtml: true // Флаг, что это HTML контент
                        });
                        chat.lastUpdated = new Date().toISOString();
                        saveChats();
                        loadChatHistory();
                    }
                }
    
                if (responseArea) {
                    responseArea.classList.remove('response-hidden');
                    responseArea.scrollIntoView({ behavior: 'smooth' });
                }
            } finally {
                newAskButton.disabled = false;
                newAskButton.innerHTML = newAskButton.dataset.defaultHtml || defaultButtonHTML;
                newAskButton.dataset.loading = 'false';
                
                // Сбрасываем высоту textarea после отправки
                if (question) {
                    question.style.height = 'auto';
                    autoResizeTextarea(question);
                }
            }
        });
    }

    // Обработчик для textarea с авто-высотой
    const userQuestion = document.getElementById('userQuestion');
    if (userQuestion) {
        // Автоматическое изменение высоты при вводе
        userQuestion.addEventListener('input', function() {
            autoResizeTextarea(this);
        });
        
        // Инициализация высоты при загрузке
        autoResizeTextarea(userQuestion);
        
        // Обработчик нажатия Enter (Shift+Enter для новой строки)
        userQuestion.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const askButton = document.getElementById('askButton');
                if (askButton && askButton.dataset.loading !== 'true') {
                    askButton.click();
                }
            }
        });
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализируем авторизацию
    handleLogin();
    
    // Проверяем авторизацию
    const savedUser = localStorage.getItem('currentUser');
    const authToken = localStorage.getItem('authToken');
    
    if (savedUser && authToken) {
        currentUser = JSON.parse(savedUser);
        const userInfo = document.getElementById('userInfo');
        if (userInfo) {
            userInfo.textContent = currentUser.email;
        }
        loadChatHistory();
        showPage('mainPage');
        
        if (chats.length > 0) {
            loadChat(chats[0].id);
        }
        
        initializeMainPage();
    } else {
        showPage('loginPage');
    }
});

