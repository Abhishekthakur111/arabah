const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    role: {
      type: DataTypes.ENUM('0','1','2'),
      allowNull: false,
      defaultValue: "1"
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    image: {
      type: DataTypes.STRING(233),
      allowNull: false,
      defaultValue: ""
    },
    phone_number: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    country_code: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    otp: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    date: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    passcode: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    is_verfied: {
      type: DataTypes.ENUM('0','1'),
      allowNull: false,
      defaultValue: "0"
    },
    status: {
      type: DataTypes.ENUM('0','1'),
      allowNull: false,
      defaultValue: "1"
    }
  }, {
    sequelize,
    tableName: 'users',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
