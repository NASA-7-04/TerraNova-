class Planet {
  constructor(data = {}) {
    this.name = data.name || "Unknown Planet";
    this.modifiers = {
      metabolism: data.modifiers?.metabolism || 1.0,
      solar: data.modifiers?.solar || 1.0,
      hvac: data.modifiers?.hvac || 1.0,
      water_eff: data.modifiers?.water_eff || 1.0,
      shield_need: data.modifiers?.shield_need || 0.0
    };
    this.start_adjustments = {
      O2: data.start_adjustments?.O2 || 0,
      H2O: data.start_adjustments?.H2O || 0,
      Food: data.start_adjustments?.Food || 0,
      Power: data.start_adjustments?.Power || 0
    };
  }
}

class City {
  constructor(data = {}) {
    this.name = data.name || "New Settlement";
    this.population = data.population || 0;
    this.type = data.type || "colony";
  }
}

class Building {
  constructor(data = {}) {
    this.id = data.id || "unknown_building";
    this.name = data.name || "Unknown Structure";
    this.cost = data.cost || 0;
    this.dailyEffects = data.dailyEffects || {};
    this.capacity = data.capacity || {};
    this.startBonus = data.startBonus || {};
  }
}

class Crew {
  constructor(data = {}) {
    this.name = data.name || "Crew Member";
    this.role = data.role || "generalist";
    this.health = data.health || 100;
    this.morale = data.morale || 100;
  }
}

export { Planet, City, Building, Crew };
