export const getHourAndMinute = (dateString: Date) => {
  const date = new Date(dateString)
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  return formattedTime
}
