import Link from "next/link";

import { TICKET_SALES_API_TOKEN, TICKET_SALES_API_URL } from "@/utils/consts";
import { getSelectedSpots, getSelectedTicketType } from "@/actions";
import { EventModel, SpotModel } from "@/models";
import { formatPrice } from "@/utils/currency";
import { formatDate } from "@/utils/date";

import { EventImage } from "@/components/EventImage";
import { Title } from "@/components/Title";
import { SpotSeat } from "@/components/SpotSeat";
import { TicketTypeSelect } from "./TicketTypeSelect";

export async function getSpots(eventId: string): Promise<{
  event: EventModel;
  spots: SpotModel[];
}> {
  const response = await fetch(
    `${TICKET_SALES_API_URL}/events/${eventId}/spots`,
    {
      headers: { apikey: TICKET_SALES_API_TOKEN },
      cache: "no-store",
      next: {
        tags: [`events/${eventId}`],
      },
    }
  );
  return response.json();
}

export default async function SpotsLayoutPage({
  params,
}: {
  params: { eventId: string };
}) {
  const { event, spots } = await getSpots(params.eventId);

  //[a, a, a, b, b,  c, d]
  const rowLetters = spots.map((spot) => spot.name[0]);

  //[a, b, c, d]
  const uniqueRows = rowLetters.filter(
    (row, index) => rowLetters.indexOf(row) === index
  );

  const spotGroupedByRow = uniqueRows.map((row) => ({
    row,
    spots: [
      ...spots
        .filter((spot) => spot.name[0] === row)
        .sort((a, b) => {
          const aNumber = parseInt(a.name.slice(1));
          const bNumber = parseInt(b.name.slice(1));
          if (aNumber < bNumber) return -1;
          if (aNumber > bNumber) return 1;
          return 0;
        }),
    ],
  }));

  const selectedSpots = await getSelectedSpots(event.id);
  const ticketType = await getSelectedTicketType();

  const totalPrice =
    ticketType === "half"
      ? (selectedSpots.length * event.price) / 2
      : selectedSpots.length * event.price;

  const formattedFullPrice = formatPrice(event.price);
  const formattedHalfPrice = formatPrice(event.price / 2);
  const formattedTotalPrice = formatPrice(totalPrice);

  return (
    <main className="mt-10">
      <div className="flex w-[1176px] max-w-full flex-row flex-wrap justify-center gap-x-8 rounded-2xl bg-secondary p-4 md:justify-normal">
        <EventImage src={event.image_url} alt={event.name} />
        <div className="flex max-w-full flex-col gap-y-6">
          <div className="flex flex-col gap-y-2 ">
            <p className="text-sm font-semibold uppercase text-subtitle">
              {formatDate(event.date)}
            </p>
            <p className="text-2xl font-semibold">{event.name}</p>
            <p className="font-normal">{event.location}</p>
          </div>
          <div className="flex h-[128px] flex-wrap justify-between gap-y-5 gap-x-3">
            <div className="flex flex-col gap-y-2">
              <p className="font-semibold">Organizador</p>
              <p className="text-sm font-normal">{event.organization}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <p className="font-semibold">Classificação</p>
              <p className="text-sm font-normal">{event.rating}</p>
            </div>
          </div>
        </div>
      </div>
      <Title className="mt-10">Escolha o seu lugar</Title>
      <div className="mt-6 flex flex-wrap justify-between">
        <div className=" mb-4 flex w-full max-w-[650px] flex-col gap-y-8 rounded-2xl bg-secondary p-6">
          <div className="rounded-2xl bg-bar py-4 text-center text-[20px] font-bold uppercase text-white">
            Palco
          </div>
          <div className="md:w-full md:justify-normal">
            {spotGroupedByRow.map((row) => {
              return (
                <div
                  key={row.row}
                  className="flex flex-row gap-3 items-center mb-3"
                >
                  <div className="w-4">{row.row}</div>
                  <div className="ml-2 flex flex-row">
                    {row.spots.map((spot) => {
                      return (
                        <SpotSeat
                          key={spot.name}
                          spotId={spot.name}
                          spotLabel={spot.name.slice(1)}
                          eventId={event.id}
                          selected={selectedSpots.includes(spot.name)}
                          disabled={spot.status === "sold"}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex w-full flex-row justify-around">
            <div className=" flex flex-row items-center">
              <span className="mr-1 block h-4 w-4 rounded-full bg-[#00A96E]" />
              Disponível
            </div>
            <div className=" flex flex-row items-center">
              <span className="mr-1 block h-4 w-4 rounded-full bg-[#A6ADBB]" />
              Ocupado
            </div>
            <div className=" flex flex-row items-center">
              <span className="mr-1 block h-4 w-4  rounded-full bg-[#7480FF]" />
              Selecionado
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-[478px] flex-col gap-y-6 rounded-2xl bg-secondary px-4 py-6">
          <h1 className="text-[20px] font-semibold">
            Confira os valores do evento
          </h1>
          <p>
            Inteira: {formattedFullPrice} <br />
            Meia-entrada: {formattedHalfPrice}
          </p>
          <div className="flex flex-col">
            <TicketTypeSelect
              defaultValue={ticketType as "half" | "full"}
              formattedFullPrice={formattedFullPrice}
              formattedHalfPrice={formattedHalfPrice}
            />
          </div>
          <div>Total: {formattedTotalPrice}</div>
          <Link
            href="/checkout"
            className="rounded-lg bg-btn-primary py-4 text-sm font-semibold uppercase text-btn-primary text-center hover:bg-[#fff]"
          >
            Ir para o pagamento
          </Link>
        </div>
      </div>
    </main>
  );
}
