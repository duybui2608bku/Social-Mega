import { Dispatch } from 'react'
import './CreateInstagrams.scss'
import * as Dialog from '@radix-ui/react-dialog'
import * as Accordion from '@radix-ui/react-accordion'
import * as Switch from '@radix-ui/react-switch'
import { FaArrowLeft } from 'react-icons/fa'
import { SlArrowDown } from 'react-icons/sl'
interface CreateInstagramsProps {
  toggle: boolean
  settoggleCreateInstagrams: Dispatch<React.SetStateAction<boolean>>
}
const CreateInstagrams = ({ toggle, settoggleCreateInstagrams }: CreateInstagramsProps) => {
  const UserFake = {
    name: 'Amme',
    avatar:
      'https://scontent.fhan4-6.fna.fbcdn.net/v/t39.30808-6/240377124_2842777692701178_2246908654717259309_n.jpg?stp=c52.0.206.206a_dst-jpg_p206x206&_nc_cat=109&ccb=1-7&_nc_sid=efbe48&_nc_eui2=AeGWvMnPkPlwykXh_aVA8ihWRHAHn27lS3dEcAefbuVLd6f97_v2aVAwYmPvG6pDFwCB9t1WiXQOjyUhtSyjRhbv&_nc_ohc=FxW7mLB4PasQ7kNvgGZjbiZ&_nc_ht=scontent.fhan4-6.fna&gid=AKdyR05zUUPhfWo3UC6ngNU&oh=00_AYAyr9pzAdSt0ONzbMeotbyxEzfRtrGQjHFwWt3TLnFC1w&oe=66B1868E'
  }
  return (
    <div className='createInstagrams'>
      <Dialog.Root open={toggle}>
        <Dialog.Portal>
          <Dialog.Overlay className='dialogOverlay-createInsta' />

          <Dialog.Content className='dialogContent-createInsta'>
            <Dialog.Title className='dialogTitle-createInsta'>
              <div onClick={() => settoggleCreateInstagrams(!toggle)} className='btn-close-dialogCreateInsta'>
                <FaArrowLeft />
              </div>
              <div>Đăng bài mới</div>
              <div style={{ color: 'royalblue' }}>Chia sẻ</div>
            </Dialog.Title>
            <Dialog.Description>
              <div className='createInstagrams__details'>
                <div className='createInstagrams__details__image'>
                  <img src='https://scontent.fhan4-3.fna.fbcdn.net/v/t39.30808-6/273405250_1884129491791495_3985241061784500257_n.jpg?stp=c52.0.206.206a_dst-jpg_p206x206&_nc_cat=110&ccb=1-7&_nc_sid=50c75d&_nc_eui2=AeEMcL433FUFRuA-iRHGCfv6uHoVgvwvgYu4ehWC_C-Bi4nKR7FLsnieHeWu_tE225EkG-LUeGO-1R8CJHtSjNct&_nc_ohc=Nbmr_J7I0M8Q7kNvgG5ZXA5&_nc_ht=scontent.fhan4-3.fna&gid=A3o169kbxnJaIQHGQnclS7K&oh=00_AYBKv_wpRZLQ4kSrB_6kb_mepDQaB8dIzV54aQ-fzNtzCw&oe=66B17B16' />
                </div>
                <div className='createInstagrams__details__caption'>
                  <div className='createInstagrams__details__caption__user'>
                    <div className='createInstagrams__details__caption__user__avatar'>
                      <img src={UserFake.avatar} />
                    </div>
                    <div className='createInstagrams__details__caption__user__name'>{UserFake.name}</div>
                  </div>
                  <div className='createInstagrams__details__caption__content'>
                    <textarea maxLength={200} placeholder='Chia sẻ điều gì đó...' />
                  </div>
                  <div>
                    <Accordion.Root type='single' collapsible>
                      <Accordion.Item value='item-1'>
                        <Accordion.Trigger className='accordion-trigger-createInsta'>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>Đối tượng muốn chia sẻ</div>
                            <div>
                              <SlArrowDown />
                            </div>
                          </div>
                        </Accordion.Trigger>
                        <Accordion.Content className='accordion-content-createInsta'>
                          <div>
                            <p>Với mọi người</p>
                            <Switch.Root className='SwitchRoot' id='airplane-mode'>
                              <Switch.Thumb className='SwitchThumb' />
                            </Switch.Root>
                          </div>
                          <div>
                            <p>Với người theo dõi</p>
                            <Switch.Root className='SwitchRoot' id='airplane-mode'>
                              <Switch.Thumb className='SwitchThumb' />
                            </Switch.Root>
                          </div>
                        </Accordion.Content>
                      </Accordion.Item>
                    </Accordion.Root>
                  </div>
                </div>
              </div>
            </Dialog.Description>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}

export default CreateInstagrams
