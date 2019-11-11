import { render } from 'react-dom';

async function delay(ms = Math.random() * 3000) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

class CounterModel extends Model {
  name = 'counter'

  state = {
    count: 0
  }

  computed = {
    double: this.state.count * 2,
  }

  increment() {
    this.setState(state => state.count++);
  }

  async incrementAsync() {
    await delay()
    this.increment()
  }
}

const store = new Store({
  models: [CounterModel],
})

function Counter() {
  const counterModel = useModel('counter', model => [
    model.state.count,
  ]);

  return (
    <div>
      <h1>count: {counterModel.state.count}</h1>
      <h1>double: {counterModel.computed.double}</h1>
      <button onClick={counterModel.increment}>increment</button>
      <button onClick={counterModel.incrementAsync}>increment async</button>
    </div>
  )
}

