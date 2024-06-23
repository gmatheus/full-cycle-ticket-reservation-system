import { EventModel } from "@/models";
import { TICKET_SALES_API_TOKEN, TICKET_SALES_API_URL } from "@/utils/consts";

import { Title } from "@/components/Title";
import { EventCard } from "@/components/EventCard";

export async function getEvents(): Promise<EventModel[]> {
  try {
    const response = await fetch(`${TICKET_SALES_API_URL}/events`, {
      headers: { apikey: TICKET_SALES_API_TOKEN },
      cache: "no-store",
      next: {
        tags: ["events"],
      },
    });
    return (await response.json()).events;
  } catch (error) {
    return [];
  }
}

export default async function HomePage() {
  const events = await getEvents();
  return (
    <main className="mt-10 flex flex-col">
      <Title>Eventos disponíveis</Title>
      <div className="mt-8 sm:grid sm:grid-cols-auto-fit-cards flex flex-wrap justify-center gap-x-2 gap-y-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </main>
  );
}
