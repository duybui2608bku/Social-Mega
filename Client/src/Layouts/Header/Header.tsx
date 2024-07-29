import { Link, useLocation, useNavigate } from 'react-router-dom'
import { GrHomeRounded } from 'react-icons/gr'
import { CiSearch } from 'react-icons/ci'
import { PiPaperPlaneTilt } from 'react-icons/pi'
import { CiHeart } from 'react-icons/ci'
import { MdApproval } from 'react-icons/md'
import { CiSquarePlus } from 'react-icons/ci'
import { RiImageCircleFill } from 'react-icons/ri'
import { useMutation } from '@tanstack/react-query'
import { UserApi } from 'src/Service/User.api'
import { getRefreshTokenFormLS } from 'src/Utils/Auth'
import { toast } from 'react-toastify'
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
    { display: 'Tài Khoản', path: '/#', icon: <RiImageCircleFill /> }
  ]

  const navBarMobile = [
    { display: 'Thông Báo', path: '/notification', icon: <CiHeart /> },
    { display: 'Tin Nhắn', path: '/contact', icon: <PiPaperPlaneTilt /> }
  ]

  interface logoutType {
    refresh_token: string
  }
  const nagivate = useNavigate()
  const refresh_token = getRefreshTokenFormLS()

  const LogoutMutation = useMutation({
    mutationFn: (body: logoutType) => {
      return UserApi.Logout(body)
    }
  })

  const handleLogOut = () => {
    LogoutMutation.mutate(
      { refresh_token },
      {
        onSuccess: (data) => {
          // toast.success(data.data.message)
          toast.success('Đăng xuất thành công')
          nagivate('/login')
        },
        onError: (errors: any) => {
          console.log(errors)
        }
      }
    )
  }

  return (
    <>
      <div className='nav-menu'>
        <div className='nav-menu__nav'>
          <div className='nav-menu__nav__title'>SOCIAL MEGA</div>
          {navBar.map((item, index) => {
            return (
              <Link
                onClick={item.display === 'Tài Khoản' ? handleLogOut : () => {}}
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
// Remove the conflicting useNavigate function
