// Инициализация основной страницы

function initializeMainPage() {
    // Обработчик кнопки "Найти ответ"
    const askButton = document.getElementById('askButton');
    if (askButton) {
        // Удаляем старый обработчик, если есть
        const newAskButton = askButton.cloneNode(true);
        askButton.parentNode.replaceChild(newAskButton, askButton);
        
        newAskButton.addEventListener('click', async function() {
            const question = document.getElementById('userQuestion');
            if (!question) return;
            
            const questionText = question.value;
            const responseArea = document.getElementById('responseArea');
            const responseText = document.getElementById('responseText');

            if (questionText.trim() === '') {
                alert('Пожалуйста, введите ваш вопрос.');
                return;
            }

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
                
                if (chat.messages.length === 1) {
                    chat.title = questionText.length > 30 ? questionText.substring(0, 30) + '...' : questionText;
                }
                
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
                // Если сервер вернул ошибку, используем локальную заглушку
                aiResponse = null;
            }

            // Если сервер ничего не вернул или произошла ошибка — используем заглушку
            if (!aiResponse) {
                aiResponse = generateAdminAIResponse(questionText);
            }
            
            if (responseText) {
                responseText.innerHTML = aiResponse.answer || aiResponse.text || '';
            }
            
            const sourceLink1 = document.getElementById('sourceLink1');
            const sourceLink2 = document.getElementById('sourceLink2');
            
            if (sourceLink1 && aiResponse.sources && aiResponse.sourcesText) {
                sourceLink1.href = aiResponse.sources[0] || '#';
                sourceLink1.textContent = aiResponse.sourcesText[0] || '';
            }
            if (sourceLink2 && aiResponse.sources && aiResponse.sourcesText) {
                sourceLink2.href = aiResponse.sources[1] || '#';
                sourceLink2.textContent = aiResponse.sourcesText[1] || '';
            }

            if (chat) {
                const botText = aiResponse.answer || aiResponse.text || '';
                if (botText) {
                    chat.messages.push({
                        text: botText,
                        sender: 'bot',
                        timestamp: new Date().toISOString()
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
        });
    }

    // Обработчик нажатия Enter
    const userQuestion = document.getElementById('userQuestion');
    if (userQuestion) {
        userQuestion.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const askButton = document.getElementById('askButton');
                if (askButton) {
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

