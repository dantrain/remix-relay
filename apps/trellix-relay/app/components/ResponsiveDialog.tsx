import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { ReactNode, HTMLAttributes, ComponentProps } from "react";
import { useIsClient, useMediaQuery } from "usehooks-ts";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "~/lib/cn";

function DialogOverlay({
  ref,
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
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
  );
}

function DialogContent({
  ref,
  className,
  children,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content>) {
  return (
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
  );
}

function DialogHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
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

function DialogTitle({
  ref,
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

function DialogDescription({
  ref,
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function Drawer({
  shouldScaleBackground = true,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Root>) {
  return (
    <DrawerPrimitive.Root
      shouldScaleBackground={shouldScaleBackground}
      {...props}
    />
  );
}

function DrawerOverlay({
  ref,
  className,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      ref={ref}
      className={cn("fixed inset-0 z-50 bg-black/40", className)}
      {...props}
    />
  );
}

function DrawerContent({
  ref,
  className,
  children,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Content>) {
  return (
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
          <div
            className="mx-auto mb-6 mt-4 h-2 w-[100px] rounded-full bg-black/10"
          />
          {children}
        </div>
      </DrawerPrimitive.Content>
    </DrawerPrimitive.Portal>
  );
}

function DrawerHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mb-6 grid gap-4 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function DrawerTitle({
  ref,
  className,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      ref={ref}
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

function DrawerDescription({
  ref,
  className,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      ref={ref}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

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
  const isClient = useIsClient();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (!isClient) {
    return trigger;
  }

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

export const ResponsiveDialogClose = DialogPrimitive.Close;

export function ResponsiveDialogFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col gap-3 sm:flex-row-reverse", className)}
      {...props}
    />
  );
}
