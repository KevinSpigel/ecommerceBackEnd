const { uuid } = require("uuid");

class TicketDTO {
  constructor(purchaser, amount, products) {
    this.products = products;
    this.purchaser = purchaser.email;
    this.amount = amount;
    this.purchase_datetime = new Date();
    this.code = uuid();
  }
}

module.exports = { TicketDTO };
