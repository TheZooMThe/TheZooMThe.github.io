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
        totalDiv.style.display = "block";
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

document.querySelector("#submit-btn").addEventListener("click", 
    async (event) => {
        event.preventDefault();
        const form = document.querySelector("#order-form");
        const fullName = document.querySelector("#input-name").value;
        const email = document.querySelector("#input-email").value;
        const phone = document.querySelector("#input-phone").value;
        const deliveryAddress = document.querySelector("#input-address").value;
        const deliveryTime = document.querySelector("#input-time").value;
        const deliveryType = 
        document.querySelector('input[name="when_delivery"]:checked').value;
        const comment = document.querySelector("#comment-textarea").value;
        const selectedDishes = loadSelectedDishesFromLocalStorage();
        if (Object.keys(selectedDishes).length === 0) {
            alert("Пожалуйста, выберите хотя бы одно блюдо!");
            return;
        }
        const orderData = {
            full_name: fullName,
            email: email,
            phone: phone,
            delivery_address: deliveryAddress,
            delivery_time: deliveryTime,
            delivery_type: deliveryType,
            comment: comment || null,
            soup_id: selectedDishes.soup || null,
            main_course_id: selectedDishes["main-course"] || null,
            salad_id: selectedDishes.salad || null,
            dessert_id: selectedDishes.dessert || null,
            drink_id: selectedDishes.drink || null,
            student_id: "8d1c5ae7-15f2-43a9-9364-c17231682e71",
        };
        const formData = new FormData();
        for (const [key, value] of Object.entries(orderData)) {
            if (value !== null) {
                formData.append(key, value);
            }
        }
        try {
            const response = await 
            fetch("https://edu.std-900.ist.mospolytech.ru/labs/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "API-Key": "8d1c5ae7-15f2-43a9-9364-c17231682e71",
                },
                body: JSON.stringify(orderData),
            });
            if (!response.ok) {
                throw new Error(`Ошибка: ${response.statusText}`);
            }
            const result = await response.json();
            if (result.error) {
                throw new Error(result.error);
            }
            localStorage.removeItem("selectedDishes");
            alert("Ваш заказ успешно отправлен!");
            form.reset();
            updateOrderSummary();
        } catch (error) {
            alert(`Произошла ошибка: ${error.message}`);
            console.log(orderData);
        }
    });

document.addEventListener("DOMContentLoaded", async () => {
    await loadDishes();
    updateOrderSummary();
});
