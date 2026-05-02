import {
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
  } from "@/components/ui/dialog";
  import type { ReactNode } from "react";
  
  interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
    footer?: ReactNode;
  }
  
  export function BaseModal({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    size = "md", 
    footer 
  }: BaseModalProps) {
    return (
      <DialogRoot open={isOpen} onOpenChange={onClose} size={size} placement="center">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogCloseTrigger />
          </DialogHeader>
          
          <DialogBody>{children}</DialogBody>
  
          {footer && <DialogFooter>{footer}</DialogFooter>}
        </DialogContent>
      </DialogRoot>
    );
  }