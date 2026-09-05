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
  footer,
}: BaseModalProps) {
  return (
    <DialogRoot open={isOpen} onOpenChange={onClose} size={size} placement="center">
      <DialogContent bg="white" color="navy.500" borderRadius="xl" overflow="hidden">
        <DialogHeader bg="navy.600" color="white" px={6} py={4}>
          <DialogTitle fontWeight="bold" letterSpacing="tight">
            {title}
          </DialogTitle>
          <DialogCloseTrigger color="white" _hover={{ bg: "whiteAlpha.300" }} />
        </DialogHeader>

        <DialogBody bg="white" color="navy.500" px={6} py={5}>
          {children}
        </DialogBody>

        {footer && (
          <DialogFooter bg="gray.50" borderTop="1px solid" borderColor="gray.100" px={6} py={4}>
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </DialogRoot>
  );
}
