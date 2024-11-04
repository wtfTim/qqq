let tokenCount = 0;
let currentRotation = 0;
let tickets = parseInt(localStorage.getItem("tickets")) || 1; // Начальное количество билетов - 1
const ticketInterval = 6 * 60 * 60 * 1000; // 6 часов в миллисекундах

// Проверяем возможность получения билета
function canReceiveTicket() {
    const lastTicketTime = parseInt(localStorage.getItem("lastTicketTime")) || 0;
    const now = Date.now();
    return (now - lastTicketTime) >= ticketInterval; // Проверка времени
}

// Функция для обновления отображения билетов
function updateTicketDisplay() {
    document.getElementById("ticketCount").innerText = tickets;
}

// Открытие модального окна для получения билета
function openTicketModal() {
    const modal = document.getElementById("ticketModal");
    modal.style.display = "flex";

    const canReceive = canReceiveTicket(); // Проверка возможности получения билета
    const ticketStatusElement = document.getElementById("ticketStatus");

    if (canReceive) {
        ticketStatusElement.innerText = "Вы можете получить билет!";
        document.getElementById("claimTicketButton").disabled = false; // Кнопка активна
    } else {
        // Рассчитаем оставшееся время до следующего билета
        const lastTicketTime = parseInt(localStorage.getItem("lastTicketTime")) || 0;
        const now = Date.now();
        const timeRemaining = ticketInterval - (now - lastTicketTime);

        // Преобразуем оставшееся время в часы и минуты
        const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

        ticketStatusElement.innerText = `Вы сможете получить билет через ${hours}ч ${minutes}мин.`;
        document.getElementById("claimTicketButton").disabled = true; // Кнопка неактивна
    }
}

// Закрытие модального окна
function closeTicketModal() {
    const modal = document.getElementById("ticketModal");
    modal.style.display = "none";
}

// Функция для получения билета
function claimTicket() {
    if (canReceiveTicket()) {
        tickets++;
        localStorage.setItem("tickets", tickets);
        localStorage.setItem("lastTicketTime", Date.now()); // Обновляем время последнего получения
        updateTicketDisplay();
        closeTicketModal();
        alert("Билет успешно получен!");
    } else {
        alert("Вы ещё не можете получить билет. Попробуйте позже.");
    }
}

// Функция для вращения рулетки
function spinWheel() {
    if (tickets <= 0) {
        alert("У вас нет билетов для вращения рулетки!");
        return;
    }

    tickets--; // Уменьшаем количество билетов на 1
    localStorage.setItem("tickets", tickets);
    updateTicketDisplay();

    const wheel = document.getElementById("wheel");
    const randomSpin = Math.floor(Math.random() * 360) + 1080; // Минимум 3 полных оборота
    currentRotation += randomSpin;
    wheel.style.transform = `rotate(${currentRotation}deg)`;

    setTimeout(() => {
        const normalizedRotation = (currentRotation % 360 + 360) % 360;
        const segment = Math.floor(normalizedRotation / 45);
        const rewards = [50, 40, 30, 20, 10, 100, 70, 60];
        const tokensWon = rewards[segment];

        tokenCount += tokensWon;
        document.getElementById("tokenCount").innerText = tokenCount;
        alert(`Поздравляем! Вы выиграли ${tokensWon} токенов $RULET`);
    }, 4000);
}

// Инициализация отображения количества билетов при загрузке
updateTicketDisplay();
