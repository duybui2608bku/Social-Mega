import './Scss/base.scss'
import useRouterElements from './useRouterElements'
const App = () => {
  const routeElemnts = useRouterElements()
  return (
    <>
      <div>{routeElemnts}</div>
    </>
  )
}

export default App
