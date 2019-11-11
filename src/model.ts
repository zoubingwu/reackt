import produce, { Draft } from 'immer';

export interface StateUpdater<T> {
  (draft: Draft<T>): void;
}

export abstract class Model<State, Computed> {
  abstract name: string;
  abstract state: State;
  abstract computed: Computed;

  setState(stateUpdater: StateUpdater<State>) {
    this.state = produce(this.state, draft => stateUpdater(draft));
  }

  constructor() { }
}
