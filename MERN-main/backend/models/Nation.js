const mongoose = require('mongoose');

// Sub-schema for Health within People
const healthSchema = new mongoose.Schema({
    procedures: { type: Number, default: 0 },
    vaccines: { type: Number, default: 0 },
    hospitals: { type: Number, default: 0 },
});

// Sub-schema for Satisfaction within People
const satisfactionSchema = new mongoose.Schema({
    infrastructure: { type: Number, default: 0 },
    politicalStability: { type: Number, default: 0 },
    education: { type: Number, default: 0 },
    internalSafety: { type: Number, default: 0 },
    freedom: { type: Number, default: 0 },
    economy: { type: Number, default: 0 },
});

// Sub-schema for People
const peopleSchema = new mongoose.Schema({
    TotalBudget: { type: Number, default: 0 },
    health: healthSchema,
    satisfaction: satisfactionSchema,
    productivity: { type: Number, default: 0 },
});

// Sub-schema for Personnel within Military
const personnelSchema = new mongoose.Schema({
    training: { type: Number, default: 0 },
    wellBeing: { type: Number, default: 0 },
});

// Sub-schema for Equipment within Military
const equipmentSchema = new mongoose.Schema({
    bases: { type: Number, default: 0 },
    ports: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    equipmentQuality: { type: Number, default: 0 },
});

// Sub-schema for Military
const militarySchema = new mongoose.Schema({
    TotalBudget: { type: Number, default: 0 },
    personnel: personnelSchema,
    equipment: equipmentSchema,
    performance: { type: Number, default: 0 },
});

// Sub-schema for Economy
const economySchema = new mongoose.Schema({
    inflation: { type: Number, default: 0 },
    income: {
        taxRate: { type: Number, default: 0 },
        exports: { type: Number, default: 0 },
    },
    spending: {
        debt: { type: Number, default: 0 },
        imports: { type: Number, default: 0 },
    },
});

// Main schema for the nation
const nationSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    nationalBank: { type: Number, default: 0 },
    peopleindex: { type: Number, default: 0 },
    militaryindex: { type: Number, default: 0 },
    economyindex: { type: Number, default: 0 },
    people: peopleSchema,           // Add this nested field
    military: militarySchema,       // Add this nested field
    economy: economySchema,         // Add this nested field
});

// Model
const Nation = mongoose.model('Nation', nationSchema);

module.exports = Nation;
