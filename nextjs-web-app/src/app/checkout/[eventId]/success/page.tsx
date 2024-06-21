import { EventModel } from "@/models";
import { TICKET_SALES_API_URL } from "@/utils/consts";
import { formatDate } from "@/utils/date";
import { Title } from "@/components/Title";

export async function getEvent(eventId: string): Promise<EventModel> {
  const response = await fetch(`${TICKET_SALES_API_URL}/events/${eventId}`, {
    cache: "no-store",
    next: {
      tags: [`events/${eventId}`],
    },
  });
  return response.json();
}

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: {
  params: { eventId: string };
  searchParams: { selectedSpots: string[] };
}) {
  const event = await getEvent(params.eventId);
  const { selectedSpots = [] } = searchParams;
  return (
    <main className="mt-10 flex flex-col flex-wrap items-center ">
      <Title>Compra realizada com sucesso!</Title>
      <div className="mb-4 flex max-h-[250px] w-full max-w-[478px] flex-col gap-y-6 rounded-2xl bg-secondary p-4">
        <Title>Resumo da compra</Title>
        <p className="font-semibold">
          Evento: {event.name}
          <br />
          Local: {event.location}
          <br />
          Data: {formatDate(event.date)}
        </p>
        <p className="font-semibold text-white">
          Lugares escolhidos: {selectedSpots.join(", ")}
        </p>
      </div>
    </main>
  );
}
