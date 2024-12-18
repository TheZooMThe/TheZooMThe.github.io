const orderContainer = {
    soup: document.querySelector("#drop-soup"),
    "main-course": document.querySelector("#drop-main-dishes"),
    salad: document.querySelector("#drop-salads"),
    dessert: document.querySelector("#drop-desserts"),
    drink: document.querySelector("#drop-main-drinks"),
};

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

    const formData = new FormData();
    const dataToSend2 = {};
    formData.forEach((value, key) => {
        dataToSend2[key] = value;
    });
    console.log("Данные, до:", dataToSend2);

    const fullName = formElement.querySelector('#input-name').value;
    const email = formElement.querySelector('#input-email').value;
    const phone = formElement.querySelector('#input-phone').value;
    const delivery_time = formElement.querySelector('#input-time').value;
    const deliveryAddress = formElement.querySelector('#input-address').value;
    const deliveryType = formElement.querySelector(
        'input[name="delivery_type"]:checked')?.value || "now";

    formData.append("full_name", fullName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("delivery_address", deliveryAddress);
    formData.append("delivery_type", deliveryType);
    formData.append("delivery_time", delivery_time);

    const selections = {
        soup_id: selectedItems?.soup?.id || null,
        main_course_id: selectedItems?.["main-course"]?.id || null,
        salad_id: selectedItems?.salad?.id || null,
        drink_id: selectedItems?.drink?.id || null,
    };

    const orderData = {
        full_name: fullName,
        email: email,
        phone: phone,
        delivery_address: deliveryAddress,
        delivery_type: deliveryType,
        delivery_time: deliveryType === "by_time" ? delivery_time : null,
        ...selections,
    };
    console.log("Данные, отправляемые на сервер:", orderData);

    try {
        const response = await fetch(
            'https://edu.std-900.ist.mospolytech.ru/labs/api/orders?api_key=8d1c5ae7-15f2-43a9-9364-c17231682e71',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            }
        );

        if (!response.ok) {
            const errorDetails = await response.text();
            console.error(`Ошибка сервера: ${response.status}, детали: ${errorDetails}`);
            throw new Error(`Ошибка сервера: ${response.status}`);
        }
        

        const result = await response.json();
        console.log('Заказ успешно размещён:', result);

        clearSelectedItems();
        removeAllCards();
        alert("Ваш заказ успешно оформлен!");
    } catch (error) {
        console.error('Ошибка при размещении заказа:', error);
        alert("Ошибка при размещении заказа. Попробуйте снова.");
    }
}


document.querySelector('#order-form').addEventListener('submit', 
    handleOrderSubmission);

document.addEventListener("DOMContentLoaded", async () => {
    await loadDishes();
    updateOrderSummary();
});

