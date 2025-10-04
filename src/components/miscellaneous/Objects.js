class Planet {
  constructor(data = {}) {
    this.id = data.id || "unknown";
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
    this.events = data.events || [];
  }

  getEventForDay(day) {
    return this.events.find(event => event.day === day);
  }

  calculateHabitatPower(hasThermX = false) {
    const habitatBase = 2;
    const hvacBase = 2;
    const thermxMultiplier = hasThermX ? 0.8 : 1.0;
    
    return habitatBase + (hvacBase * this.modifiers.hvac * thermxMultiplier);
  }

  calculateSolarPower() {
    return 6 * this.modifiers.solar;
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
    this.useCosts = data.useCosts || {};
    this.charges = data.charges || null;
    this.notes = data.notes || "";
  }

  getDailyEffects(crewCount = 1, planet = null) {
    const effects = { ...this.dailyEffects };
    
    Object.keys(effects).forEach(resource => {
      const effect = effects[resource];
      if (typeof effect === 'string' && effect.includes('_per_crew')) {
        const baseValue = parseFloat(effect.replace('_per_crew', ''));
        effects[resource] = baseValue * crewCount;
      } else if (typeof effect === 'string' && effect.includes('_team')) {
        const baseValue = parseFloat(effect.replace('_team', ''));
        effects[resource] = baseValue;
      }
    });

    return effects;
  }

  getStartBonus(planet = null) {
    const bonus = { ...this.startBonus };
    
    if (planet && this.id === 'water_tank') {
      bonus.H2O = 200 * planet.modifiers.water_eff;
    }
    
    return bonus;
  }
}

class Crew {
  constructor(data = {}) {
    this.id = data.id || "crew_member";
    this.name = data.name || "Crew Member";
    this.role = data.role || "generalist";
    this.health = data.health || 100;
    this.morale = data.morale || 100;
  }

  getDailyMetabolism(planet = null) {
    const metabolism = planet ? planet.modifiers.metabolism : 1.0;
    
    return {
      O2: -0.84 * metabolism,
      H2O: -3.0 * metabolism,
      Food: -0.6 * metabolism,
      Power: -1.0 * metabolism,
      Health: -2,
      Morale: -2
    };
  }

  static calculateCrewCost(crewCount) {
    if (crewCount <= 3) {
      return crewCount * 4;
    } else {
      return (3 * 4) + ((crewCount - 3) * 6);
    }
  }
}

const GAME_METADATA = {
  version: "1.0",
  game: {
    title: "TerraNova",
    days: 5,
    points_budget: 100
  }
};

const PRODUCTION_BASELINES = {
  Solar_per_array_kwh_per_day: "6 * planet.solar",
  NGen_kwh_per_day: 15,
  LSS_Bio: { O2: 1.0, H2O: 2.0, Power: -5 },
  Greenhouse_small: { Food: 0.5, O2: 0.2, H2O: -1, Power: -3 }
};

class GameRules {
  constructor() {
    this.units = {
      O2: "kg",
      H2O: "L", 
      Food: "kg",
      Power: "kWh",
      Health: "0-100 per crew",
      Morale: "0-100 team"
    };

    this.baseStocks = {
      O2: 15,
      H2O: 60,
      Food: 12,
      Power: 80,
      Health: 100,
      Morale: 100
    };

    this.dailyUpdateOrder = [
      "apply_event_choice_effects",
      "apply_module_daily_effects",
      "apply_crew_metabolism (× planet.metabolism)",
      "apply_habitat_hvac_power (habitat_base + hvac)",
      "clamp_resources_to_zero_and_check_fail",
      "update_health_morale_and_check_fail"
    ];
  }

  calculateStartResources(crewCount) {
    const crewScale = crewCount / 3;
    return {
      O2: this.baseStocks.O2 * crewScale,
      H2O: this.baseStocks.H2O * crewScale,
      Food: this.baseStocks.Food * crewScale,
      Power: this.baseStocks.Power * crewScale,
      Health: 100,
      Morale: 100
    };
  }

