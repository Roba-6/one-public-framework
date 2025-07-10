import { House } from 'lucide-react'
import { NavLink } from 'react-router'

import { Button } from '@/common/components/ui/button.tsx'

const GoHome = () => {
  return (
    <Button variant="outline" size="icon" className="mode-toggle-button">
      <NavLink to="/">
        <House />
      </NavLink>
    </Button>
  )
}

export default GoHome
