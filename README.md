# Reackt [![Actions Status](https://github.com/shadeofgod/reackt/workflows/test/badge.svg)](https://github.com/shadeofgod/reackt/actions) ![](https://img.shields.io/npm/l/reakt)

Reackt is a tiny state container built on top of [redux](https://github.com/reduxjs/redux) and [immer](https://github.com/immerjs/immer).

It helps you build your application without worrying about all the boilerplate codes on defining action types or action creators like when using redux. You only have to define your state and how to update it and leave other thing to reackt.

Reackt is built on top of redux, you have all the benefits with redux like time-travel debugging, easy to implement undo/redo, state persistence, etc.

But unlike redux's pure and synchronous reducer, you can do whatever you want in reackt's update functions, **async or sync**! You no longer need other middlewares such as redux-thunk, redux-saga or redux-observable to handle all the asynchronous tasks for you.

Reackt makes writing GUI back to the simplest model:

1. User interaction triggers some kind of event.
2. Event triggers a function call to compute and update the app state.
3. The state changes trigger UI re-render so users can have feedback to respond their interaction.

You shouldn't have to consider all those concepts like reducers, actions, action types, action creators in your brain now, reackt just handles it internally for you!

Reackt also has built-in immer support, you can just update your state in a mutable way but have all the benefits of immutable state!

# Getting Started

### Install

```sh
npm install reackt redux immer
```

or

```sh
yarn add reackt redux immer
```

### Usage

reackt **only provides one simple API**: `createStore`.

It has pretty much the same signature like redux's createStore except its first argument is an object describing your modular models and other options like below.

```ts
function createStore(
  { models, onError = noop, useImmer = true },
  preloadState,
  enhancers
): Store {
  //...
}
```

Let's try a counter example, we only have to define our state and how to update it, no more action, action types or action creators to worry about!

**store.js**

```js
import createStore from 'reackt';

const counter = {
  state: 0,
  updates: setState => ({
    increment: () =>
      setState(state => {
        state = state + 1; // setState is like immer's produce, you can just mutate your state here
      }),
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

Your update function can also handle async task like this:

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

Since we build on top of redux and redux is view-layer agnostic, we can use any other UI library.

For react, we can use react-redux to connect the state to our view components. Using hooks API to make it even more enjoyable.

**index.js**

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';

import { store } from './store';

function App() {
  const count = useSelector(state => state.counter);
  const {
    counter: { increment, incrementAsync },
  } = useDispatch();

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={increment}>increment</button>
      <button onClick={incrementAsync}>increment async</button>
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

You can [check the full counter example on codesandbox.](https://codesandbox.io/s/github/shadeofgod/reackt/tree/master/examples/counter?fontsize=14&hidenavigation=1&theme=dark)

There is also [an advanced github search example here!](https://codesandbox.io/s/github/shadeofgod/reackt/tree/master/examples/search?fontsize=14&hidenavigation=1&theme=dark)
