import { User } from '../models/user.js';

export const seedUsers = async () => {
  await User.bulkCreate([
    {
        username: 'admin',
        email: 'admin@admin.com',
        password: 'admin',
    },
    {
        username: 'firstUser',
        email: 'first@thisguy.com',
        password: 'first_password',
    },
  ], { individualHooks: true });
};