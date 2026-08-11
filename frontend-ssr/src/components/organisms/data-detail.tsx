'use client'

import * as Icon from 'lucide-react'
import React from 'react'
import Markdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

import type { DataDetailProps } from '@/src/common/types/props'
import { Skeleton } from '@/src/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/src/components/ui/tooltip'
import type { Attachment } from '@/src/features/admin/attachments/attachment'
import { formatDay, formatNumber, getValue, setDownloadUrl } from '@/src/lib/utils'

const DataDetail = <T,>(props: DataDetailProps<T>): React.ReactNode => {
  console.log('data', props.data)

  const renderItems = () => {
    return (
      <React.Fragment>
        {props.data &&
          props.columns.map((item, idx: number) => {
            console.log('item', item)
            if (item.type === 'title') {
              return (
                <div key={idx} className="mb-8 col-span-6 text-2xl">
                  {getValue(props.data, item.key)}
                  <small className="ps-2 text-sm text-neutral-500">
                    {(props.data as any).id}
                  </small>
                </div>
              )
            } else if (item.type === 'paragraph') {
              return (
                <React.Fragment key={idx}>
                  <div className="">{item.name}</div>
                  <div className="col-span-5">
                    <p>{getValue(props.data, item.key)}</p>
                  </div>
                </React.Fragment>
              )
            } else if (item.type === 'markdown') {
              return (
                <React.Fragment key={idx}>
                  <div className="">{item.name}</div>
                  <div className="col-span-5">
                    <Markdown
                      rehypePlugins={[rehypeRaw, remarkGfm]}
                      components={{
                        code(props) {
                          const { children, className } = props
                          const match = /language-(\w+)/.exec(className || '')
                          return match ? (
                            <SyntaxHighlighter
                              PreTag="div"
                              language={match[1]}
                              style={tomorrow}
                              showLineNumbers={true}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={className}>{children}</code>
                          )
                        },
                      }}
                    >
                      {getValue(props.data, item.key)}
                    </Markdown>
                  </div>
                </React.Fragment>
              )
            } else if (item.type === 'datetime') {
              return (
                <React.Fragment key={idx}>
                  <div className="">{item.name}</div>
                  <div className="col-span-5">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          {formatDay(getValue(props.data, item.key), 'shortDatetime')}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {formatDay(getValue(props.data, item.key))}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </React.Fragment>
              )
            } else if (item.type === 'number') {
              return (
                <React.Fragment key={idx}>
                  <div className="">{item.name}</div>
                  <div className="col-span-5">
                    {formatNumber(getValue(props.data, item.key))}
                  </div>
                </React.Fragment>
              )
            } else if (item.type === 'booleanIcon') {
              const value: boolean = getValue(props.data, item.key)

              let iconName: keyof typeof Icon = 'Check'
              if (item.values && item.values.length == 2) {
                iconName = value ? item.values[0] : item.values[1]
              }

              let color: string = ''
              if (item.colors && item.colors.length == 2) {
                color = item.colors[value ? 0 : 1]
              }
              const ItemIcon = Icon[iconName] as React.FC<any>
              return (
                <React.Fragment key={idx}>
                  <div className="">{item.name}</div>
                  <div className="py-1 col-span-5">
                    {ItemIcon && <ItemIcon size={16} className={color} />}
                  </div>
                </React.Fragment>
              )
            } else if (item.type === 'previewer') {
              const data: Attachment = props.data as Attachment
              console.log('props.data:', props.data)
              console.log('mimeType:', (props.data as Attachment).mimeType)
              console.log('item:', item)
              return (
                <div key={idx} className="mb-8 col-span-6 text-2xl">
                  {/* Images */}
                  {data.mimeType.startsWith('image/') && (
                    <div className="h-48 relative">
                      <img
                        src={setDownloadUrl((data as any)[item.key])}
                        alt={data.name}
                        className="max-w-[100%] max-h-[100%]"
                      />
                    </div>
                  )}
                  {/* Video */}
                  {data.mimeType.startsWith('video/') && (
                    <div className="h-48 relative">
                      <video
                        src={setDownloadUrl((data as any)[item.key])}
                        controls
                        className="max-w-[100%] max-h-[100%]"
                      />
                    </div>
                  )}
                  {/* Audio */}
                  {data.mimeType.startsWith('audio/') && (
                    <div className="h-12 relative">
                      <audio
                        src={setDownloadUrl((data as any)[item.key])}
                        controls
                        preload="metadata"
                        className="w-[100%] max-h-[100%]"
                      />
                    </div>
                  )}
                  {/* PDF */}
                  {data.mimeType === 'application/pdf' && (
                    <div className=" h-48 relative">
                      <iframe
                        src={setDownloadUrl((data as any)[item.key])}
                        className="w-[100%] h-[100%]"
                      />
                    </div>
                  )}
                </div>
              )
            } else if (item.type === 'json') {
              return (
                <React.Fragment key={idx}>
                  <div className="">{item.name}</div>
                  <div className="col-span-5">
                    <p>{JSON.stringify(getValue(props.data, item.key))}</p>
                  </div>
                </React.Fragment>
              )
            } else {
              return (
                <React.Fragment key={idx}>
                  <div className="">{item.name}</div>
                  {/*<div className="col-span-5">{(props.data as any)[item.key]}</div>*/}
                  <div className="col-span-5">{getValue(props.data, item.key)}</div>
                </React.Fragment>
              )
            }
          })}
      </React.Fragment>
    )
  }

  return (
    <div className="grid grid-cols-6 gap-4">
      {props.loadingData
        ? Array(3)
            .fill(null)
            .map((_, idx: number) => (
              <React.Fragment key={idx}>
                <div className="">
                  <Skeleton className="my-2 h-4 w-auto" />
                </div>
                <div className="col-span-5">
                  <Skeleton className="my-2 h-4 w-auto col-span-3" />
                </div>
              </React.Fragment>
            ))
        : renderItems()}
    </div>
  )
}

export default DataDetail
