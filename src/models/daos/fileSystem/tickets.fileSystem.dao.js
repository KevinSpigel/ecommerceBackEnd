const fs = require("fs/promises");
const { TicketsModel } = require("../../schemas/tickets.schema");

class TicketsFileSystemDao {
  constructor(path) {
    this.path = path;
  }

  async getTickets() {
    try {
      const dataTickets = await fs.readFile(this.path, "utf-8");
      const allTickets = JSON.parse(dataTickets);
      return allTickets;
    } catch (error) {
      throw new Error(`Couldn't read file ${error}`);
    }
  }

  async saveTickets(allTickets) {
    await fs.writeFile(this.path, JSON.stringify(allTickets, null, "\t"));
  }

  async getTicketById(id) {
    try {
      const allTickets = await this.getTickets();
      const ticketById = allTickets.find((ticket) => ticket._id === id);
      return ticketById;
    } catch (error) {
      throw new Error("Ticket not found");
    }
  }

  async createTicket(payload) {
    try {
      const allTickets = await this.getTickets();
      const newTicket = new TicketsModel(payload);
      allTickets.push(newTicket);
      await this.saveTickets(allTickets);
      return newTicket;
    } catch (error) {
      throw new Error(`Error saving: ${error}`);
    }
  }

  async updateTicket(id, payload) {
    try {
      const allTickets = await this.getTickets();
      const ticketById = await this.getTicketById(id);

      const newTicketProperties = { ...ticketById, ...payload };

      const updatedTicket = allTickets.map((ticket) => {
        if (ticket._id === newTicketProperties._id) {
          return newTicketProperties;
        } else {
          return user;
        }
      });

      await this.saveTickets(updatedTicket);

      return updatedTicket;
    } catch (error) {
      throw new Error(`Couldn't update the ticket: ${error}`);
    }
  }
}

module.exports = TicketsFileSystemDao;