  checkFailureConditions(resources) {
    return resources.O2 <= 0 || resources.H2O <= 0 || 
           resources.Food <= 0 || resources.Health <= 0;
  }

  checkSuccessConditions(resources) {
    return resources.Health > 0 && resources.O2 > 0 && 
           resources.H2O > 0 && resources.Food > 0;
  }
}

class GameEvent {
  constructor(data = {}) {
    this.day = data.day || 1;
    this.title = data.title || "Unknown Event";
    this.effect = data.effect || "";
    this.choices = data.choices || [];
    this.branch = data.branch || null;
  }

  getAvailableChoices(gameState = {}) {
    if (this.branch) {
      if (this.branch.if_sensor_fixed && gameState.sensor_fixed) {
        return this.branch.if_sensor_fixed;
      } else if (this.branch.if_sensor_failed && !gameState.sensor_fixed) {
        return this.branch.if_sensor_failed;
      }
    }
    return this.choices;
  }
}
class ResourceManager {
  constructor(initialResources = {}) {
    this.resources = { ...initialResources };
    this.dailyPowerProduced = [];
    this.dailyPowerConsumed = [];
  }

  applyChanges(changes) {
    Object.keys(changes).forEach(resource => {
      if (this.resources.hasOwnProperty(resource)) {
        this.resources[resource] += changes[resource];
      }
    });
  }

  clampAndCheck() {
    const failures = [];
    
    Object.keys(this.resources).forEach(resource => {
      if (this.resources[resource] < 0) {
        this.resources[resource] = 0;
        if (['O2', 'H2O', 'Food', 'Health'].includes(resource)) {
          failures.push(resource);
        }
      }
    });

    return failures;
  }

  getAggregateResources() {
    return this.resources.O2 + this.resources.H2O + 
           this.resources.Food + this.resources.Power;
  }

  getPowerBalance() {
    const produced = this.dailyPowerProduced.reduce((sum, val) => sum + val, 0);
    const consumed = this.dailyPowerConsumed.reduce((sum, val) => sum + val, 0);
    return produced - consumed;
  }
}

class ScoringSystem {
  constructor(initialResources = {}) {
    this.initialResources = { ...initialResources };
  }

  calculateSurvivalScore(finalResources) {
    const healthScore = Math.max(0, Math.min(100, finalResources.Health));
    const moraleScore = Math.max(0, Math.min(100, finalResources.Morale));
    const resourceEfficiency = this.calculateResourceEfficiency(finalResources);
    
    return healthScore + moraleScore + (50 * resourceEfficiency);
  }

  calculateResourceEfficiency(finalResources) {
    const initialTotal = this.getAggregateResources(this.initialResources);
    const finalTotal = finalResources.O2 + finalResources.H2O + 
                      finalResources.Food + finalResources.Power;
    
    return initialTotal > 0 ? finalTotal / initialTotal : 0;
  }

  getVerdict(survivalScore, powerBalance, success) {
    if (survivalScore >= 200 && powerBalance >= 0) {
      return "Excellent";
    } else if (success) {
      return "Survived";
    } else {
      return "Failed";
    }
  }

  getAggregateResources(resources) {
    return resources.O2 + resources.H2O + resources.Food + resources.Power;
  }
}

