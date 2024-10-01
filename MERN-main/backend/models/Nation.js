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
    soldiersAmount: { type: Number, default: 0 },
    people: peopleSchema,
    military: militarySchema,
    economy: economySchema,
});

// Function to calculate average of given values
function calculateAverage(values) {
    const total = values.reduce((sum, value) => sum + value, 0);
    return total / values.length;
}

// Function to compute aggregate values
nationSchema.methods.calculateOverallHealth = function () {
    const { procedures, vaccines, hospitals } = this.people.health;
    return calculateAverage([procedures, vaccines, hospitals]);
};

nationSchema.methods.calculateOverallSatisfaction = function () {
    const {
        infrastructure,
        politicalStability,
        education,
        internalSafety,
        freedom,
        economy
    } = this.people.satisfaction;
    return calculateAverage([
        infrastructure,
        politicalStability,
        education,
        internalSafety,
        freedom,
        economy,
    ]);
};

nationSchema.methods.calculateOverallPeople = function () {
    const health = this.calculateOverallHealth();
    const satisfaction = this.calculateOverallSatisfaction();
    const productivity = this.people.productivity;
    return calculateAverage([health, satisfaction, productivity]);
};

nationSchema.methods.calculateOverallPersonnel = function () {
    const { training, wellBeing } = this.military.personnel;
    return calculateAverage([training, wellBeing]);
};

nationSchema.methods.calculateOverallEquipment = function () {
    const {
        bases,
        ports,
        communication,
        equipmentQuality,
    } = this.military.equipment;
    return calculateAverage([bases, ports, communication, equipmentQuality]);
};

nationSchema.methods.calculateOverallMilitary = function () {
    const personnel = this.calculateOverallPersonnel();
    const equipment = this.calculateOverallEquipment();
    const performance = this.military.performance;
    return calculateAverage([personnel, equipment, performance]);
};

nationSchema.methods.calculateOverallEconomy = function () {
    const { inflation } = this.economy;
    const { taxRate, exports } = this.economy.income;
    const { debt, imports } = this.economy.spending;
    return calculateAverage([inflation, taxRate, exports, debt, imports]);
};

// Function to compute overall nation stats
nationSchema.methods.calculateOverallNation = function () {
    const people = this.calculateOverallPeople();
    const military = this.calculateOverallMilitary();
    const economy = this.calculateOverallEconomy();
    return calculateAverage([people, military, economy]);
};

// Model
const Nation = mongoose.model('Nation', nationSchema);

module.exports = Nation;
