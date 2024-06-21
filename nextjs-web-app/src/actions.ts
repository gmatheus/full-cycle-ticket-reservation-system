"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TICKET_SALES_API_URL } from "./utils/consts";

export async function getSelectedEventId(): Promise<string | undefined> {
  const cookieStore = cookies();
  return cookieStore.get("eventId")?.value;
}

export async function getSelectedSpots(eventId: string): Promise<string[]> {
  const cookieStore = cookies();
  const selectedEventId = await getSelectedEventId();
  if (selectedEventId != eventId) return [];
  const selectedSpots = JSON.parse(cookieStore.get("spots")?.value || "[]");
  return selectedSpots || [];
}

export async function getSelectedTicketType(): Promise<string> {
  const cookieStore = cookies();
  return cookieStore.get("ticketType")?.value || "full";
}

export async function selectSpot(eventId: string, spotName: string) {
  const cookieStore = cookies();
  const currentSpots = await getSelectedSpots(eventId);
  currentSpots.push(spotName);
  const uniqueSpots = currentSpots.filter(
    (spot: string, index: number) => currentSpots.indexOf(spot) === index
  );
  cookieStore.set("spots", JSON.stringify(uniqueSpots));
  cookieStore.set("eventId", eventId);
}

export async function unselectSpot(eventId: string, spotName: string) {
  const cookieStore = cookies();
  const currentSpots = await getSelectedSpots(eventId);
  const newSpots = currentSpots.filter((spot: string) => spot !== spotName);
  cookieStore.set("spots", JSON.stringify(newSpots));
}

export async function selectTicketType(ticketType: "full" | "half") {
  const cookieStore = cookies();
  cookieStore.set("ticketType", ticketType);
}

export async function checkout({
  cardHash,
  email,
}: {
  cardHash: string;
  email: string;
}) {
  const eventId = (await getSelectedEventId()) as string;
  const spots = await getSelectedSpots(eventId);
  const ticketType = await getSelectedTicketType();

  const response = await fetch(`${TICKET_SALES_API_URL}/checkout`, {
    method: "POST",
    body: JSON.stringify({
      event_id: eventId,
      card_hash: cardHash,
      ticket_type: ticketType,
      spots,
      email,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(`Erro ao realizar a compra: ${message}`);
  }

  revalidateTag(`events/${eventId}`);
  redirect(`/checkout/${eventId}/success`);
}
