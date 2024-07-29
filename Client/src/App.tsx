import { LocalStorageEventTarget } from 'src/Utils/Auth'
import './Scss/base.scss'
import useRouterElements from './useRouterElements'
import { useContext, useEffect } from 'react'
import { AppContext } from 'src/Context/App.context'
const App = () => {
  const routeElemnts = useRouterElements()
  const { reset } = useContext(AppContext)
  useEffect(() => {
    LocalStorageEventTarget.addEventListener('clearLS', reset)
    return () => {
      LocalStorageEventTarget.removeEventListener('clearLS', reset)
    }
  }, [reset])
  return (
    <>
      <div>{routeElemnts}</div>
    </>
  )
}

export default App
