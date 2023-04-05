class CurrentUserDTO {
  constructor(payload) {
    this.first_name = payload.name;
    this.last_name = payload.lastName;
    this.full_name = `${payload.name} ${payload.lastName || ""}`.trim();
    this.email = payload.email;
    this.role = payload.role;
  }
}

module.exports = { CurrentUserDTO };
