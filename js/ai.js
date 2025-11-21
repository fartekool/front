// Генератор ответов ИИ для администрации
// Вместо длинной заглушки теперь просто выводим переданный текст как ответ.
// Так в интерфейсе отображается именно принятый (переданный) текст.
function generateAdminAIResponse(text) {
    return {
        answer: text,
        sources: [],
        sourcesText: []
    };
}

// Отправка текста вопроса на ваш сервер и получение ответа
// Сейчас бэкенд (FastAPI, main.py) на /api/questions принимает { question }
// и возвращает объект вида { answer: "ПРИВЕТ" } — без sources/sourcesText.
// Здесь мы адаптируем ответ к формату, ожидаемому интерфейсом.
async function sendQuestionToServer(question) {
    const authToken = localStorage.getItem('authToken');

    try {
        const response = await fetch(`${API_BASE_URL}/api/questions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
            },
            body: JSON.stringify({ question }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Ошибка при получении ответа от сервера');
        }

        // Бэкенд сейчас возвращает только { answer: "ПРИВЕТ" }.
        // Приводим к единому формату, который использует интерфейс.
        return {
            answer: data.answer ?? 'ПРИВЕТ',
            sources: [],
            sourcesText: []
        };
    } catch (error) {
        return {
            answer: 'НЕТ СВЯЗИ С СЕРВЕРОМ',
            sources: [],
            sourcesText: []
        };
    }
}

function copyResponse() {
    const responseText = document.getElementById('responseText');
    if (!responseText) return;
    
    navigator.clipboard.writeText(responseText.innerText)
        .then(() => alert('Ответ скопирован в буфер обмена'))
        .catch(err => alert('Ошибка копирования: ' + err));
}

function saveResponse() {
    alert('Функция сохранения ответа будет реализована в будущем обновлении');
}

