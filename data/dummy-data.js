import Product from "../models/product";

const PRODUCTS = [
  new Product(
    "p1",
    "Normalsaltat Bregott",
    "7310860005767",
    "https://www.onfos.de/media/catalog/product/cache/2/image/394x394/9df78eab33525d08d6e5fb8d27136e95/7/3/7310860005767.jpg",
    5981600.0,
    new Date(Date.now() + 3600 * 1000 * 24).toLocaleDateString()
  ),
  new Product(
    "p2",
    "Havredryck iKaffe Oatly",
    "7394376616037",
    "https://www.ergostar.fi/media/img/prods/s/hi/83925.jpg",
    35.0,
    "2022-10-21"
  ),
  new Product(
    "p3",
    "Créme fraiche ICA",
    "7318690140436",
    "https://www.onfos.de/media/catalog/product/cache/1/image/394x394/9df78eab33525d08d6e5fb8d27136e95/7/3/7318690140436.jpg",
    0.0,
    new Date(Date.now()).toLocaleDateString()
  ),
  new Product(
    "p4",
    "Hönekaka Pågen",
    "7311070003543",
    "https://www.onfos.de/media/catalog/product/cache/1/image/394x394/9df78eab33525d08d6e5fb8d27136e95/7/3/7311070003543.jpg",
    51.25,
    new Date(Date.now() - 3600 * 1000 * 24 * 2).toLocaleDateString()
  ),
  new Product(
    "p5",
    "Yoghurt Original Samoa Yoggi",
    "7310865018496",
    "https://cdn-kund.arla.se/remote/api.opv.se/WS/Arla/HierarchyService/v120/thumbnails/px300/h7ns5bduxwat3o3pkarmsovlxu000000.Png",
    47.15,
    new Date(Date.now() + 3600 * 1000 * 24 * 7).toLocaleDateString()
  ),
];

export default PRODUCTS;
