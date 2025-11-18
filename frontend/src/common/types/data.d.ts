import * as Icon from 'lucide-react'

interface MenuItem {
  name: string
  url?: string
  icon?: keyof typeof Icon
  items?: MenuItem[]
  show?: boolean
}

interface Menu {
  [key: string]: {
    isOpened: boolean
    items?: MenuItem[]
  }
}
