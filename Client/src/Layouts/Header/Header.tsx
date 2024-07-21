import { Link, useLocation } from 'react-router-dom'
import { GrHomeRounded } from 'react-icons/gr'
import { CiSearch } from 'react-icons/ci'
import { PiPaperPlaneTilt } from 'react-icons/pi'
import { CiHeart } from 'react-icons/ci'
import { MdApproval } from 'react-icons/md'
import { CiSquarePlus } from 'react-icons/ci'
import { RiImageCircleFill } from 'react-icons/ri'
import './Header.scss'
const Header = () => {
  const location = useLocation()
  const navBar = [
    { display: 'Trang Chủ', path: '/', icon: <GrHomeRounded /> },
    { display: 'Tìm Kiếm', path: '/search', icon: <CiSearch /> },
    { display: 'Thông Báo', path: '/notification', icon: <CiHeart /> },
    { display: 'Đăng', path: '/post', icon: <CiSquarePlus /> },
    { display: 'Tin Nhắn', path: '/contact', icon: <PiPaperPlaneTilt /> },
    { display: 'Phê duyệt', path: '/appro', icon: <MdApproval /> },
    { display: 'Tài Khoản', path: '/profile', icon: <RiImageCircleFill /> }
  ]

  const navBarMobile = [
    { display: 'Thông Báo', path: '/notification', icon: <CiHeart /> },
    { display: 'Tin Nhắn', path: '/contact', icon: <PiPaperPlaneTilt /> }
  ]

  return (
    <>
      <div className='nav-menu'>
        <div className='nav-menu__nav'>
          <div className='nav-menu__nav__title'>SOCIAL MEGA</div>
          {navBar.map((item, index) => {
            return (
              <Link
                key={index}
                to={item.path}
                className={`nav-menu__nav__item ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.icon}
                <p>{item.display}</p>
              </Link>
            )
          })}
        </div>
        <div className='nav-menu__nav-mobile'>
          {/* <div className='nav-menu__nav-mobile__title'>SOCIAL MEGA</div> */}
          {navBarMobile.map((item, index) => {
            return (
              <Link
                key={index}
                to={item.path}
                className={`nav-menu__nav-mobile__item ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.icon}
                <p>{item.display}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Header
