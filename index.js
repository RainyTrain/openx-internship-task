//1
const getUserData = async () => {
  const users = await fetch('https://fakestoreapi.com/users');
  const data = await users.json();
  return data;
};

const getCartData = async () => {
  const cart = await fetch(
    'https://fakestoreapi.com/carts/?startdate=2000-01-01&enddate=2023-04-07',
  );
  const data = await cart.json();
  return data;
};

const getProductsData = async () => {
  const data = await fetch('https://fakestoreapi.com/products');
  const res = await data.json();
  return res;
};

//2
const productsCategory = async () => {
  let products = await getProductsData();
  let result = products.reduce((array, { category, price }) => {
    let findCategory = array.find((object) => object.category == category);
    if (findCategory) {
      findCategory.price += price;
    } else {
      array.push({ category, price });
    }
    return array;
  }, []);
  return result;
};

//3
const highest = async () => {
  const carts = await getCartData();
  const users = await getUserData();
  const products = await getProductsData();

  const cartsWithValue = carts.reduce((array, item) => {
    let value = 0;
    for (let i = 0; i < item.products.length; i++) {
      for (let j = 0; j < products.length; j++) {
        if (item.products[i].productId == products[j].id) {
          value += item.products[i].quantity * products[j].price;
        }
      }
    }
    array.push({ value: value, userId: item.userId });
    return array;
  }, []);

  const max = cartsWithValue.reduce((max, item) => {
    if (item.value > max.value) {
      max = item;
    }
    return max;
  }, cartsWithValue[0]);

  findUser = users.find((user) => user.id == max.userId);
  max.userName = `${findUser.name.firstname} ${findUser.name.lastname}`;
  return max;
};

//4
function getDistance(latitude1, longitude1, latitude2, longitude2) {
  let theta = longitude1 - longitude2;
  let distance =
    60 *
    1.1515 *
    (180 / Math.PI) *
    Math.acos(
      Math.sin(latitude1 * (Math.PI / 180)) * Math.sin(latitude2 * (Math.PI / 180)) +
        Math.cos(latitude1 * (Math.PI / 180)) *
          Math.cos(latitude2 * (Math.PI / 180)) *
          Math.cos(theta * (Math.PI / 180)),
    );
  return Math.round(distance * 1.609344, 2);
}

const furthest = async () => {
  const users = await getUserData();

  let max = getDistance(
    Number(users[0].address.geolocation.lat),
    Number(users[0].address.geolocation.long),
    Number(users[1].address.geolocation.lat),
    Number(users[1].address.geolocation.long),
  );

  let object = { first: users[0], second: users[1] };

  for (let i = 0; i < users.length - 1; i++) {
    for (let j = i + 1; j < users.length; j++) {
      const distance = getDistance(
        Number(users[i].address.geolocation.lat),
        Number(users[i].address.geolocation.long),
        Number(users[j].address.geolocation.lat),
        Number(users[j].address.geolocation.long),
      );
      if (distance > max) {
        max = distance;
        object = {
          first: users[i],
          second: users[j],
        };
      }
    }
  }
  return { object, max };
};

//testing all the functions

(async () => {
  //1
  const allUsers = await getUserData();
  console.log('All users', allUsers);
  const allCarts = await getCartData();
  console.log('All carts', allCarts);
  const allProducts = await getProductsData();
  console.log('All products', allProducts);
  //2
  const productsByCategory = await productsCategory();
  console.log('All products by category', productsByCategory);
  //3
  const highestCart = await highest();
  console.log('Max cart', highestCart);
  //4
  const furthestNeighbours = await furthest();
  console.log('Max distance', furthestNeighbours);
})();
