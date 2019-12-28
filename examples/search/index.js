import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import createStore from 'reackt';
import { debounce } from 'lodash';

const search = {
  state: {
    keyword: '',
    result: null,
  },
  updates: (setState, { getState, dispatch }) => {
    const {
      globalLoading: { loadingStart, loadingEnd },
    } = dispatch;

    let lastFetchAbortController = null;

    const search = debounce(async q => {
      try {
        if (lastFetchAbortController) {
          lastFetchAbortController.abort();
        }

        loadingStart();

        const controller = new AbortController();
        lastFetchAbortController = controller;
        const signal = controller.signal;
        const req = await fetch(
          `https://api.github.com/search/repositories?q=${encodeURIComponent(
            q
          )}`,
          { signal }
        );
        const res = await req.json();

        setState(state => {
          state.keyword = q;
          state.result = res;
        });
      } catch (e) {
        console.error(e);
        if (e.message && e.documentation_url) {
          alert(`${e.message}, check ${e.documentation_url} for more info!`);
        }
      } finally {
        loadingEnd();
      }
    }, 600);

    return {
      handleSearch: search,
    };
  },
};

const globalLoading = {
  state: false,
  updates: setState => {
    const loadingStart = () => setState(() => true);
    const loadingEnd = () => setState(() => false);

    return {
      loadingStart,
      loadingEnd,
    };
  },
};

const store = createStore(
  {
    models: {
      globalLoading,
      search,
    },
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

function ResultList({ keyword, result }) {
  if (!keyword) {
    return 'type to search';
  }

  if (result.total_count <= 0) {
    return 'no result!';
  }

  return (
    <div>
      <h2>keyword is {keyword}</h2>
      <h2>total count is {result.total_count}</h2>

      <ul>
        {result.items.map(i => {
          return (
            <li key={i.id}>
              <a href={i.html_url}>{i.full_name}</a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function App() {
  const {
    search: { handleSearch },
  } = useDispatch();
  const { keyword, result } = useSelector(state => state.search);
  const loading = useSelector(state => state.globalLoading);

  return (
    <div>
      <input onChange={e => handleSearch(e.target.value)} />
      <br />
      {loading ? (
        'loading...'
      ) : (
        <ResultList keyword={keyword} result={result} />
      )}
    </div>
  );
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#app')
);
