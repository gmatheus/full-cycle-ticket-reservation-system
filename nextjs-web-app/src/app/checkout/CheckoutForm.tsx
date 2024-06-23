"use client";
import { PropsWithChildren } from "react";
import { useFormState } from "react-dom";

import { checkout } from "@/actions";
import { getHashCode } from "@/utils/text";
import { ErrorMessage } from "@/components/ErrorMessage";

const getCardHash = (keys: string[]) => {
  return getHashCode(keys.join()).toString();
};

export type CheckoutFormProps = {
  className?: string;
};

export function CheckoutForm(props: PropsWithChildren<CheckoutFormProps>) {
  const [formState, formAction] = useFormState(checkout, {
    error: null as string | null,
  });

  const onSubmit = async (formData: FormData) => {
    const cardHash = getCardHash([
      formData.get("card_name") as string,
      formData.get("cc") as string,
      formData.get("expire_date") as string,
      formData.get("cvv") as string,
    ]);
    formAction({
      cardHash,
      email: formData.get("email") as string,
    });
  };

  return (
    <form action={onSubmit} className={props.className}>
      {formState?.error && <ErrorMessage error={formState.error} />}
      <input type="hidden" name="card_hash" />
      {props.children}
    </form>
  );
}
