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
import { useEffect, useRef, useState } from 'react'
import SearchUI from 'src/Components/SearchUI/SearchUI'
import Notification from 'src/Components/Notifications/Notification'
import CreateInstagrams from 'src/Components/CreateInstagrams/CreateInstagrams'
const Header = () => {
  const location = useLocation()

  const navBar = [
    { display: 'Trang Chủ', path: '/', icon: <GrHomeRounded /> },
    { display: 'Tìm Kiếm', path: '/#', icon: <CiSearch /> },
    { display: 'Thông Báo', path: '/#', icon: <CiHeart /> },
    { display: 'Đăng', path: '/#', icon: <CiSquarePlus /> },
    { display: 'Tin Nhắn', path: '/chat', icon: <PiPaperPlaneTilt /> },
    { display: 'Phê duyệt', path: '/appro', icon: <MdApproval /> },
    { display: 'Tài Khoản', path: '/#', icon: <RiImageCircleFill /> }
  ]

  const navBarMobile = [
    { display: 'Thông Báo', path: '/#', icon: <CiHeart /> },
    { display: 'Tin Nhắn', path: '/chat', icon: <PiPaperPlaneTilt /> }
  ]

  const [toggleNavSearch, SettoggleNavSearch] = useState(false)
  const [toggleNavNotification, SettoggleNavNotification] = useState(false)
  const [toggleNavMenuAccount, settoggleNavMenuAccount] = useState(false)
  const [toggleCreateInstagrams, settoggleCreateInstagrams] = useState(false)
  const navMenuRef = useRef<HTMLDivElement>(null)
  const popoverAccountRef = useRef<HTMLAnchorElement>(null)
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
        onSuccess: () => {
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

  const handleClick = (item: string) => {
    if (item === 'Tài Khoản') {
      handleLogOut()
      settoggleNavMenuAccount(!toggleNavMenuAccount)
    } else if (item === 'Tìm Kiếm') {
      SettoggleNavSearch(!toggleNavSearch)
      toggleNavNotification && SettoggleNavNotification(false)
    } else if (item === 'Thông Báo') {
      SettoggleNavNotification(!toggleNavNotification)
      toggleNavSearch && SettoggleNavSearch(false)
    } else if (item === 'Đăng') {
      settoggleCreateInstagrams(!toggleCreateInstagrams)
    }
  }

  useEffect(() => {
    const handleBodyClick = (event: MouseEvent) => {
      if (navMenuRef.current && !navMenuRef.current.contains(event.target as Node)) {
        SettoggleNavSearch(false)
        SettoggleNavNotification(false)
      }
    }
    document.addEventListener('click', handleBodyClick)
    return () => {
      document.removeEventListener('click', handleBodyClick)
    }
  }, [toggleNavNotification, toggleNavSearch])

  return (
    <>
      <div className='nav-menu' ref={navMenuRef}>
        <div
          className={
            toggleNavSearch || toggleNavNotification || location.pathname === '/chat'
              ? 'nav-menu__nav nav-menu__toggle'
              : 'nav-menu__nav'
          }
        >
          <div className='nav-menu__nav__title'>SOCIAL MEGA</div>

          {navBar.map((item, index) => {
            return (
              <Link
                ref={item.display === 'Tài Khoản' ? popoverAccountRef : null}
                onClick={() => handleClick(item.display)}
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
                onClick={() => handleClick(item.display)}
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
        <SearchUI toggle={toggleNavSearch} />
        <Notification toggle={toggleNavNotification} />
        <CreateInstagrams toggle={toggleCreateInstagrams} settoggleCreateInstagrams={settoggleCreateInstagrams} />
      </div>
    </>
  )
}

export default Header
