import { Toaster as SonnerToaster, toast } from "sonner";

export const Toaster = () => {
  return <SonnerToaster richColors position="top-right" />;
};

export { toast };