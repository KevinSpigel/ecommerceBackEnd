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

module.exports = { generateProduct };
