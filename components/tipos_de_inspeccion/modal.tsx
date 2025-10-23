"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,

} from "@/components/ui/dialog"

interface ModalProps {
    title: string;
    description: string;
    btnName: string;
    children: React.ReactNode;
    onClose?: () => void;
}

export function Modal({ title, description, btnName, children, onClose }: ModalProps) {
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const handleClose = () => {
        setOpen(false)
        onClose?.()
        router.refresh()
    }

    const childWithOnSuccess = React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<any>, { onSuccess: handleClose })
        : children

    return (
        <Dialog
          open={open}
          onOpenChange={(next) => {
            setOpen(next)
            if (!next) {
              onClose?.()
              router.refresh()
            }
          }}
        >
          <DialogTrigger className="bg-primary text-primary-foreground py-1 px-4 rounded">{btnName}</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>
                {description}
              </DialogDescription>
            </DialogHeader>
           
            {childWithOnSuccess}
          </DialogContent>
        </Dialog>
    )}