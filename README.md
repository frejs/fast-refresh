# fast-refresh
> fre fast refresh use swc

粗略支持 fast refresh，目前只支持 export default

```js
function App() {
  const [count, setCount] = useState(0)
  return <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
}

export default App // 这里的 App 会被 rerender
```
