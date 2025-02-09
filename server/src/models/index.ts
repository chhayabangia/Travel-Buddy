import sequelize from '../config/database';
import { UserFactory } from './user';
import { ItineraryFactory } from './itinerary';

const User = UserFactory(sequelize);
const Itinerary = ItineraryFactory(sequelize);

User.hasMany(Itinerary, { foreignKey: 'userId', as: 'itineraries' });
Itinerary.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export { User, Itinerary };