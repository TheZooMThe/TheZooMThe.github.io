const menuItems = {
  soups: [
    {
      keyword: 'gazpacho',
      name: 'Гаспачо',
      price: 195,
      count: '350 г',
      image: 'img/gazpacho.jpg',
      kind: 'veg' // вегетарианский
    },
    {
      keyword: 'mushroom_soup',
      name: 'Грибной суп-пюре',
      price: 185,
      count: '330 г',
      image: 'img/mushroom_soup.jpg',
      kind: 'veg' // вегетарианский
    },
    {
      keyword: 'norwegian_soup',
      name: 'Норвежский суп',
      price: 210,
      count: '300 г',
      image: 'img/norwegian_soup.jpg',
      kind: 'fish' // рыбный
    },
    {
      keyword: 'chicken_soup',
      name: 'Куриный суп',
      price: 190,
      count: '300 г',
      image: 'img/tomyum.jpg',
      kind: 'meat' // мясной
    },
    {
      keyword: 'salmon_soup',
      name: 'Суп с лососем',
      price: 215,
      count: '300 г',
      image: 'img/chicken.jpg',
      kind: 'fish' // рыбный
    },
    {
      keyword: 'beef_soup',
      name: 'Говяжий суп',
      price: 200,
      count: '320 г',
      image: 'img/ramen.jpg',
      kind: 'meat' // мясной
    }
  ],
  mainDishes: [
    {
      keyword: 'friedpotatoeswithmushrooms1',
      name: 'Жареная картошка с грибами',
      price: 150,
      count: '250 г',
      image: 'img/friedpotatoeswithmushrooms1.jpg',
      kind: 'veg' // вегетарианское
    },
    {
      keyword: 'lasagna',
      name: 'Лазанья',
      price: 385,
      count: '310 г',
      image: 'img/lasagna.jpg',
      kind: 'meat' // мясное
    },
    {
      keyword: 'chickencutletsandmashedpotatoes',
      name: 'Котлеты из курицы с картофельным пюре',
      price: 225,
      count: '280 г',
      image: 'img/chickencutletsandmashedpotatoes.jpg',
      kind: 'meat' // мясное
    },
    {
      keyword: 'grilled_salmon',
      name: 'Лосось на гриле',
      price: 400,
      count: '300 г',
      image: 'img/fishrice.jpg',
      kind: 'fish' // рыбное
    },
    {
      keyword: 'vegetable_curry',
      name: 'Овощное карри',
      price: 250,
      count: '250 г',
      image: 'img/pizza.jpg',
      kind: 'veg' // вегетарианское
    },
    {
      keyword: 'fried_shrimp',
      name: 'Креветки в кляре',
      price: 280,
      count: '270 г',
      image: 'img/shrimppasta.jpg',
      kind: 'fish' // рыбное
    }
  ],
  salads: [
    {
      keyword: 'caesar_salad',
      name: 'Салат Цезарь',
      price: 220,
      count: '200 г',
      image: 'img/tunasalad.jpg',
      kind: 'meat' // мясной
    },
    {
      keyword: 'greek_salad',
      name: 'Греческий салат',
      price: 180,
      count: '200 г',
      image: 'img/saladwithegg.jpg',
      kind: 'veg' // вегетарианский
    },
    {
      keyword: 'bruschetta',
      name: 'Брускетта с томатами',
      price: 140,
      count: '150 г',
      image: 'img/caesar.jpg',
      kind: 'veg' // вегетарианский
    },
    {
      keyword: 'shrimp_salad',
      name: 'Салат с креветками',
      price: 250,
      count: '200 г',
      image: 'img/frenchfries1.jpg',
      kind: 'fish' // рыбный
    },
    {
      keyword: 'beet_salad',
      name: 'Картошка',
      price: 170,
      count: '180 г',
      image: 'img/frenchfries2.jpg',
      kind: 'veg' // вегетарианский
    },
    {
      keyword: 'hummus_plate',
      name: 'Хумус с овощами',
      price: 160,
      count: '200 г',
      image: 'img/caprese.jpg',
      kind: 'veg' // вегетарианский
    }
  ],
  drinks: [
    {
      keyword: 'orangejuice',
      name: 'Апельсиновый сок',
      price: 120,
      count: '300 мл',
      image: 'img/orangejuice.jpg',
      kind: 'cold' // холодный
    },
    {
      keyword: 'applejuice',
      name: 'Яблочный сок',
      price: 90,
      count: '300 мл',
      image: 'img/applejuice.jpg',
      kind: 'cold' // холодный
    },
    {
      keyword: 'carrotjuice',
      name: 'Морковный сок',
      price: 110,
      count: '300 мл',
      image: 'img/carrotjuice.jpg',
      kind: 'cold' // холодный
    },
    {
      keyword: 'green_tea',
      name: 'Зеленый чай',
      price: 80,
      count: '250 мл',
      image: 'img/greentea.jpg',
      kind: 'hot' // горячий
    },
    {
      keyword: 'black_coffee',
      name: 'Черный кофе',
      price: 100,
      count: '200 мл',
      image: 'img/cappuccino.jpg',
      kind: 'hot' // горячий
    },
    {
      keyword: 'hot_chocolate',
      name: 'Горячий шоколад',
      price: 130,
      count: '250 мл',
      image: 'img/tea.jpg',
      kind: 'hot' // горячий
    }
  ],
  desserts: [
    {
      keyword: 'chocolate_cake',
      name: 'Шоколадный торт',
      price: 150,
      count: '150 г',
      image: 'img/chocolatecheesecake.jpg',
      kind: 'small' // маленькая порция
    },
    {
      keyword: 'donats',
      name: 'Пончики',
      price: 200,
      count: '200 г',
      image: 'img/donuts.jpg',
      kind: 'medium' // средняя порция
    },
    {
      keyword: 'small_donats',
      name: 'Мало пончиков',
      price: 120,
      count: '180 г',
      image: 'img/donuts2.jpg',
      kind: 'small' // маленькая порция
    },
    {
      keyword: 'ice_cream',
      name: 'Мороженое',
      price: 100,
      count: '100 г',
      image: 'img/checheesecake.jpg',
      kind: 'small' // маленькая порция
    },
    {
      keyword: 'panna_cotta',
      name: 'Панна Котта',
      price: 160,
      count: '150 г',
      image: 'img/baklava.jpg',
      kind: 'medium' // средняя порция
    },
    {
      keyword: 'big_chocolate_cake',
      name: 'Большой шоколадный торт',
      price: 250,
      count: '250 г',
      image: 'img/chocolatecake.jpg',
      kind: 'large' // большая порция
    }
  ]
};
