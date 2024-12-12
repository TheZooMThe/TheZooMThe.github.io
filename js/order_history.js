document.addEventListener('DOMContentLoaded', () => {
    const ORDERS_API_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api/orders?api_key=8d1c5ae7-15f2-43a9-9364-c17231682e71';
    const DISHES_API_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api/dishes';

    
    const orderHistoryGrid = document.querySelector('.order_history_grid');

    let dishesMap = {};

    async function fetchDishes() {
        try {
            const response = await fetch(DISHES_API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const dishes = await response.json();
            dishes.forEach(dish => {
                dishesMap[dish.id] = { name: dish.name, price: dish.price };
            });
        } catch (error) {
            console.error('Error fetching dishes:', error);
        }
    }

    function renderOrders(orders) {
        orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        const table = document.createElement('table');
        table.classList.add('order-table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>№</th>
                    <th>Дата оформления</th>
                    <th>Состав заказа</th>
                    <th>Стоимость</th>
                    <th>Время доставки</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;

        const tbody = table.querySelector('tbody');

        orders.forEach((order, index) => {
            const items = [
                dishesMap[order.soup_id]?.name,
                dishesMap[order.main_course_id]?.name,
                dishesMap[order.drink_id]?.name,
                dishesMap[order.dessert_id]?.name,
            ].filter(Boolean).join(', ');

            const totalCost = [
                dishesMap[order.soup_id]?.price || 0,
                dishesMap[order.main_course_id]?.price || 0,
                dishesMap[order.drink_id]?.price || 0,
                dishesMap[order.dessert_id]?.price || 0,
            ].reduce((sum, price) => sum + price, 0);

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${new Date(order.created_at).toLocaleString()}</td>
                <td>${items}</td>
                <td>${totalCost}₽</td>
                <td>${order.delivery_type === 'now' ?
        'Как можно скорее (с 07:00 до 23:00)'
        : order.delivery_time}</td>
                <td>
                    <button class="view-btn" data-id="${order.id}">👁️</button>
                    <button class="edit-btn" data-id="${order.id}">✏️</button>
                    <button class="delete-btn" data-id="${order.id}">🗑️</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        orderHistoryGrid.innerHTML = '';
        orderHistoryGrid.appendChild(table);

        table.querySelectorAll('.view-btn').forEach(button =>
            button.addEventListener('click', handleViewOrder));
        table.querySelectorAll('.edit-btn').forEach(button =>
            button.addEventListener('click', handleEditOrder));
        table.querySelectorAll('.delete-btn').forEach(button =>
            button.addEventListener('click', handleDeleteOrder));
    }

    async function fetchOrders() {
        try {
            const response = await fetch(ORDERS_API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const orders = await response.json();
            renderOrders(orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            orderHistoryGrid.innerHTML =
                '<p>Не удалось загрузить заказы. Попробуйте позже.</p>';
        }
    }

    async function handleViewOrder(event) {
        const orderId = event.target.dataset.id;

        try {
            const response = await fetch(`https://edu.std-900.ist.mospolytech.ru/labs/api/orders/${orderId}?api_key=8d1c5ae7-15f2-43a9-9364-c17231682e71`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const order = await response.json();

            if (!order) {
                throw new Error('Order data is empty.');
            }

            const orderItems = [
                order.soup_id && dishesMap[order.soup_id]
                    ? `<li>${dishesMap[order.soup_id].name} 
                (${dishesMap[order.soup_id].price}₽)</li>` : '',
                order.main_course_id && dishesMap[order.main_course_id]
                    ? `<li>${dishesMap[order.main_course_id].name} 
                (${dishesMap[order.main_course_id].price}₽)</li>` : '',
                order.drink_id && dishesMap[order.drink_id]
                    ? `<li>${dishesMap[order.drink_id].name} 
                (${dishesMap[order.drink_id].price}₽)</li>` : '',
                order.dessert_id && dishesMap[order.dessert_id]
                    ? `<li>${dishesMap[order.dessert_id].name} 
                (${dishesMap[order.dessert_id].price}₽)</li>` : '',
            ].filter(Boolean).join('');

            const totalCost = [
                order.soup_id && dishesMap[order.soup_id]
                    ? dishesMap[order.soup_id].price : 0,
                order.main_course_id && dishesMap[order.main_course_id]
                    ? dishesMap[order.main_course_id].price : 0,
                order.drink_id && dishesMap[order.drink_id]
                    ? dishesMap[order.drink_id].price : 0,
                order.dessert_id && dishesMap[order.dessert_id]
                    ? dishesMap[order.dessert_id].price : 0,
            ].reduce((sum, price) => sum + price, 0);

            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
            <div class="modal-content">
                <span class="close-btn">&times;</span>
                <h2>Просмотр заказа</h2>
                <p><strong>Дата оформления:</strong> ${order.created_at ?
        new Date(order.created_at).toLocaleString() : 'Неизвестно'}</p>
                <h3>Доставка</h3>
                <p><strong>Имя получателя:</strong> 
                ${order.full_name || 'Не указано'}</p>
                <p><strong>Адрес доставки:</strong> 
                ${order.delivery_address || 'Не указан'}</p>
                <p><strong>Время доставки:</strong> 
                ${order.delivery_type === 'now' ? 'by_time' :
        order.delivery_time || 'Не указано'}</p>
                <p><strong>Телефон:</strong> ${order.phone || 'Не указан'}</p>
                <p><strong>Email:</strong> ${order.email || 'Не указан'}</p>
                <h3>Комментарий</h3>
                <p>${order.comment || 'Нет комментария'}</p>
                <h3>Состав заказа</h3>
                <ul>${orderItems || '<li>Нет данных</li>'}</ul>
                <p><strong>Стоимость:</strong> ${totalCost}₽</p>
            </div>
        `;

            document.body.appendChild(modal);

            const closeModalBtn = modal.querySelector('.close-btn');
            closeModalBtn.onclick = () => {
                modal.remove();
            };

            window.onclick = (event) => {
                if (event.target === modal) {
                    modal.remove();
                }
            };
        } catch (error) {
            console.error('Error fetching order details:', error);
            alert('Не удалось загрузить детали заказа. Попробуйте позже.');
        }
    }
    async function handleEditOrder(event) {
        const orderId = event.target.dataset.id; 

        try {
            const response = await fetch(`https://edu.std-900.ist.mospolytech.ru/labs/api/orders/${orderId}?api_key=8d1c5ae7-15f2-43a9-9364-c17231682e71`);
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            const order = await response.json(); 

            const orderItems = [
                order.soup_id && dishesMap[order.soup_id] 
                    ? `<li>${dishesMap[order.soup_id].name} 
                (${dishesMap[order.soup_id].price}₽)</li>` : '',
                order.main_course_id && dishesMap[order.main_course_id] 
                    ? `<li>${dishesMap[order.main_course_id].name} 
                (${dishesMap[order.main_course_id].price}₽)</li>` : '',
                order.drink_id && dishesMap[order.drink_id] 
                    ? `<li>${dishesMap[order.drink_id].name} 
                (${dishesMap[order.drink_id].price}₽)</li>` : '',
                order.dessert_id && dishesMap[order.dessert_id] 
                    ? `<li>${dishesMap[order.dessert_id].name} 
                (${dishesMap[order.dessert_id].price}₽)</li>` : '',
            ].filter(Boolean).join('');

            const totalCost = [
                order.soup_id && dishesMap[order.soup_id] ? 
                    dishesMap[order.soup_id].price : 0,
                order.main_course_id && dishesMap[order.main_course_id] ? 
                    dishesMap[order.main_course_id].price : 0,
                order.drink_id && dishesMap[order.drink_id] ? 
                    dishesMap[order.drink_id].price : 0,
                order.dessert_id && dishesMap[order.dessert_id] ? 
                    dishesMap[order.dessert_id].price : 0,
            ].reduce((sum, price) => sum + price, 0);

            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <span class="close-btn">&times;</span>
                    <h2>Редактирование заказа</h2>
                    <form id="edit-order-form">
                        <label><strong>Дата оформления:</strong>
                            <input type="text" name="created_at" value="
                            ${order.created_at ? 
        new Date(order.created_at).toLocaleString() 
        : 'Неизвестно'}" disabled>
                        </label>
                        <h3>Доставка</h3>
                        <label>
                        <strong>Имя получателя:</strong>
                        <input type="text" name="full_name" value="
                        ${order.full_name || ''}" required>
                    </label>
                    <label>
                        <strong>Адрес доставки:</strong>
                        <input type="text" name="delivery_address" value="
                        ${order.delivery_address || ''}" required>
                    </label>
                    <label>
                        <strong>Телефон:</strong>
                        <input type="text" name="phone" value="
                        ${order.phone || ''}" required>
                    </label>
                    <label>
                        <strong>Email:</strong>
                        <input type="email" name="email" value="
                        ${order.email || ''}" required>
                    </label>

                        <h3>Комментарий</h3>
                        <label>
                            <textarea name="comment">${order.comment ||
                ''}</textarea>
                        </label>
                        <h3>Состав заказа</h3>
                        <ul>${orderItems || '<li>Нет данных</li>'}</ul>
                        <p><strong>Стоимость:</strong> ${totalCost}₽</p>
                        <div class="form-actions">
                            <button type="button" 
                            class="cls-btn">Отмена</button>
                            <button type="submit">Сохранить</button>
                        </div>
                    </form>
                </div>
            `;

            document.body.appendChild(modal);

            modal.querySelector('.close-btn').addEventListener('click', 
                () => modal.remove());
            modal.querySelector('.cls-btn').addEventListener('click', 
                () => modal.remove());
            window.onclick = (event) => {
                if (event.target === modal) {
                    modal.remove();
                }
            };

            const form = modal.querySelector('#edit-order-form');
            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                const formData = new FormData(form);
                const updatedOrder = Object.fromEntries(formData.entries()); 
                updatedOrder.id = order.id; 

                try {
                    const saveResponse = await fetch(`https://edu.std-900.ist.mospolytech.ru/labs/api/orders/${orderId}?api_key=8d1c5ae7-15f2-43a9-9364-c17231682e71`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedOrder),
                    });
                    if (!saveResponse.ok) {
                        throw new Error(`Ошибка HTTP: ${saveResponse.status}`);
                    }

                    alert('Заказ успешно сохранён!');
                    modal.remove(); 
                    fetchOrders(); 
                } catch (saveError) {
                    console.error('Ошибка сохранения заказа:', saveError);
                    alert('Не удалось сохранить изменения. Попробуйте позже.');
                }
            });
        } catch (error) {
            console.error('Ошибка загрузки данных для редактирования:', error);
            alert('Не удалось загрузить данные заказа. Попробуйте позже.');
        }
    }


    async function deleteOrder(orderId) {
        try {
            const response = await fetch(`https://edu.std-900.ist.mospolytech.ru/labs/api/orders/${orderId}?api_key=8d1c5ae7-15f2-43a9-9364-c17231682e71`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            alert('Заказ успешно удалён');
            fetchOrders(); 
        } catch (error) {
            console.error('Error deleting order:', error);
            alert('Не удалось удалить заказ. Попробуйте позже.');
        }
    }

    function handleDeleteOrder(event) {
        const orderId = event.target.dataset.id;

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
                    <div class="modal-content">
                        <span class="close-btn">&times;</span>
                        <h2>Удаление заказа</h2>
                        <p><strong>Вы уверены, что хотите удалить заказ?
                        </strong></p>
                        <div class="del-modal-buttons">
                        <button class="cls-btn">Отмена</button>
                        <button class="del-btn">Удалить</button>
                        </div>
                    </div>
                `;

        document.body.appendChild(modal);

        const closeModalBtn = modal.querySelector('.close-btn');
        closeModalBtn.onclick = () => {
            modal.remove(); 
        };

        window.onclick = (event) => {
            if (event.target === modal) {
                modal.remove(); 
            }
        };
        const deleteModalBtn = modal.querySelector('.del-btn');
        deleteModalBtn.addEventListener("click",
            function (event) {
                deleteOrder(orderId);
            }
        );

        const closModalBtn = modal.querySelector('.cls-btn');
        closModalBtn.addEventListener("click",
            function (event) {
                modal.remove();
            }
        );
    }


    async function initializePage() {
        await fetchDishes();
        fetchOrders();
    }

    initializePage();
});
