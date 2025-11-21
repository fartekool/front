// Функция для экранирования HTML-символов
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Функция для форматирования массива документов в HTML
function formatDocuments(documents) {
    if (!documents || documents.length === 0) {
        return '<p>Документы не найдены.</p>';
    }

    let html = '';
    
    documents.forEach((doc, index) => {
        html += `<div class="document-item" style="margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #e0e0e0;">`;
        html += `<h3 style="color: #0054a6; margin-bottom: 15px; font-size: 1.2em;">Документ ${index + 1}:</h3>`;
        
        if (doc.doc_name) {
            html += `<p><strong>Заголовок:</strong> ${escapeHtml(doc.doc_name)}</p>`;
        }
        
        if (doc.doc_number) {
            html += `<p><strong>Номер документа:</strong> ${escapeHtml(doc.doc_number)}</p>`;
        }
        
        if (doc.doc_date) {
            html += `<p><strong>Дата:</strong> ${escapeHtml(doc.doc_date)}</p>`;
        }
        
        if (doc.context_text) {
            html += `<p><strong>Содержимое:</strong> ${escapeHtml(doc.context_text)}</p>`;
        }
        
        if (doc.parsed_references && doc.parsed_references.length > 0) {
            html += `<p><strong>Ссылки:</strong></p>`;
            html += `<ul style="margin-left: 20px; margin-top: 5px;">`;
            doc.parsed_references.forEach((ref, refIndex) => {
                html += `<li style="margin-bottom: 5px;">${refIndex + 1}. ${escapeHtml(ref)}</li>`;
            });
            html += `</ul>`;
        }
        
        html += `</div>`;
    });
    
    return html;
}

// Отправка текста вопроса на ваш сервер и получение ответа
// Бэкенд возвращает массив документов в формате:
// [{ doc_name, doc_number, doc_date, context_text, parsed_references: [] }]
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

        // Ожидаем массив документов (либо напрямую массив, либо в поле documents)
        const documents = Array.isArray(data) ? data : (data.documents || []);
        // Форматируем документы в HTML
        const formattedHtml = formatDocuments(documents);
        
        return formattedHtml;
    } catch (error) {
        console.error('Ошибка отправки вопроса на сервер:', error);
        return '<p>Ошибка: База данных временно недоступна. Пожалуйста, попробуйте позже.</p>';
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


