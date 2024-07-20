import Footer from '../Footer/Footer'
import Header from '../Header/Header'

interface Props {
  children?: React.ReactNode
}

const MainLayout = ({ children }: Props) => {
  return (
    <>
      <div>
        <Header />
        {children}
        {/* <Footer /> */}
      </div>
    </>
  )
}

export default MainLayout
