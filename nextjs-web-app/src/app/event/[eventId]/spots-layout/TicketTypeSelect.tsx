"use client";
import { selectTicketType } from "@/actions";

export type TicketTypeSelectProps = {
  defaultValue: "full" | "half";
  formattedFullPrice: string;
  formattedHalfPrice: string;
};

export function TicketTypeSelect(props: TicketTypeSelectProps) {
  return (
    <>
      <label htmlFor="ticket-type">Escolha o tipo de ingresso</label>
      <select
        name="ticket-type"
        id="ticket-type"
        className="mt-2 rounded-lg bg-input px-4 py-[14px]"
        defaultValue={props.defaultValue}
        onChange={async (e) => {
          await selectTicketType(e.target.value as any);
        }}
      >
        <option value="full">Inteira - {props.formattedFullPrice}</option>
        <option value="half">Meia-entrada - {props.formattedHalfPrice}</option>
      </select>
    </>
  );
}
