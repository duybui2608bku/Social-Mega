import { SiMicrosoftexcel } from 'react-icons/si'
import { PiMicrosoftPowerpointLogoFill } from 'react-icons/pi'
import { FaFileWord, FaFilePdf, FaRegFileArchive, FaRegFileImage, FaRegFileVideo } from 'react-icons/fa'
import { IconType } from 'react-icons/lib'
export const getHourAndMinute = (dateString: Date) => {
  const date = new Date(dateString)
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  return formattedTime
}

export const isUrl = (str: string) => {
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}

export const getFileInfoFromUrl = (url: string) => {
  const fileExtension = url?.split('.')?.pop()
  return fileExtension || ''
}

export const getIconFile = (fileExtension: string): IconType => {
  switch (fileExtension) {
    case 'pdf':
      return FaFilePdf
    case 'doc':
    case 'docx':
      return FaFileWord
    case 'xls':
    case 'xlsx':
      return SiMicrosoftexcel
    case 'ppt':
    case 'pptx':
      return PiMicrosoftPowerpointLogoFill
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return FaRegFileImage
    case 'mp4':
    case 'avi':
    case 'mov':
      return FaRegFileVideo
    default:
      return FaRegFileArchive
  }
}
