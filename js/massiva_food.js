const orderContainer = {
    soup: document.querySelector("#drop-soup"),
    "main-course": document.querySelector("#drop-main-dishes"),
    salad: document.querySelector("#drop-salads"),
    dessert: document.querySelector("#drop-desserts"),
    drink: document.querySelector("#drop-main-drinks"),
};

const orderSummaryPanel = document.querySelector("#order-summary-panel"); 
const totalCostDiv = document.querySelector("#total-cost"); 
const checkoutButton = document.querySelector("#save-button"); 

const selectedItems = {
    soup: null,
    "main-course": null,
    salad: null,
    dessert: null,
    drink: null,
};

function checkValidCombo() {
    const soup = document.querySelector("#drop-soup").textContent !== 
    "Суп не выбран";
    const mainDish = document.querySelector("#drop-main-dishes").textContent 
    !== "Главное блюдо не выбрано";
    const salad = document.querySelector("#drop-salads").textContent 
    !== "Салат или стартер не выбран";
    const drink = document.querySelector("#drop-main-drinks").textContent 
    !== "Напиток не выбран";
    const dessert = document.querySelector("#drop-desserts").textContent 
    !== "Десерт не выбран";

    if ((soup && mainDish && salad && drink) || 
        (mainDish && salad && drink) || 
        (soup && mainDish && drink) || 
        (mainDish && drink) || 
        (soup && salad && drink)) {
        return true; 
    } else {
        return false;
    }
}

function updateOrderSummary() {
    let totalCost = 0;
    for (const category in selectedItems) {
        const item = selectedItems[category];
        if (item) {
            orderContainer[category].innerHTML = `${item.name}-${item.price} ₽`;
            totalCost += item.price;
        } else {
            orderContainer[category].innerHTML = `${category === "soups"
                ? "Суп не выбран"
                : category === "mainDishes"
                    ? "Главное блюдо не выбрано"
                    : "Напиток не выбран"
            }`;
        }
    }
    if (totalCost > 0) {
        orderSummaryPanel.style.display = "block";
        totalCostDiv.textContent = `Стоимость заказа: ${totalCost} ₽`;
        isValidCombo = checkValidCombo();
        checkoutButton.disabled = !isValidCombo;
    } else {
        orderSummaryPanel.style.display = "none";
    }
}

function updateButtonState() {
    const checkoutButton = document.querySelector("#save-button");
    checkoutButton.disabled = !checkValidCombo();
}

document.querySelectorAll(".order-item").forEach(item => {
    item.addEventListener("click", () => {
        updateButtonState();
    });
});

document.addEventListener("DOMContentLoaded", updateButtonState);

function selectItem(category, item, card) {
    if (selectedItems[category]) {
        const prevCard = document.querySelector(
            `[data-dish="${selectedItems[category].keyword}"]`
        );
        if (prevCard) {
            prevCard.classList.remove('selected');
        }
    }

    selectedItems[category] = item;
    card.classList.add('selected');
    updateOrderSummary();
}

function loadMenuItems() {
    const containerMapping = {
        soup: document.querySelector('.dishes'),
        "main-course": document.querySelector('.main-dishes'),
        salad: document.querySelector('.salad'),
        dessert: document.querySelector('.dessert'),
        drink: document.querySelector('.drinks')
    };

    for (const category in menuItems) {
        const items = menuItems[category];
        const container = containerMapping[category];

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

            const button = document.createElement('button');
            button.textContent = 'Добавить';
            button.addEventListener('click', () =>
                selectItem(category, item, card)
            );

            card.appendChild(img);
            card.appendChild(price);
            card.appendChild(name);
            card.appendChild(volume);
            card.appendChild(button);
            container.appendChild(card);
        });
    }
}

function filters() {
    const filterButtons = document.querySelectorAll('.filter-button');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const buttonsContainer = button.parentElement;

            buttonsContainer.querySelectorAll('.filter-button').forEach(btn => {
                btn.classList.remove('active');
            });

            button.classList.add('active');

            const targetContainer = buttonsContainer.nextElementSibling;
            const children = targetContainer.children;

            Array.from(children).forEach(child => {
                child.style.display = 'none';
                if (button.dataset.kind === child.dataset.kind ||
                    !button.dataset.kind) {
                    child.style.display = 'flex';
                }
            });
        });
    });
}

filters();

function removeCard(category, itemKeyword, card) {
    card.remove();

    if (selectedItems[category]?.keyword === itemKeyword) {
        selectedItems[category] = null;
        orderContainer[category].textContent = "Не выбрано";
        saveSelectionToLocalStorage();
        updateOrderSummary();
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

async function loadDishes() {
    const API_URL = "https://edu.std-900.ist.mospolytech.ru/labs/api/dishes";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Ошибка загрузки данных: ${response.status}`);
        }

        const dishes = await response.json();

        const groupedDishes = dishes.reduce((acc, dish) => {
            if (!acc[dish.category]) {
                acc[dish.category] = [];
            }
            acc[dish.category].push(dish);
            return acc;
        }, {});

        window.menuItems = groupedDishes;

        loadMenuItems();
    } catch (error) {
        showNotification("Не удалось загрузить блюда. Попробуйте позже.");
    }
}

function saveSelectedItemsToLocalStorage() {
    const itemsToSave = {};
    for (const category in selectedItems) {
        if (selectedItems[category]) {
            itemsToSave[category] = selectedItems[category].keyword;  
        }
    }
    localStorage.setItem("selectedDishes", JSON.stringify(itemsToSave));  

    window.location.href = "order.html";  
}

document.getElementById("save-button").addEventListener("click", 
    saveSelectedItemsToLocalStorage);

document.addEventListener("DOMContentLoaded", async () => {
    await loadDishes();
    updateOrderSummary();
});
