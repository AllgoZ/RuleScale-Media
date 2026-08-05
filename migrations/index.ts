import * as migration_20260730_041032_initial_schema from './20260730_041032_initial_schema';
import * as migration_20260803_091008_add_portfolio_collection from './20260803_091008_add_portfolio_collection';
import * as migration_20260805_150921_add_influencer_applications from './20260805_150921_add_influencer_applications';

export const migrations = [
  {
    up: migration_20260730_041032_initial_schema.up,
    down: migration_20260730_041032_initial_schema.down,
    name: '20260730_041032_initial_schema',
  },
  {
    up: migration_20260803_091008_add_portfolio_collection.up,
    down: migration_20260803_091008_add_portfolio_collection.down,
    name: '20260803_091008_add_portfolio_collection',
  },
  {
    up: migration_20260805_150921_add_influencer_applications.up,
    down: migration_20260805_150921_add_influencer_applications.down,
    name: '20260805_150921_add_influencer_applications'
  },
];
