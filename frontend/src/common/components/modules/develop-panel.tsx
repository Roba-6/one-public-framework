import { Wrench } from 'lucide-react'
import { Fragment } from 'react'

import { Button } from '@/common/components/ui/button'
// import RuiBack from '@/assets/images/rui-back.gif'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/common/components/ui/drawer'
import { Separator } from '@/common/components/ui/separator'

const DevelopPanel = () => {
  const baseColors = [
    {
      title: 'Green',
      subTitle: 'Primary Color',
      description:
        'A refreshing, natural color palette inspired by the lush greenery of forests.',
      colors: [
        { name: 'color-green-50', className: 'bg-[var(--color-green-50)]' },
        { name: 'color-green-100', className: 'bg-[var(--color-green-100)]' },
        { name: 'color-green-200', className: 'bg-[var(--color-green-200)]' },
        { name: 'color-green-300', className: 'bg-[var(--color-green-300)]' },
        { name: 'color-green-400', className: 'bg-[var(--color-green-400)]' },
        { name: 'color-green-500', className: 'bg-[var(--color-green-500)]' },
        { name: 'color-green-600', className: 'bg-[var(--color-green-600)]' },
        { name: 'color-green-700', className: 'bg-[var(--color-green-700)]' },
        { name: 'color-green-800', className: 'bg-[var(--color-green-800)]' },
        { name: 'color-green-900', className: 'bg-[var(--color-green-900)]' },
      ],
    },
    {
      title: 'Rose',
      subTitle: 'Secondary Color',
      description: 'A warm, vibrant color palette inspired by the beauty of roses.',
      colors: [
        { name: 'color-rose-50', className: 'bg-[var(--color-rose-50)]' },
        { name: 'color-rose-100', className: 'bg-[var(--color-rose-100)]' },
        { name: 'color-rose-200', className: 'bg-[var(--color-rose-200)]' },
        { name: 'color-rose-300', className: 'bg-[var(--color-rose-300)]' },
        { name: 'color-rose-400', className: 'bg-[var(--color-rose-400)]' },
        { name: 'color-rose-500', className: 'bg-[var(--color-rose-500)]' },
        { name: 'color-rose-600', className: 'bg-[var(--color-rose-600)]' },
        { name: 'color-rose-700', className: 'bg-[var(--color-rose-700)]' },
        { name: 'color-rose-800', className: 'bg-[var(--color-rose-800)]' },
        { name: 'color-rose-900', className: 'bg-[var(--color-rose-900)]' },
      ],
    },
    {
      title: 'Gray',
      subTitle: 'Neutral Color',
      description:
        'A versatile color palette for creating a neutral and balanced design.',
      colors: [
        { name: 'color-gray-50', className: 'bg-[var(--color-gray-50)]' },
        { name: 'color-gray-100', className: 'bg-[var(--color-gray-100)]' },
        { name: 'color-gray-200', className: 'bg-[var(--color-gray-200)]' },
        { name: 'color-gray-300', className: 'bg-[var(--color-gray-300)]' },
        { name: 'color-gray-400', className: 'bg-[var(--color-gray-400)]' },
        { name: 'color-gray-500', className: 'bg-[var(--color-gray-500)]' },
        { name: 'color-gray-600', className: 'bg-[var(--color-gray-600)]' },
        { name: 'color-gray-700', className: 'bg-[var(--color-gray-700)]' },
        { name: 'color-gray-800', className: 'bg-[var(--color-gray-800)]' },
        { name: 'color-gray-900', className: 'bg-[var(--color-gray-900)]' },
      ],
    },
    {
      title: 'Brown',
      subTitle: 'Base Color',
      description:
        'A warm and earthy color palette for creating a grounded and reliable design.',
      colors: [
        { name: 'color-brown-50', className: 'bg-[var(--color-brown-50)]' },
        { name: 'color-brown-100', className: 'bg-[var(--color-brown-100)]' },
        { name: 'color-brown-200', className: 'bg-[var(--color-brown-200)]' },
        { name: 'color-brown-300', className: 'bg-[var(--color-brown-300)]' },
        { name: 'color-brown-400', className: 'bg-[var(--color-brown-400)]' },
        { name: 'color-brown-500', className: 'bg-[var(--color-brown-500)]' },
        { name: 'color-brown-600', className: 'bg-[var(--color-brown-600)]' },
        { name: 'color-brown-700', className: 'bg-[var(--color-brown-700)]' },
        { name: 'color-brown-800', className: 'bg-[var(--color-brown-800)]' },
        { name: 'color-brown-900', className: 'bg-[var(--color-brown-900)]' },
      ],
    },
  ]

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" className="fixed bottom-4 right-4">
          <Wrench />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="panel develop-panel">
        <DrawerHeader>
          <DrawerTitle>Developer Palette</DrawerTitle>
          <DrawerDescription className="text-justify">
            Quick access to approved colors and visual assets used in the project.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 grid grid-cols-[1fr_8px_1fr] gap-2">
          {baseColors.map((item: any, idx: number) => (
            <Fragment key={idx}>
              <div className="grid w-40">
                <span className="font-semibold">{item.title}</span>
                <span className="text-[var(--muted-foreground)]">{item.subTitle}</span>
                {item.colors.map((color: any, colorIdx: number) => (
                  <span key={colorIdx} className="color-item">
                    <span className={`color-box ${color.className}`} />
                    {color.name}
                  </span>
                ))}
              </div>
              {idx % 2 === 0 && (
                <Separator orientation="vertical" style={{ height: 'auto' }} />
              )}
            </Fragment>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default DevelopPanel
