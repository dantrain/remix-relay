import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";
import { type ReactNode } from "react";
import { useMediaQuery } from "usehooks-ts";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "~/lib/cn";

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      `data-[state=open]:animate-in data-[state=closed]:animate-out
      data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0
      z-50 grid grid-cols-[minmax(1rem,1fr)_auto_minmax(1rem,1fr)]
      grid-rows-[minmax(1rem,1fr)_auto_minmax(1rem,3fr)] justify-center
      overflow-y-auto bg-black/40`,
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogOverlay>
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          `data-[state=open]:animate-in data-[state=closed]:animate-out
          data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
          data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
          data-[state=closed]:slide-out-to-top-[5%]
          data-[state=open]:slide-in-from-top-[5%] col-start-2 row-start-2
          w-screen max-w-md rounded-md border border-slate-400 bg-white p-6
          shadow-lg`,
          className,
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogOverlay>
  </DialogPrimitive.Portal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-col space-y-4 text-center sm:mb-4 sm:text-left",
        className,
      )}
      {...props}
    />
  );
}
DialogHeader.displayName = "DialogHeader";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-muted-foreground text-sm", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

function Drawer({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return (
    <DrawerPrimitive.Root
      shouldScaleBackground={shouldScaleBackground}
      {...props}
    />
  );
}
Drawer.displayName = "Drawer";

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/40", className)}
    {...props}
  />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPrimitive.Portal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        `fixed inset-x-0 bottom-0 z-50 flex max-h-[96dvh] flex-col border-t
        border-slate-400 bg-white outline-none`,
        className,
      )}
      {...props}
    >
      <div className="overflow-y-auto px-6 pb-8">
        <div className="mx-auto mb-6 mt-4 h-2 w-[100px] rounded-full bg-black/10" />
        {children}
      </div>
    </DrawerPrimitive.Content>
  </DrawerPrimitive.Portal>
));
DrawerContent.displayName = "DrawerContent";

function DrawerHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mb-6 grid gap-4 text-center sm:text-left", className)}
      {...props}
    />
  );
}
DrawerHeader.displayName = "DrawerHeader";

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-muted-foreground text-sm", className)}
    {...props}
  />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

type ResponsiveDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  content: ReactNode;
};

export function ResponsiveDialog({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  content,
}: ResponsiveDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
        <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description ? (
              <DialogDescription>{description}</DialogDescription>
            ) : null}
          </DialogHeader>
          {content}
        </DialogContent>
      </DialogPrimitive.Root>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerPrimitive.Trigger asChild>{trigger}</DrawerPrimitive.Trigger>

      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          {description ? (
            <DrawerDescription>{description}</DrawerDescription>
          ) : null}
        </DrawerHeader>
        {content}
      </DrawerContent>
    </Drawer>
  );
}
ResponsiveDialog.displayName = "ResponsiveDialog";

export const ResponsiveDialogClose = DialogPrimitive.Close;

export function ResponsiveDialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col gap-3 sm:flex-row-reverse", className)}
      {...props}
    />
  );
}
ResponsiveDialogFooter.displayName = "ResponsiveDialogFooter";
