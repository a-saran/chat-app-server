const users = [];

const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find(user => user.room === room && user.name === name);

  if (existingUser) {
    console.log('existing')
    return {
      error: 'Username Already taken'
    }
  }
  const user = { id, name, room };
console.log('from addUser', user)

  users.push(user);

  return { user };
};

const removeUsers = (id) => {
  const index = users.findIndex(user => user.id === id)

  if(index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => users.find(user => user.id === id);

const getUsersInRoom = (room) => users.filter(user => user.room === room);

module.exports = {
  addUser,
  removeUsers,
  getUser,
  getUsersInRoom
}