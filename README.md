# Reackt

- Create redux apps without boilerplate codes on defining action types, action creators etc.
- Build on top of immer, enjoy the benefits of immutable state and can still update it in a mutable way!

# Usage

```js
const ns = 'counter';

const initialState = {
  count: 0,
  loading: false,
};

const counter = {
  ns,
  state: initialState,
  updates: setState => {
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

const store = createStore({
  models: [counter],
});
```
