import * as Icon from 'lucide-react'

interface MenuItem {
  title: string
  url?: string
  icon?: keyof typeof Icon
  items?: MenuItem[]
}
