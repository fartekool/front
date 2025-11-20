// Функции для работы с чатами

function loadChatHistory() {
    const chatHistory = document.getElementById('chatHistory');
    if (!chatHistory) return;
    
    chatHistory.innerHTML = '';

    if (chats.length === 0) {
        chatHistory.innerHTML = `
            <div style="padding: 20px; text-align: center; color: #666;">
                История запросов пуста
            </div>
        `;
        return;
    }

    // Сортируем чаты по дате обновления (новые сверху)
    chats.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
    
    chats.forEach(chat => {
        const lastMessage = chat.messages && chat.messages.length > 0 
            ? chat.messages[chat.messages.length - 1] 
            : null;
            
        const chatItem = document.createElement('div');
        chatItem.className = `chat-item ${chat.id === currentChatId ? 'active' : ''}`;
        chatItem.onclick = () => loadChat(chat.id);
        
        chatItem.innerHTML = `
            <div class="chat-title">${chat.title}</div>
            <div class="chat-preview">${lastMessage ? (lastMessage.sender === 'user' ? 'Вопрос: ' + lastMessage.text : 'Ответ: ' + lastMessage.text.substring(0, 50) + '...') : 'Новый запрос'}</div>
            <div class="chat-date">${formatDate(chat.lastUpdated)}</div>
            <button class="delete-chat" onclick="deleteChat('${chat.id}', event)">×</button>
        `;
        
        chatHistory.appendChild(chatItem);
    });
}

function deleteChat(chatId, event) {
    event.stopPropagation();
    
    chats = chats.filter(chat => chat.id !== chatId);
    
    if (currentChatId === chatId) {
        currentChatId = null;
        const responseArea = document.getElementById('responseArea');
        if (responseArea) {
            responseArea.classList.add('response-hidden');
        }
    }
    
    saveChats();
    loadChatHistory();
}

function createNewChat() {
    const chatId = 'chat_' + Date.now();
    const newChat = {
        id: chatId,
        title: 'Новый запрос',
        messages: [],
        lastUpdated: new Date().toISOString()
    };
    
    chats.unshift(newChat);
    saveChats();
    loadChatHistory();
    loadChat(chatId);
    
    const responseArea = document.getElementById('responseArea');
    if (responseArea) {
        responseArea.classList.add('response-hidden');
    }
}

function loadChat(chatId) {
    currentChatId = chatId;
    const chat = chats.find(c => c.id === chatId);
    
    if (!chat) return;

    const lastBotMessage = chat.messages.findLast(msg => msg.sender === 'bot');
    const responseArea = document.getElementById('responseArea');
    const responseText = document.getElementById('responseText');
    
    if (lastBotMessage && responseText && responseArea) {
        responseText.innerHTML = lastBotMessage.text;
        responseArea.classList.remove('response-hidden');
        responseArea.scrollIntoView({ behavior: 'smooth' });
    } else if (responseArea) {
        responseArea.classList.add('response-hidden');
    }

    loadChatHistory();
}

function saveChats() {
    localStorage.setItem('admin_chats', JSON.stringify(chats));
}

function createDemoChats() {
    const demoChats = [
        {
            id: 'demo1',
            title: 'Согласование муниципального контракта',
            messages: [
                {
                    text: 'Каков порядок согласования муниципального контракта?',
                    sender: 'user',
                    timestamp: new Date(Date.now() - 86400000).toISOString()
                },
                {
                    text: 'Порядок согласования муниципального контракта регулируется Федеральным законом № 44-ФЗ и Регламентом администрации г. Нижнего Новгорода. Основные этапы: подготовка проекта контракта отделом закупок, внутреннее согласование юридическим и финансовым отделами (3 рабочих дня), внесение в реестр, подписание уполномоченным лицом администрации. Общий срок - до 10 рабочих дней.',
                    sender: 'bot',
                    timestamp: new Date(Date.now() - 86400000).toISOString()
                }
            ],
            lastUpdated: new Date(Date.now() - 86400000).toISOString()
        },
        {
            id: 'demo2',
            title: 'Требования к конкурсной документации',
            messages: [
                {
                    text: 'Какие требования к конкурсной документации?',
                    sender: 'user',
                    timestamp: new Date(Date.now() - 172800000).toISOString()
                },
                {
                    text: 'Требования к конкурсной документации установлены ст. 50 Федерального закона № 44-ФЗ. Обязательные разделы: извещение о проведении конкурса, техническое задание, инструкция для участников, критерии оценки заявок, проект контракта. Документация должна быть размещена в ЕИС не менее чем за 15 дней до окончания подачи заявок.',
                    sender: 'bot',
                    timestamp: new Date(Date.now() - 172800000).toISOString()
                }
            ],
            lastUpdated: new Date(Date.now() - 172800000).toISOString()
        }
    ];
    
    chats = [...demoChats, ...chats];
    saveChats();
}