const PLANET_DATA = {
  kepler22b: {
    id: "kepler22b",
    name: "Kepler-22b",
    modifiers: { metabolism: 1.15, solar: 1.0, hvac: 1.0, water_eff: 1.2, shield_need: 0.0 },
    start_adjustments: { O2: 0, H2O: 0, Food: 0, Power: 0 }
  },
  trappist1e: {
    id: "trappist1e", 
    name: "TRAPPIST-1e",
    modifiers: { metabolism: 0.9, solar: 0.6, hvac: 1.2, water_eff: 1.0, shield_need: 0.1 },
    start_adjustments: { O2: 0, H2O: 0, Food: 0, Power: 0 }
  },
  kepler452b: {
    id: "kepler452b",
    name: "Kepler-452b", 
    modifiers: { metabolism: 1.05, solar: 1.1, hvac: 1.1, water_eff: 1.0, shield_need: 0.0 },
    start_adjustments: { O2: 0, H2O: 0, Food: 0, Power: 0 }
  },
  proximab: {
    id: "proximab",
    name: "Proxima Centauri b",
    modifiers: { metabolism: 1.0, solar: 0.5, hvac: 1.4, water_eff: 1.0, shield_need: 0.2 },
    start_adjustments: { O2: 2, H2O: 0, Food: 0, Power: -10 }
  },
  "55cancrie": {
    id: "55cancrie",
    name: "55 Cancri e",
    modifiers: { metabolism: 1.15, solar: 2.0, hvac: 2.0, water_eff: 0.7, shield_need: 0.3 },
    start_adjustments: { O2: 5, H2O: 40, Food: 0, Power: 20 }
  }
};

const COMPONENT_DATA = {
  hab_dome: {
    id: "hab_dome",
    name: "Habitat Dome (required)",
    cost: 20,
    capacity: { crew: 4 },
    dailyEffects: { Power: -2 },
    notes: "Pressurization/ventilation baseline. HVAC separate."
  },
  therm_x: {
    id: "therm_x", 
    name: "Therm-X (Thermal Control)",
    cost: 8,
    dailyEffects: { Power: "- hvac_base * planet.hvac * 0.8" },
    notes: "Reduces HVAC energy ~20%."
  },
  lss_bio: {
    id: "lss_bio",
    name: "LSS-Bio", 
    cost: 15,
    dailyEffects: { O2: 1.0, H2O: 2.0, Power: -5 }
  },
  water_tank: {
    id: "water_tank",
    name: "Water Tank (200 L)",
    cost: 7,
    dailyEffects: { Power: -0.5 },
    startBonus: { H2O: "200 * planet.water_eff" },
    notes: "Also usable as radiation shielding mass."
  },
  shield_reg: {
    id: "shield_reg",
    name: "Shield-Reg",
    cost: 12,
    dailyEffects: { Power: -2 },
    notes: "Planet radiation requirement varies."
  },
  battery: {
    id: "battery",
    name: "Battery Pack (50 kWh)",
    cost: 6,
    startBonus: { Power: 50 }
  },
  
  solar_array: {
    id: "solar_array",
    name: "Solar Array (~20 m²)",
    cost: 8,
    dailyEffects: { Power: "6 * planet.solar" }
  },
  n_gen: {
    id: "n_gen",
    name: "N-Gen (RTG/Nuclear equiv.)",
    cost: 22,
    dailyEffects: { Power: 15 }
  },
  
  airlock: {
    id: "airlock",
    name: "EVA Airlock",
    cost: 6,
    dailyEffects: { Power: -0.5 },
    useCosts: { EVA_cycle: { Power: -2 } }
  },
  workshop: {
    id: "workshop",
    name: "Workshop",
    cost: 8,
    dailyEffects: { Power: -2 }
  },
  spares: {
    id: "spares",
    name: "Spares Pack",
    cost: 4,
    charges: 3,
    notes: "Allows 3 repairs."
  },
  
  agri_pod: {
    id: "agri_pod",
    name: "Agri-Pod (Small Greenhouse)",
    cost: 12,
    dailyEffects: { Food: 0.5, O2: 0.2, H2O: -1, Power: -3 }
  },
  
  quarters: {
    id: "quarters",
    name: "Private Quarters",
    cost: 5,
    dailyEffects: { Power: -1, Morale: "+2_per_crew" }
  },
  bathroom: {
    id: "bathroom",
    name: "Bathroom / Hygiene",
    cost: 6,
    dailyEffects: { Power: -1, H2O: "-2_per_crew", Health: "+3_per_crew" }
  },
  community: {
    id: "community",
    name: "Community / Mess",
    cost: 8,
    dailyEffects: { Power: -2, H2O: "-1_per_crew", Food: "-0.1_per_crew", Morale: "+5_team" }
  },
  exercise: {
    id: "exercise",
    name: "Exercise Area",
    cost: 6,
    dailyEffects: { Power: -1, Food: "+0.1_per_crew", Health: "+3_per_crew", Morale: "+2_per_crew" }
  },
  medbay: {
    id: "medbay",
    name: "Medical Bay",
    cost: 10,
    dailyEffects: { Power: -2 },
    onUse: { Power: -5, Health: "+10_target" }
  },
  comms: {
    id: "comms",
    name: "Communication Hub",
    cost: 5,
    dailyEffects: { Power: -1, Morale: "+4_team" }
  },
  window: {
    id: "window",
    name: "Observation Window",
    cost: 3,
    dailyEffects: { Power: -0.5, Morale: "+2_team" }
  },
  green_relax: {
    id: "green_relax",
    name: "Greenhouse Relax Zone",
    cost: 10,
    dailyEffects: { Power: -3, H2O: -1, O2: 0.1, Morale: "+5_team" }
  }
};

