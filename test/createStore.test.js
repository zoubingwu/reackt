import createStore from '..';

const delay = (ms = 100) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const initialState = {
  count: 0,
  loading: false,
};

const counter = {
  state: initialState,
  updates: (setState, getState, dispatch) => {
    const increment = () =>
      setState(state => {
        state.count = state.count + 1;
      }, 'increment count');

    const decrement = () =>
      setState(state => {
        state.count = state.count - 1;
      }, 'decrement count');

    const incrementN = n =>
      setState(state => {
        state.count = state.count + n;
      }, 'increment count by n');

    const loading = bool =>
      setState(state => {
        state.loading = bool;
      }, `set loading to ${bool}`);
    const reset = () => {
      setState(_ => initialState, 'reset state');
    };

    const incrementAsync = async () => {
      loading(true);
      await delay();
      increment();
      loading(false);
    };

    return {
      increment,
      incrementN,
      decrement,
      incrementAsync,
      reset,
    };
  },
};

describe('createStore', () => {
  it('exposes the same public API with redux', () => {
    const store = createStore({
      models: { counter },
    });
    const methods = Object.keys(store);

    expect(methods.length).toBe(4);
    expect(methods).toContain('subscribe');
    expect(methods).toContain('dispatch');
    expect(methods).toContain('getState');
    expect(methods).toContain('replaceReducer');
  });

  it('passes the initial state', () => {
    const store = createStore({
      models: { counter },
    });
    expect(store.getState()).toEqual({
      counter: { count: 0, loading: false },
    });
  });

  it('expose update APIs on dispatch', () => {
    const store = createStore({
      models: { counter },
    });

    expect(store.dispatch.counter).toBeDefined();

    const methods = Object.keys(store.dispatch.counter);

    expect(methods.length).toBe(5);
    expect(methods).toContain('increment');
    expect(methods).toContain('incrementN');
    expect(methods).toContain('decrement');
    expect(methods).toContain('incrementAsync');
    expect(methods).toContain('reset');
  });

  it('applies the update APIs to the initial state', async () => {
    const store = createStore({
      models: { counter },
    });

    expect(store.getState()).toEqual({
      counter: { count: 0, loading: false },
    });

    store.dispatch.counter.increment();
    expect(store.getState()).toEqual({
      counter: { count: 1, loading: false },
    });

    store.dispatch.counter.incrementN(10);
    expect(store.getState()).toEqual({
      counter: { count: 11, loading: false },
    });

    store.dispatch.counter.decrement();
    expect(store.getState()).toEqual({
      counter: { count: 10, loading: false },
    });

    await store.dispatch.counter.incrementAsync();
    expect(store.getState()).toEqual({
      counter: { count: 11, loading: false },
    });
  });
});
