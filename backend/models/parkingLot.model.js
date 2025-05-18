const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ParkingLot = sequelize.define('ParkingLot', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  zipCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  totalSpots: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  // availableSpots can be managed dynamically or via hooks/triggers based on ParkingSpot status
  // For simplicity, we might initialize it, but real-time updates are more complex.
  availableSpots: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0, // Will be set by hook or manually
    validate: {
      min: 0,
      // Custom validator to ensure availableSpots <= totalSpots
      isLessThanOrEqualToTotal(value) {
        if (this.totalSpots && value > this.totalSpots) {
          throw new Error('Available spots cannot exceed total spots.');
        }
      }
    }
  },
  openingTime: { // e.g., "08:00:00"
    type: DataTypes.TIME,
    allowNull: true,
  },
  closingTime: { // e.g., "22:00:00"
    type: DataTypes.TIME,
    allowNull: true,
  },
  hourlyRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  status: {
    type: DataTypes.ENUM('open', 'closed', 'full', 'maintenance'),
    defaultValue: 'open'
  },
  ownerId: { // Foreign key to User model (an admin/manager)
    type: DataTypes.INTEGER,
    allowNull: true, // Or false if every lot must have an owner
    references: {
      model: 'Users', // Name of the Users table
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL' // Or 'RESTRICT' or 'CASCADE' depending on policy
  }
}, {
  timestamps: true,
  hooks: {
     beforeValidate: (lot) => {
         if (lot.isNewRecord && typeof lot.availableSpots === 'undefined') {
             lot.availableSpots = lot.totalSpots; // Initialize available spots
         } else if (lot.changed('totalSpots') && !lot.changed('availableSpots')) {
             // If totalSpots changes and availableSpots isn't explicitly set, adjust it
             // This is a simplistic adjustment, real logic might be more complex
             const diff = lot.totalSpots - lot.previous('totalSpots');
             lot.availableSpots = (lot.previous('availableSpots') || 0) + diff;
             if (lot.availableSpots < 0) lot.availableSpots = 0;
             if (lot.availableSpots > lot.totalSpots) lot.availableSpots = lot.totalSpots;
         }
     }
  }
});

module.exports = ParkingLot;