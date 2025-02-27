// components/ui/collapsible.tsx
"use client"

import * as React from "react"

interface CollapsibleProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

const Collapsible = ({
  open: controlledOpen,
  onOpenChange,
  children,
  className,
  ...props
}: CollapsibleProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const handleOpenChange = (open: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(open)
    }
    onOpenChange?.(open)
  }

  return (
    <div className={className} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            open,
            onOpenChange: handleOpenChange,
          })
        }
        return child
      })}
    </div>
  )
}

interface CollapsibleTriggerProps {
  asChild?: boolean
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const CollapsibleTrigger = ({
  asChild,
  children,
  open,
  onOpenChange,
}: CollapsibleTriggerProps) => {
  const handleClick = () => {
    onOpenChange?.(!open)
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: handleClick,
    })
  }

  return <div onClick={handleClick}>{children}</div>
}

interface CollapsibleContentProps {
  children: React.ReactNode
  open?: boolean
}

const CollapsibleContent = ({ children, open }: CollapsibleContentProps) => {
  if (!open) return null
  return <div>{children}</div>
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }