const { faker } = require("@faker-js/faker");

faker.locale = "en";

const generateProduct = () => {
  return {
    _id: faker.database.mongodbObjectId(),
    title: faker.commerce.product(),
    description: faker.commerce.productName(),
    code: faker.random.alphaNumeric(8),
    price: faker.commerce.price(),
    thumbnails: faker.image.image(),
    stock: faker.datatype.number({ min: 0, max: 100 }),
    category: faker.commerce.department(),
    status: faker.datatype.boolean(),
  };
};

const ages = [];
for (let i = 0; i <= 60; i++) {
  ages.push(i + 14);
}

const generateUser = () => {
  return {
    _id: faker.database.mongodbObjectId(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    age: faker.helpers.arrayElement(ages),
    password: "1234",
    role: faker.helpers.arrayElements(["user", "admin", "premium"]),
    cart: faker.database.mongodbObjectId(),
  };
};

module.exports = { generateProduct, generateUser };
