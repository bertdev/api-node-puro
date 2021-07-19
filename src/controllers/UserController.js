let users = require('./../mocks/users');

module.exports = {
  listUsers(request, response) {
    const { order } = request.query;

    const sortedUsers = users.sort((a, b) => {
      if (order == 'desc') {
        return a.id < b.id ? 1 : -1;
      }

      return a.id > b.id ? 1 : -1;
    });

    response.send(200, sortedUsers);
  },

  listUserById(request, response) {
    const { id } = request.params;


    const user = users.find((user) => user.id === Number(id));

    if (!user) {
      return response.send(400, {error: 'User not found'});
    } 

    return response.send(200, user);
  },

  createUser(request, response) {
    const { name } = request.body;
    const lastUserId = users[users.length - 1].id;

    const newUser = {
      id: lastUserId + 1,
      name
    };

    users.push(newUser);
    response.send(200, newUser);
  },

  updateUser(request, response) {
    const { id } = request.params;
    const { name } = request.body;

    const userExists = users.find((user) => user.id === Number(id));

    if (!userExists) {
      return response.send(400, {error: 'User not found'});
    }

    users = users.map((user) => {
      if (user.id === Number(id)) {
        return {...user, name};
      }

      return user;
    });

    response.send(200, {id, name});
  },

  deleteUser(request, response) {
    const { id } = request.params;

    users = users.filter((user) => user.id !== Number(id));

    response.send(200, {deleted: true});
  }

};
