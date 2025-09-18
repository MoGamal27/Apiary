export interface Iinspection  {
  name?: string;
  apiary_id: number;
  hive_id: number;
  inspection_date: Date;
  inspection_time?: string;
  strength?: number;
  strength_category?: string;
  temperament?: string;
  supers_count?: number;
  frames_count?: number;
  notes?: string;
  weight?: number;
  weight_unit?: string;
  include_weather?: boolean;
  weather_conditions?: string;
  temperature?: number;
  queen?: {
    queen_seen?: boolean;
    queen_cells?: string;
    swarmed?: boolean;
  };
  brood?: {
    eggs_present?: boolean;
    capped_brood?: boolean;
    uncapped_brood?: boolean;
    excessive_drones?: boolean;
    laying_pattern?: string;
    population_level?: string;
  };
  conditions?: {
    equipment_condition?: string;
    odor?: string;
    brace_comb?: boolean;
    excessive_propolis?: boolean;
    dead_bees?: boolean;
    moisture?: boolean;
    mold?: boolean;
  };
  frames?: {
    frames_bees?: number;
    frames_brood?: number;
    frames_honey?: number;
    frames_pollen?: number;
    frames_foundation?: number;
    honey_stores?: string;
    pollen_stores?: string;
  };
  activities?: {
    bee_activity?: string;
    orientation_flights?: string;
    pollen_arriving?: string;
    foraging_bees?: string;
    bees_per_minute?: number;
  };
  problems?: {
    diseases?: string;
    pests?: string;
    predation?: string;
  };
  treatments?: {
    treatments?: string;
    varroa_drop_count?: number;
    actions_taken?: string;
  };
}