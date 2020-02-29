import produce from 'immer';
import { createStore as createReduxStore, combineReducers } from 'redux';

function noop() {}

function isPromise(obj) {
  return (
    !!obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    typeof obj.then === 'function'
  );
}

function createNamespacedType(ns, type, delimiter = '/') {
  return ns + delimiter + type;
}

const INTERNAL_UPDATE = 'reackt_setState';

function createStore(
  { models, onError = noop, useImmer = true },
  preloadState,
  enhancers
) {
  let store;

  const modelCollection = Object.keys(models).map(key => ({
    ns: key,
    ...models[key],
  }));

  const reducersMap = modelCollection
    .map(({ ns, state }) => {
      const initialState = state;
      const reducer = (state = initialState, action) => {
        const { type, payload } = action;
        if (
          type.startsWith(createNamespacedType(ns, INTERNAL_UPDATE)) &&
          typeof payload === 'function'
        ) {
          return useImmer ? produce(state, payload) : payload(state);
        }
        return state;
      };

      return {
        [ns]: reducer,
      };
    })
    .reduce((map, reducerMap) => {
      Object.assign(map, reducerMap);
      return map;
    }, {});

  const rootReducer = combineReducers(reducersMap);

  store = createReduxStore(rootReducer, preloadState, enhancers);

  modelCollection.forEach(({ ns, updates }) => {
    const setState = (updater, description = '') => {
      store.dispatch({
        type: createNamespacedType(
          ns,
          description ? INTERNAL_UPDATE + ': ' + description : INTERNAL_UPDATE
        ),
        payload: updater,
      });
    };

    const otherAPI = {
      getState: store.getState,
      dispatch: store.dispatch,
    };

    const updateObject = updates(setState, otherAPI);

    for (const method in updateObject) {
      const originalMethod = updateObject[method];
      if (typeof originalMethod !== 'function') {
        throw new TypeError(
          `[reackt]: update method named ${method} is not a function!`
        );
      }
      updateObject[method] = function wrapper() {
        store.dispatch({
          type: createNamespacedType(ns, method),
          payload: [...arguments],
        });

        let ret;
        try {
          ret = originalMethod.apply(this, arguments);
          if (isPromise(ret)) {
            return ret.catch(onError);
          }
        } catch (e) {
          onError(e);
        }

        return ret;
      };
    }

    store.dispatch[ns] = updateObject;
  });

  return store;
}

export default createStore;
