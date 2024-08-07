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
      'https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/338542677_911657383288229_231872306489757536_n.jpg?stp=dst-jpg_p206x206&_nc_cat=107&ccb=1-7&_nc_sid=efbe48&_nc_ohc=VdY-YzrulBYQ7kNvgHqq_NN&_nc_ht=scontent.fsgn19-1.fna&oh=00_AYCvaWlD_3jhooxg7_b1YYiZOC_ow8D8Bd5iizSVBRnulQ&oe=66B8E771'
  }
  return (
    <div className='createInstagrams'>
      <Dialog.Root open={toggle}>
        <Dialog.Portal>
          <Dialog.Overlay className='dialogOverlay-createInsta' />

          <Dialog.Content className='dialogContent-createInsta'>
            <Dialog.Title className='dialogTitle-createInsta'>
              <div
                role='button'
                tabIndex={0}
                onClick={() => settoggleCreateInstagrams(!toggle)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    settoggleCreateInstagrams(!toggle)
                  }
                }}
                aria-label='Close dialog'
                className='btn-close-dialogCreateInsta'
              >
                <FaArrowLeft />
              </div>
              <div>Đăng bài mới</div>
              <div style={{ color: 'royalblue' }}>Chia sẻ</div>
            </Dialog.Title>
            <Dialog.Description>
              <div className='createInstagrams__details'>
                <div className='createInstagrams__details__image'>
                  <img
                    alt=''
                    src='https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/338542677_911657383288229_231872306489757536_n.jpg?stp=dst-jpg_p206x206&_nc_cat=107&ccb=1-7&_nc_sid=efbe48&_nc_ohc=VdY-YzrulBYQ7kNvgHqq_NN&_nc_ht=scontent.fsgn19-1.fna&oh=00_AYCvaWlD_3jhooxg7_b1YYiZOC_ow8D8Bd5iizSVBRnulQ&oe=66B8E771'
                  />
                </div>
                <div className='createInstagrams__details__caption'>
                  <div className='createInstagrams__details__caption__user'>
                    <div className='createInstagrams__details__caption__user__avatar'>
                      <img alt='avatar' src={UserFake.avatar} />
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
