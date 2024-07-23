import { range } from 'lodash'
import { useState } from 'react'

interface Props {
  onChange?: (value: Date) => void
  value?: Date
}

const DateSelected = ({ value, onChange }: Props) => {
  const [date, setDate] = useState({
    date: value?.getDate() || 1,
    month: value?.getMonth() || 1,
    year: value?.getFullYear() || 1990
  })

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value: valueFormSelected, name } = event.target
    const newDate = {
      date: value?.getDate() || date.date,
      month: value?.getMonth() || date.month,
      year: value?.getFullYear() || date.year,
      [name]: Number(valueFormSelected)
    }
    setDate(newDate)
    onChange && onChange(new Date(newDate.year, newDate.month, newDate.date))
  }
  return (
    <>
      <div className='selected'>
        <select name='date' onChange={handleChange} value={value?.getDate() || date.date} className='selected-item'>
          <option>Ngày</option>
          {range(1, 32).map((item, index) => {
            return (
              <>
                <option value={item} key={index}>
                  {item}
                </option>
              </>
            )
          })}
        </select>
        <select onChange={handleChange} name='month' value={value?.getMonth() || date.month} className='selected-item'>
          <option>Tháng</option>
          {range(1, 13).map((item, index) => {
            return (
              <>
                <option value={item} key={index}>
                  Tháng {item}
                </option>
              </>
            )
          })}
        </select>
        <select onChange={handleChange} name='year' value={value?.getFullYear() || date.year} className='selected-item'>
          <option>Năm</option>
          {range(1990, 2025).map((item, index) => {
            return (
              <>
                <option value={item} key={index}>
                  {item}
                </option>
              </>
            )
          })}
        </select>
      </div>
    </>
  )
}

export default DateSelected
