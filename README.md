# Reackt

[![Edit reackt-design](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/reackt-design-09tjt?fontsize=14&hidenavigation=1&theme=dark)

Reackt is a tiny state container built on top of redux and immer.

It helps you focus on writing your own applications and never have to worry about all the boilerplate code on defining action types, action creators when using redux.

It also has built-in immer support, so you have all the benefits of immutable state and you can still update your state in a mutable way!

# Install

```sh
npm install reackt
```

# Usage

[check counter example on codesandbox](https://codesandbox.io/s/reackt-design-09tjt?fontsize=14&hidenavigation=1&theme=dark)

```js
import createStore from 'reackt';

const ns = 'counter';

const initialState = {
  count: 0,
  loading: false,
};

const delay = (ms = 2000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const counter = {
  ns,
  state: initialState,
  updates: setState => {
    const increment = () =>
      setState(state => {
        state.count = state.count + 1;
      }, 'increment count');

    const loading = bool =>
      setState(state => {
        state.loading = bool;
      }, `set loading to ${bool}`); // optional string for debug info

    const incrementAsync = async () => {
      loading(true);
      await delay();
      increment();
      loading(false);
    };

    return {
      increment,
      incrementAsync,
    };
  },
};

const store = createStore({
  models: [counter],
});

store.getState(); // -> { counter: { count: 0, loading: false } }
store.dispatch.counter.increment();
store.getState(); // -> { counter: { count: 1, loading: false } }
store.dispatch.counter.incrementAsync();
// ... after two seconds
store.getState(); // -> { counter: { count: 2, loading: false } }
```
