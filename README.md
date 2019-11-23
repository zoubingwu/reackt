# Reackt

[![Edit reackt-design](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/reackt-design-09tjt?fontsize=14&hidenavigation=1&theme=dark)

Reackt is a tiny state container built on top of redux and immer.

It helps you focus on writing your own applications and never have to worry about all the boilerplate code on defining action types, action creators when using redux.

It also has built-in immer support, so you have all the benefits of immutable state and you can still update your state in a mutable way!

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
