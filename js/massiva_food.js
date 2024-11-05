const orderContainer = {
  soups: document.querySelector("#drop-soup"),
  mainDishes: document.querySelector("#drop-main-dishes"),
  salads: document.querySelector("#drop-salads"),
  desserts: document.querySelector("#drop-desserts"),
  drinks: document.querySelector("#drop-main-drinks"),
};

function loadMenuItems() {
  const containerMapping = {
    soups: document.querySelector('.dishes'),
    mainDishes: document.querySelector('.main-dishes'),
    salads: document.querySelector('.salad'),
    desserts: document.querySelector('.dessert'),
    drinks: document.querySelector('.drinks')
  };
  
  for (const category in containerMapping) {
    if (!containerMapping[category]) {
      console.error(`Контейнер для категории ${category} не найден.`);
      return;
    }
  }
  
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

      button.addEventListener('click', () => selectItem(category, item, card));

      card.appendChild(img);
      card.appendChild(price);
      card.appendChild(name);
      card.appendChild(volume);
      card.appendChild(button);
      container.appendChild(card);



      
    });


    
  }
  

}

const selectedItems = {
  soups: null,
  mainDishes: null,
  salads: null,
  desserts: null,
  drinks: null,
};

function selectItem(category, item, card) {
  if (selectedItems[category]) {
    const prevCard = document.querySelector(`[data-dish="${selectedItems[category].keyword}"]`);
    if (prevCard) {
      prevCard.classList.remove('selected'); 
    }
  }

  selectedItems[category] = item;
  card.classList.add('selected'); 
  updateOrderSummary(); 
}

function updateOrderSummary() {
  let totalCost = 0;
  for (const category in selectedItems) {
    const item = selectedItems[category];
    if (item) {
      orderContainer[category].innerHTML = `${item.name} - ${item.price} ₽`;
      totalCost += item.price;
    } else {
      orderContainer[category].innerHTML = `${category === "soups" ? "Суп не выбран" : category === "mainDishes" ? "Главное блюдо не выбрано" : "Напиток не выбран"}`;
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

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault(); 

  const form = event.target;
  form.querySelectorAll(".order-hidden-field").forEach(field => field.remove());

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

  form.submit();
});

document.addEventListener("DOMContentLoaded", () => {
  loadMenuItems(); 
  updateOrderSummary(); 
});

function filters() {
  const filterButtons = document.querySelectorAll('.filter-button');
  filterButtons.forEach(button => {
    let datasetFlag = '';
    
    button.addEventListener('click', () => {
      const buttonsContainer = button.parentElement;
      const targetContainer = buttonsContainer.nextElementSibling;
      const children = targetContainer.children;

      Array.from(children).forEach(child => {
        child.style.display = 'none';
        if (datasetFlag !== button.dataset.kind) {
          if (child.dataset.kind == button.dataset.kind) {
            child.style.display = 'flex';
          }
        } else {
          child.style.display = 'flex';
        }
      });

      datasetFlag = (datasetFlag == button.dataset.kind) ? '' : button.dataset.kind;
    });
  });
}

filters();

