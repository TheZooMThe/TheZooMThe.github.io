const orderContainer = {
    soup: document.querySelector("#drop-soup"),
    "main-course": document.querySelector("#drop-main-dishes"),
    salad: document.querySelector("#drop-salads"),
    dessert: document.querySelector("#drop-desserts"),
    drink: document.querySelector("#drop-main-drinks"),
};

const BASE_API_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api';
const API_KEY = '8d1c5ae7-15f2-43a9-9364-c17231682e71';

const ORDERS_API_URL = `${BASE_API_URL}/orders?api_key=${API_KEY}`;
const DISHES_API_URL = `${BASE_API_URL}/dishes?api_key=${API_KEY}`;

const selectedItems = {
    soup: null,
    "main-course": null,
    salad: null,
    dessert: null,
    drink: null,
};

function updateOrderSummary() {
    let totalCost = 0;
    for (const category in selectedItems) {
        const item = selectedItems[category];
        if (item) {
            orderContainer[category].textContent =
                `${item.name} - ${item.price} ₽`;
            totalCost += item.price;
        } else {
            orderContainer[category].textContent = "Не выбрано";
        }
    }
    const totalDiv = document.querySelector("#total-cost");
    if (totalCost > 0) {
        totalDiv.style.display = "flex";
        totalDiv.textContent = `Стоимость заказа: ${totalCost} ₽`;
    } else {
        totalDiv.style.display = "none";
    }
}


function showNotification(message) {
    let notification = document.getElementById("notification");
    if (!notification) {
        notification = document.createElement("div");
        notification.id = "notification";
        notification.style.position = "fixed";
        notification.style.top = "0";
        notification.style.left = "0";
        notification.style.width = "100%";
        notification.style.height = "100%";
        notification.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        notification.style.display = "flex";
        notification.style.justifyContent = "center";
        notification.style.alignItems = "center";
        notification.style.zIndex = "1000";

        const content = document.createElement("div");
        content.style.backgroundColor = "white";
        content.style.padding = "20px";
        content.style.borderRadius = "10px";
        content.style.textAlign = "center";
        content.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
        content.id = "notification-content";

        const text = document.createElement("p");
        text.style.marginBottom = "20px";
        text.style.fontSize = "18px";
        text.id = "notification-text";

        const closeButton = document.createElement("button");
        closeButton.textContent = "Окей";
        closeButton.style.padding = "10px 20px";
        closeButton.style.fontSize = "16px";
        closeButton.style.backgroundColor = "tomato";
        closeButton.style.color = "white";
        closeButton.style.border = "none";
        closeButton.style.borderRadius = "5px";
        closeButton.style.cursor = "pointer";

        closeButton.addEventListener("mouseover", function () {
            closeButton.style.backgroundColor = "white";
            closeButton.style.color = "tomato";
            closeButton.style.border = "2px solid tomato";
        });

        closeButton.addEventListener("mouseout", function () {
            closeButton.style.backgroundColor = "tomato";
            closeButton.style.color = "white";
            closeButton.style.border = "none";
        });

        closeButton.addEventListener("click", function () {
            notification.remove();
        });

        content.appendChild(text);
        content.appendChild(closeButton);
        notification.appendChild(content);
        document.body.appendChild(notification);
    }

    document.getElementById("notification-text").textContent = message;
}

function checkValidCombo() {
    const soup = selectedItems.soup !== null;;
    const mainDish = selectedItems["main-course"] !== null;
    const salad = selectedItems.salad !== null;
    const drink = selectedItems.drink !== null;
    const dessert = selectedItems.dessert !== null;

    // Варианты валидных комбинаций
    const isCombo1 = soup && mainDish && salad && drink;
    const isCombo2 = mainDish && salad && drink;
    const isCombo3 = soup && mainDish && drink;
    const isCombo4 = mainDish && drink;
    const isCombo5 = soup && salad && drink;

    // Проверяем соответствие хотя бы одной из комбинаций
    return isCombo1 || isCombo2 || isCombo3 || isCombo4 || isCombo5;
}

function saveSelectionToLocalStorage() {
    const selectedIds = {};
    for (const category in selectedItems) {
        if (selectedItems[category]) {
            selectedIds[category] = selectedItems[category].keyword;
        }
    }
    localStorage.setItem("selectedDishes", JSON.stringify(selectedIds));
}

function selectItem(category, item, card) {
    if (selectedItems[category]) {
        const prevCard =
            document.querySelector(`
            [data-dish="${selectedItems[category].keyword}"]`);
        if (prevCard) {
            prevCard.classList.remove('selected');
        }
    }
    selectedItems[category] = item;
    card.classList.add('selected');
    orderContainer[category].textContent = `${item.name} - ${item.price} ₽`;
    saveSelectionToLocalStorage();
    updateOrderSummary();
}

function removeCard(category, itemKeyword, card) {
    card.remove();
    if (selectedItems[category]?.keyword === itemKeyword) {
        selectedItems[category] = null;
        orderContainer[category].textContent = "Не выбрано";
        saveSelectionToLocalStorage();
        updateOrderSummary();
    }
}

function removeAllCards() {
    const container = document.querySelector('.order_grid');
    
    const allCards = container.querySelectorAll('.food_card');
    
    // Удаляем все карточки
    allCards.forEach(card => {
        card.remove();
    });
}


