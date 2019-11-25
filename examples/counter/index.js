import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import createStore from 'reackt';

const delay = (ms = Math.random() * 2000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const initialState = {
  count: 0,
  loading: false,
};

const counter = {
  state: initialState,

  /**
   * @param(function) - a state updater function to update your model state, by default it use immer internally so you should returns a new state or modify the state, see [Returning data from producers](https://immerjs.github.io/immer/docs/return), it accepts an optinal descriptive string as second argument for debug purpose.
   * @param(Store) - only getState and dispatch are provided so you can get root state and call update functions from other model
   * @returns(object) - returns an object as the collection of your update functions.
   */
  updates: (setState, { getState, dispatch }) => {
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
      if (Math.random() < 0.5) {
        throw new Error('oops');
      }
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

const store = createStore(
  {
    models: { counter },
    onError: e => alert(e.message),
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

function App() {
  const { count, loading } = useSelector(state => state.counter);
  const {
    counter: { increment, incrementAsync, decrement, reset },
  } = useDispatch();

  return (
    <div>
      <h1> {count} </h1> <button onClick={increment}> increment </button> <hr />
      <button onClick={incrementAsync}> increment async </button>
      {loading && 'loading...'} <hr />
      <button onClick={decrement}> decrement </button> <hr />
      <button onClick={reset}> reset </button>
    </div>
  );
}

const rootElement = document.getElementById('app');
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);
