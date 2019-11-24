# Reackt [![Actions Status](https://github.com/shadeofgod/reackt/workflows/test/badge.svg)](https://github.com/shadeofgod/reackt/actions) ![](https://img.shields.io/npm/l/reakt)

[![Edit reackt-design](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/reackt-design-wb7wz?expanddevtools=1&fontsize=14&hidenavigation=1&theme=dark)

Reackt is a tiny state container built on top of redux and immer.

It helps you build your application without worrying about all the boilerplate codes on defining action types or action creators like when using redux. You only have to define your state and how to update it and leave other thing to reackt.

Reackt is built on top of redux, so you still have all the benefits with redux like time-travel debugging, easy to implement undo/redo, state persistence, etc.

It also has built-in immer support, so you can just update your state in a mutable way but have all the benefits of immutable state!

# Getting Started

### Install

```sh
npm install reackt
```

or

```sh
yarn add reackt
```

[check counter example on codesandbox!](https://codesandbox.io/s/reackt-design-wb7wz?expanddevtools=1&fontsize=14&hidenavigation=1&theme=dark)

### Model

Define you state and how you are gonna update it here, no more action, action types or action creators to worry about!

reackt **only provides one simple API**: `createStore`

**store.js**

```js
import createStore from 'reackt';

const counter = {
  state: 0,
  updates: setState => ({
    increment: () => {setState(state => {
      state = state + 1;
    });
  }),
};

export const store = createStore({
  models: { counter },
});

// it returns a redux store with extra enhancement,
// now you can just call your update functions thru dispatch
store.getState(); // -> { counter: 0 }
store.dispatch.counter.increment();
store.getState(); // -> { counter: 1 }
```

Your update function can also be async like this:

```js
const counter = {
  state: 0,
  updates: setState => {
    const increment = () =>
      setState(state => {
        state = state + 1;
      });
    const incrementAsync = async () => {
      await delay();
      increment();
    };

    return {
      increment,
      incrementAsync,
    };
  },
};

// now you can use it just like normal async function
await store.dispatch.counter.incrementAsync();
store.getState(); // -> returns { counter: 1 } after delay
```

### View

Since we build on top of redux, so it's just like a regular redux app with react-redux to connect the state to our view components. Using hooks API to make it even more enjoyable.

**index.js**

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';

import { store } from './store';

function App() {
  const count = useSelector(state => state.counter);
  const {
    counter: { increment },
  } = useDispatch();

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={increment}>increment</button>
    </div>
  );
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
```
