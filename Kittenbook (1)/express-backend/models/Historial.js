const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('historial', {
    id_curso: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre_usuario: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'nombre_usuario'
      }
    },
    clave_materia: {
      type: DataTypes.CHAR(8),
      allowNull: false,
      references: {
        model: 'materias',
        key: 'clave_materia'
      }
    },
    estado: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    semestre_cursada: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    calificacion: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    periodo_cursada: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'historial',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_curso" },
        ]
      },
      {
        name: "nombre_usuario",
        using: "BTREE",
        fields: [
          { name: "nombre_usuario" },
        ]
      },
      {
        name: "clave_materia",
        using: "BTREE",
        fields: [
          { name: "clave_materia" },
        ]
      },
    ]
  });
};
