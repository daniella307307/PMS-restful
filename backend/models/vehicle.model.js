const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Vehicle = sequelize.define('Vehicle', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  licensePlate: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // License plates should be globally unique
  },
  make: {
    type: DataTypes.STRING,
    allowNull: true
  },
  model: {
    type: DataTypes.STRING,
    allowNull: true
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,
  hooks: {
     // Ensure only one vehicle is default per user
     beforeSave: async (vehicle, options) => {
         if (vehicle.isDefault && vehicle.changed('isDefault')) {
             await Vehicle.update(
                 { isDefault: false },
                 {
                     where: {
                         userId: vehicle.userId,
                         id: { [DataTypes.Op.ne]: vehicle.id } // Exclude current vehicle
                     },
                     transaction: options.transaction
                 }
             );
         }
     }
  }
});

module.exports = Vehicle;