const createPlanet = (planetId) => {
  const data = PLANET_DATA[planetId];
  return data ? new Planet(data) : null;
};

const createComponent = (componentId) => {
  const data = COMPONENT_DATA[componentId];
  return data ? new Component(data) : null;
};

const getAllPlanets = () => {
  return Object.keys(PLANET_DATA).map(id => createPlanet(id));
};

const getAllComponents = () => {
  return Object.keys(COMPONENT_DATA).map(id => createComponent(id));
};

const START_BONUSES = {
  water_tank: { H2O: "200 * planet.water_eff" },
  battery: { Power: 50 },
  lss_bio: { O2: 5, H2O: 10 },
  agri_pod: { Food: 2 },
  n_gen: { Power: 20 },
  solar_array: { Power: "10 * planet.solar" }
};

const EVENT_DATA = {
  kepler22b: [
    { day: 1, title: "Oceanic Winds", effect: "Solar -10% today",
      choices: [
        { id: "A", text: "Reinforce habitat exterior", delta: { Power: -6 } },
        { id: "B", text: "Ignore and hope it calms", delta: { Health: -5 } }
      ]
    },
    { day: 2, title: "Water System Leak",
      choices: [
        { id: "A", text: "Repair with spares", delta: { Power: -5, Health: -2 }, flags: { stop_leak: true } },
        { id: "B", text: "Delay repair", delta: { H2O: -20, Health: -5 } }
      ]
    },
    { day: 3, title: "Science Mission: Ocean Probe",
      choices: [
        { id: "A", text: "Launch probe", delta: { Power: -8, O2: 5, Morale: 10 } },
        { id: "B", text: "Skip mission", delta: { Morale: -5 } }
      ]
    },
    { day: 4, title: "Solar Array Dusting", effect: "Solar -20% today",
      choices: [
        { id: "A", text: "EVA clean panels", delta: { Power: -6, Health: -3 } },
        { id: "B", text: "Do nothing", delta: { Power: -6 } }
      ]
    },
    { day: 5, title: "Night Storm", effect: "Solar halved",
      choices: [
        { id: "A", text: "Emergency shutdown", delta: { Power: 5, Morale: -5 } },
        { id: "B", text: "Burn backup cells", delta: { Power: -15 } }
      ]
    }
  ],
  trappist1e: [
    { day: 1, title: "Minor Stellar Flare",
      choices: [
        { id: "A", text: "Stay inside & power shielding", delta: { Power: -8 } },
        { id: "B", text: "Ignore", delta: { Health: -5 } }
      ]
    },
    { day: 2, title: "Weak Sunlight", effect: "Solar -40% today",
      choices: [
        { id: "A", text: "Conserve power", delta: { Power: 5, Morale: -3, Health: -1 } },
        { id: "B", text: "Use backup battery", delta: { Power: -8 } }
      ]
    },
    { day: 3, title: "Sensor Malfunction",
      choices: [
        { id: "A", text: "EVA repair", delta: { Power: -5, Health: -3 }, flags: { sensor_fixed: true } },
        { id: "B", text: "Skip repair", delta: {}, flags: { sensor_fixed: false } }
      ]
    },
    { day: 4, title: "Major Stellar Flare",
      branch: {
        if_sensor_fixed: [
          { id: "A", text: "Full lockdown", delta: { Power: -10 } },
          { id: "B", text: "Stay active for lab", delta: { Health: -10, O2: 5, Food: 5 } }
        ],
        if_sensor_failed: [
          { id: "AUTO", text: "Surprised by flare", delta: { Health: -8, Power: -5 } }
        ]
      }
    },
    { day: 5, title: "Psychological Strain",
      choices: [
        { id: "A", text: "Host morale activity", delta: { Power: -5, Food: -5, Health: 10, Morale: 10 } },
        { id: "B", text: "Push through", delta: { Health: -7, Morale: -5 } }
      ]
    }
  ],
  kepler452b: [
    { day: 1, title: "Heavy Landing Shock",
      choices: [
        { id: "A", text: "Inspect & reinforce seals", delta: { Power: -5, Health: -2 }, flags: { leak_prevented: true } },
        { id: "B", text: "Ignore warning", delta: { O2_next_day: -5, Health: -2 } }
      ]
    },
    { day: 2, title: "Increased Metabolic Demand",
      choices: [
        { id: "A", text: "Push rations & exercise", delta: { Food: -6, O2: -6, Health: 5 } },
        { id: "B", text: "Calorie restriction", delta: { Food: -3, Health: -6, Morale: -4 } }
      ]
    },
    { day: 3, title: "Minor Meteor Shower",
      choices: [
        { id: "A", text: "EVA quick patch", delta: { Power: -5, Health: -3 } },
        { id: "B", text: "Delay repairs", delta: { O2_per_day: -2, Health_per_day: -3 } }
      ]
    },
    { day: 4, title: "Research Opportunity",
      choices: [
        { id: "A", text: "Set up small greenhouse", delta: { Power: -6, H2O: -5, Food_end_bonus: 10, Morale: 5 } },
        { id: "B", text: "Stay focused on survival", delta: {} }
      ]
    },
    { day: 5, title: "Long Cold Night", effect: "Solar -50% today",
      choices: [
        { id: "A", text: "Use backup battery", delta: { Power: -12 } },
        { id: "B", text: "Low-power survival mode", delta: { Power: 5, Health: -8, Morale: -5 } }
      ]
    }
  ],
  proximab: [
    { day: 1, title: "Sudden Stellar Flare",
      choices: [
        { id: "A", text: "Activate emergency shielding", delta: { Power: -10 } },
        { id: "B", text: "Ride it out", delta: { Health: -8 } }
      ]
    },
    { day: 2, title: "Solar Interference", effect: "Solar -50% today",
      choices: [
        { id: "A", text: "Power ration", delta: { Power: 5, Health: -3, Morale: -3 } },
        { id: "B", text: "Use RTG/batteries", delta: { Power: -10 } }
      ]
    },
    { day: 3, title: "Life Support Failure",
      choices: [
        { id: "A", text: "EVA repair", delta: { Power: -6, Health: -3 } },
        { id: "B", text: "Ignore warning", delta: { O2_next_day: -10, Health: -5 } }
      ]
    },
    { day: 4, title: "Major Flare Storm",
      choices: [
        { id: "A", text: "Deep shelter lockdown", delta: { Power: -15 } },
        { id: "B", text: "Stay semi-active", delta: { Power: -5, Health: -6, Food: 5 } }
      ]
    },
    { day: 5, title: "Communications Blackout",
      choices: [
        { id: "A", text: "Run emergency comm beacon", delta: { Power: -6, Health: 5, Morale: 5 } },
        { id: "B", text: "Wait it out", delta: { Health: -5, Morale: -5 } }
      ]
    }
  ],
  "55cancrie": [
    { day: 1, title: "Lava Vent Eruption",
      choices: [
        { id: "A", text: "Emergency cooling boost", delta: { Power: -15 } },
        { id: "B", text: "Seal and retreat", delta: { Health: -8 } }
      ]
    },
    { day: 2, title: "Volcanic Glass Storm", effect: "Solar -60% today",
      choices: [
        { id: "A", text: "EVA clean & patch sensors", delta: { Power: -8, Health: -5 } },
        { id: "B", text: "Stay sheltered", delta: { Power: -10 } }
      ]
    },
    { day: 3, title: "Toxic Gas Intrusion",
      choices: [
        { id: "A", text: "Flush air & scrub", delta: { Power: -10, O2: -10 } },
        { id: "B", text: "Ignore leak", delta: { Health: -10 } }
      ]
    },
    { day: 4, title: "Reactor Instability",
      choices: [
        { id: "A", text: "Divert coolant", delta: { Power: -8 } },
        { id: "B", text: "Push reactor harder", delta: { Power: 10, risk: { prob: 0.25, onFail: { Power: -20, Health: -10 } } } }
      ]
    },
    { day: 5, title: "Mega Thermal Surge",
      choices: [
        { id: "A", text: "Full lockdown & deep cooling", delta: { Power: -20 } },
        { id: "B", text: "Abandon part of the outpost", delta: { Power: -5, Morale: -5, sacrifice_module: true } }
      ]
    }
  ]
};

