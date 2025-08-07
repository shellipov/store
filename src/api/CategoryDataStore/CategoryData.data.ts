import { CategoryEnum, ICategoryItem } from './CategoryData.types';

export const categoryItems: ICategoryItem[] = [
  {
    id: 1,
    type: CategoryEnum.clothesAndShoes,
    name: 'Одежда и обувь',
    image: 'https://cdn-icons-png.flaticon.com/512/1046/1046852.png',
  },
  {
    id: 2,
    type: CategoryEnum.householdGoods,
    name: 'Товары для дома',
    image: 'https://cdn-icons-png.flaticon.com/512/1046/1046857.png',
  },
  {
    id: 3,
    type: CategoryEnum.electronics,
    name: 'Электроника',
    image: 'https://cdn-icons-png.flaticon.com/512/1046/1046858.png',
  },
  {
    id: 4,
    type: CategoryEnum.householdAppliances,
    name: 'Бытовая техника',
    image: 'https://cdn-icons-png.flaticon.com/512/1046/1046859.png',
  },
  {
    id: 5,
    type: CategoryEnum.goodsForChildren,
    name: 'Товары для детей',
    image: 'https://cdn-icons-png.flaticon.com/512/1046/1046860.png',
  },
  {
    id: 6,
    type: CategoryEnum.constructionAndRenovation,
    name: 'Стройка и ремонт',
    image: 'https://cdn-icons-png.flaticon.com/512/1046/1046861.png',
  },
  {
    id: 7,
    type: CategoryEnum.furniture,
    name: 'Мебель',
    image: 'https://cdn-icons-png.flaticon.com/512/1046/1046862.png',
  },
  {
    id: 8,
    type: CategoryEnum.pharmacy,
    name: 'Аптека',
    image: 'https://cdn-icons-png.flaticon.com/512/1046/1046867.png',
  },
  {
    id: 9,
    type: CategoryEnum.hobbiesAndCreativity,
    name: 'Хобби и творчество',
    image: 'https://cdn-icons-png.flaticon.com/512/1046/1046864.png',
  },
];
