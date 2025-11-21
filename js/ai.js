// Генератор ответов ИИ для администрации
// Вместо длинной заглушки теперь просто выводим переданный текст как ответ.
// Так в интерфейсе отображается именно принятый (переданный) текст.


// Отправка текста вопроса на ваш сервер и получение ответа
// Сейчас бэкенд (FastAPI, main.py) на /api/questions принимает { question }
// и возвращает объект вида { answer: "ПРИВЕТ" } — без sources/sourcesText.
// Здесь мы адаптируем ответ к формату, ожидаемому интерфейсом.
async function sendQuestionToServer(question) {
    const authToken = localStorage.getItem('authToken');

    try {
        const response = await fetch(`${API_AI_URL}/api/questions`, {
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
            answer: 'Error: База данных временно недоступна. Пожалуйста, попробуйте позже.',
            sources: [],
            sourcesText: []
        };
    }
}

function copyResponse() {
    const responseText = document.getElementById('responseText');
    if (!responseText) return;

    const copyButton = document.getElementById('copyButton');
    if (!copyButton) return;

    copyButton.textContent = '✅ Скопировано';

    navigator.clipboard.writeText(responseText.innerText);

    setTimeout(() => {
        copyButton.textContent = '📋 Копировать'; 
    }, 1000); 
}


