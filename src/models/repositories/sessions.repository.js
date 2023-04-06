const { getDAOS } = require("../daos/daosFactory");
const { CurrentUserDTO } = require("../dtos/users.dto");

const { sessionsDao } = getDAOS();

class SessionsRepository {
  constructor() {
    this.dao = sessionsDao;
  }
  async getUserSession(req) {
    const currentUser = new CurrentUserDTO(req.user);
    return currentUser;
  }
}

module.exports = new SessionsRepository();
