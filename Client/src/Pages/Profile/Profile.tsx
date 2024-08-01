import './Profile.scss'

const Profile = () => {
  const userFake = [
    {
      avatar:
        'https://scontent.fhan4-6.fna.fbcdn.net/v/t39.30808-6/240377124_2842777692701178_2246908654717259309_n.jpg?stp=c52.0.206.206a_dst-jpg_p206x206&_nc_cat=109&ccb=1-7&_nc_sid=efbe48&_nc_eui2=AeGWvMnPkPlwykXh_aVA8ihWRHAHn27lS3dEcAefbuVLd6f97_v2aVAwYmPvG6pDFwCB9t1WiXQOjyUhtSyjRhbv&_nc_ohc=FxW7mLB4PasQ7kNvgGZjbiZ&_nc_ht=scontent.fhan4-6.fna&gid=AKdyR05zUUPhfWo3UC6ngNU&oh=00_AYAyr9pzAdSt0ONzbMeotbyxEzfRtrGQjHFwWt3TLnFC1w&oe=66B1868E',
      name: 'Amme',
      followers: 210,
      following: 321,
      post: 3
    }
  ]

  return (
    <>
      <div className='profile'>
        <div className='profile__infor'></div>
      </div>
    </>
  )
}

export default Profile
