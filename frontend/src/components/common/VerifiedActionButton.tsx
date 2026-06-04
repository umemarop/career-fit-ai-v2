"use client";

import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/useAuth";

type VerifiedActionButtonProps = ComponentProps<typeof Button>;

export function VerifiedActionButton({
  disabled,
  title,
  ...props
}: VerifiedActionButtonProps) {
  const { user } = useAuth();

  const isEmailVerified = Boolean(user?.isEmailVerified);
  const isDisabled = disabled || !isEmailVerified;

  return (
    <Button
      {...props}
      disabled={isDisabled}
      title={
        title ??
        (!isEmailVerified
          ? "Please verify your email to use this feature."
          : undefined)
      }
    />
  );
}