function loadMenuItems(filteredMenuItems) {
    const container = document.querySelector('.order_grid');
    container.innerHTML = "";
    for (const category in filteredMenuItems) {
        const items = filteredMenuItems[category];
        items.sort((a, b) => a.name.localeCompare(b.name));
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'food_card';
            card.setAttribute('data-dish', item.keyword);
            card.setAttribute('data-kind', item.kind);
            const img = document.createElement('img');
            img.className = `${item.keyword}-img`;
            img.src = item.image;
            img.alt = item.name;
            const price = document.createElement('p');
            price.className = 'price';
            price.textContent = `${item.price} ₽`;
            const name = document.createElement('p');
            name.className = 'name';
            name.textContent = item.name;
            const volume = document.createElement('p');
            volume.className = 'volume';
            volume.textContent = item.count;
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-button';
            deleteButton.textContent = 'Удалить';
            deleteButton.addEventListener('click', () => {
                removeCard(category, item.keyword, card);
            });
            card.appendChild(img);
            card.appendChild(price);
            card.appendChild(name);
            card.appendChild(volume);
            card.appendChild(deleteButton);
            container.appendChild(card);
        });
    }
}

document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.target;
    form.querySelectorAll(".order-hidden-field").forEach(field =>
        field.remove());
    let totalCost = 0;
    for (const category in selectedItems) {
        const item = selectedItems[category];
        if (item) {
            totalCost += item.price;
            const itemField = document.createElement("input");
            itemField.type = "hidden";
            itemField.name = category;
            itemField.classList.add("order-hidden-field");
            itemField.value = item.keyword;
            form.appendChild(itemField);
        }
    }
    const totalCostField = document.createElement("input");
    totalCostField.type = "hidden";
    totalCostField.name = "total_cost";
    totalCostField.classList.add("order-hidden-field");
    totalCostField.value = totalCost;
    form.appendChild(totalCostField);
});

function loadSelectedDishesFromLocalStorage() {
    return JSON.parse(localStorage.getItem("selectedDishes")) || {};
}

async function loadDishes() {
    const API_URL = "https://edu.std-900.ist.mospolytech.ru/labs/api/dishes";
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Ошибка загрузки данных: ${response.status}`);
        }
        const dishes = await response.json();
        const savedDishes = loadSelectedDishesFromLocalStorage();
        const filteredMenuItems = {};
        for (const category in savedDishes) {
            const savedDishKeyword = savedDishes[category];
            const dish = dishes.find(d => d.keyword === savedDishKeyword);
            if (dish) {
                if (!filteredMenuItems[category]) {
                    filteredMenuItems[category] = [];
                }
                filteredMenuItems[category].push(dish);
            }
        }
        loadMenuItems(filteredMenuItems);
        for (const category in savedDishes) {
            const savedDishKeyword = savedDishes[category];
            const dish = dishes.find(d => d.keyword === savedDishKeyword);
            if (dish) {
                const card =
                    document.querySelector(`[data-dish="${dish.keyword}"]`);
                if (card) {
                    selectItem(category, dish, card);
                }
            }
        }
        updateOrderSummary();
    } catch (error) {
        console.error("Ошибка при загрузке блюд:", error);
    }
}

function clearSelectedItems() {
    console.log("Очистка всех выбранных блюд");
    for (const category in selectedItems) {
        selectedItems[category] = null;
        orderContainer[category].textContent = "Не выбрано";
    }
    saveSelectionToLocalStorage();
    updateOrderSummary();
    console.log("После очистки:", selectedItems);
}

async function handleOrderSubmission(event) {
    event.preventDefault(); 

    const formElement = document.querySelector('#order-form');
    if (!formElement) {
        console.error("Форма не найдена.");
        return;
    }

    const fullName = formElement.querySelector('#input-name').value;
    const email = formElement.querySelector('#input-email').value;
    const phone = formElement.querySelector('#input-phone').value;
    const deliveryTime = formElement.querySelector('#input-time').value;
    const deliveryAddress = formElement.querySelector('#input-address').value;
    const checkedInput = 
    formElement.querySelector('input[name="when_delivery"]:checked');//мб баг
    const deliveryType = checkedInput ? checkedInput.value : "now";


    // Получаем текущее время
    const currentTime = new Date();
    const currentHours = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();
    const currentTimeFormatted = 
    `${currentHours}:${currentMinutes < 10 
        ? '0' + currentMinutes : currentMinutes}`;

    // Проверяем, если время доставки раньше текущего
    if (deliveryType === "by_time" && deliveryTime < currentTimeFormatted) {
        alert("Время доставки не может быть раньше текущего времени.");
        return;
    }

    console.log(currentTimeFormatted);
    console.log(deliveryTime);


    const formData = new FormData();
    formData.append("full_name", fullName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("delivery_address", deliveryAddress);
    formData.append("delivery_type", deliveryType);
    formData.append("delivery_time", deliveryTime);

    // Отправляем дополнительные данные
    const selections = {
        soup_id: selectedItems?.soup?.id || null,
        main_course_id: selectedItems?.["main-course"]?.id || null,
        salad_id: selectedItems?.salad?.id || null,
        drink_id: selectedItems?.drink?.id || null,
    };

    Object.entries(selections).forEach(([key, value]) => {
        if (value) formData.append(key, value);
    });
    // Проверка валидности комбо
    if (!checkValidCombo()) {
        showNotification("Не соответствует комбо");
        return; // Останавливаем выполнение, если комбо не соответствует
    }
    try {
        const response = await fetch(
            ORDERS_API_URL,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const result = await response.json();
        console.log('Заказ успешно размещён:', result);

        formElement.reset();
        clearSelectedItems();
        removeAllCards();
        showNotification("Ваш заказ успешно оформлен!");
    } catch (error) {
        console.error('Ошибка при размещении заказа:', error);
        showNotification("Ошибка при размещении заказа. Попробуйте снова.");
    }
}


document.querySelector('#order-form').addEventListener('submit', 
    handleOrderSubmission);

document.addEventListener("DOMContentLoaded", async () => {
    await loadDishes();
    updateOrderSummary();
});

