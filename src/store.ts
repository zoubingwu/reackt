import { Middleware } from 'redux';
import { Model } from './model';

interface StoreOptions {
  models: Model[];
  middlewares: Middleware[];
}

export class Store {
  modelMap: Map<string, Model>;

  constructor(options: StoreOptions) {
    const { models } = options;
    this.modelMap = models.reduce((map, model) => {
      map.set(model.name, model);
    }, new Map<string, Model>());
  }
}