const ENDING_MESSAGES = {
  success_generic: "You endured the mission. Systems held; the crew survived.",
  failure_generic: "The outpost failed. Resources dwindled and systems collapsed.",
  by_cause: {
    O2: "The final breath was taken — oxygen reserves ran out.",
    H2O: "Dehydration overcame the crew — water was exhausted.",
    Food: "Starvation halted all activity — rations were gone.",
    Power: "With no power left to run life support, the habitat went dark.",
    Health: "Critical injuries and stress pushed the crew beyond survival.",
    Morale: "Isolation broke the crew's spirit — operations ceased."
  },
  planet_flavor: {
    kepler22b: {
      success: "You endured Kepler-22b's alien seas and unpredictable winds. A calm blue horizon stretches ahead.",
      failure: "The ocean world claimed your fragile outpost. Endless storms silenced your crew."
    },
    trappist1e: {
      success: "You outlasted TRAPPIST-1e's flares and dim skies. The dome lights glow with quiet resilience.",
      failure: "Relentless stellar flares crippled life support and broke morale."
    },
    kepler452b: {
      success: "On Kepler-452b you mastered gravity and cold nights. Growth is now possible.",
      failure: "Micro-fractures and shortages cascaded into failure beneath a heavier sky."
    },
    proximab: {
      success: "Against Proxima's fury you found shelter and discipline — your team made it.",
      failure: "Flares and darkness overwhelmed the base before help could arrive."
    },
    "55cancrie": {
      success: "Amid searing heat and glass storms, your systems held. A miracle of engineering.",
      failure: "The lava world's thermal onslaught consumed the outpost."
    }
  }
};

const getPlanetEvents = (planetId) => {
  return EVENT_DATA[planetId] || [];
};

const createPlanetWithEvents = (planetId) => {
  const planet = createPlanet(planetId);
  if (planet) {
    planet.events = getPlanetEvents(planetId);
  }
  return planet;
};

export { 
  Planet, City, Component, Crew, GameRules, GameEvent, ResourceManager, ScoringSystem,
  GAME_METADATA, PRODUCTION_BASELINES, PLANET_DATA, COMPONENT_DATA, EVENT_DATA, START_BONUSES, ENDING_MESSAGES,
  createPlanet, createComponent, getAllPlanets, getAllComponents,
  getPlanetEvents, createPlanetWithEvents
};
