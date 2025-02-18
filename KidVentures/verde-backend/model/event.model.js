const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const eventSchema = new Schema(
  {
    name: { 
      type: String, 
      required: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*$/.test(v);
        },
        message: "El nombre solo debe contener letras y espacios",
      },
    },

    description: { 
      type: String,
      validate: [
        {
          validator: function (v) {
            const regex = /^[A-Za-zÀ-ÿÑñ0-9\s¡!¿?.,]*$/;
            return regex.test(v);
          },
          message: "La descripción contiene caracteres no permitidos",
        },
        {
          validator: function (v) {
            return v.length === 0 || v.length >= 10;
          },
          message: "La descripción debe tener al menos 10 caracteres",
        },
      ],
    },

    category: { 
      type: String, 
      ref: "Category",
      required: true
  },
  
  
    is_unique_date: {
      type: Boolean,
      required: true,
      default: false, 
    },

    dates: {
      type: [Date],
      required: function () {
        return !this.recurrence.frequency;
      },
    },
    
    recurrence: {
      frequency: {
        type: String,
        enum: ['weekly', 'monthly', 'yearly'],
        required: function () {          
          return this.dates && this.dates.length === 1;
        },
      },
      interval: {
        type: Number,
        default: 1,
      },
      endDate: {
        type: Date,
      },
    },

    startTime: { 
      type: String, 
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },
      
    endTime: { 
      type: String, 
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },

    city: { type: String },

    coordinates: { type: [Number] }, 

    ubication: { type: String },

    managers: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true
    }], 

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Referencia solo a usuarios aceptados
      },
    ], 
    
    event_type: { 
      type: String, 
      enum: ['privado', 'abierto'] 
    }, 

    participants_limit: {
      type: Number,
      validate: {
        validator: function (v) {
          return /^\d*$/.test(v);
        },
        message: "El límite de participantes debe ser un número válido",
      },
    },
    
    age_range: { type: String },

    price: {
      type: Number, // Cambiar a Number
        validate: {
        validator: function (v) {
            return v >= 0; // El precio debe ser mayor o igual a 0
        },
        message: "El precio debe ser un número válido y positivo",
      },
    },

    applications: [{ type: String }], 

    deletedAt: { type: Date },

    photos: [{ 
      type: String,
    }],

    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review", 
      },
    ],
    reviewCount: { type: Number, default: 0 },
  }, 
  { timestamps: true }
);

module.exports = mongoose.model("event", eventSchema);
