"use client";
import { PropsWithChildren } from "react";

import { checkout } from "@/actions";
import { getHashCode } from "@/utils/text";
import { errorHandler } from "@/utils/error";

const getCardHash = (keys: string[]) => {
  return getHashCode(keys.join()).toString();
};

export type CheckoutFormProps = {
  className?: string;
};

const onSubmit = async (formData: FormData) => {
  const cardHash = getCardHash([
    formData.get("card_name") as string,
    formData.get("cc") as string,
    formData.get("expire_date") as string,
    formData.get("cvv") as string,
  ]);
  try {
    await checkout({
      cardHash,
      email: formData.get("email") as string,
    });
  } catch (error) {
    alert(errorHandler(error));
  }
};

export function CheckoutForm(props: PropsWithChildren<CheckoutFormProps>) {
  return (
    <form action={onSubmit} className={props.className}>
      <input type="hidden" name="card_hash" />
      {props.children}
    </form>
  );
}
