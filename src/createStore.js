import produce from 'immer';
import {
  createStore as createReduxStore,
  combineReducers,
  applyMiddleware,
  compose,
} from 'redux';

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

const INTERNAL_UPDATE = '__INTERNAL_UPDATE__';

function createStore({
  models,
  middlewares = [],
  preloadState = undefined,
  onError = noop,
}) {
  let store;

  const reducersMap = models
    .map(({ ns, state }) => {
      const initialState = state;
      const reducer = (state = initialState, action) => {
        const { type, payload } = action;
        if (
          type === createNamespacedType(ns, INTERNAL_UPDATE) &&
          typeof payload === 'function'
        ) {
          const nextState = produce(state, payload);
          return nextState;
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

  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  store = createReduxStore(
    rootReducer,
    preloadState,
    composeEnhancers(applyMiddleware(...middlewares))
  );

  models.forEach(({ ns, updates }) => {
    function setState(updater, description = '') {
      store.dispatch({
        type: createNamespacedType(ns, INTERNAL_UPDATE),
        payload: updater,
        meta: description,
      });
    }

    const updateObject = updates(setState, store.getState, store.dispatch);

    for (const method in updateObject) {
      const originalMethod = updateObject[method];
      updateObject[method] = function wrapper() {
        store.dispatch({ type: createNamespacedType(ns, method) });
        const ret = originalMethod.apply(this, arguments);
        if (isPromise(ret)) {
          return Promise.resolve(ret).catch(onError);
        }
        return ret;
      };
    }

    store.dispatch[ns] = updateObject;
  });

  return store;
}

export default createStore;
