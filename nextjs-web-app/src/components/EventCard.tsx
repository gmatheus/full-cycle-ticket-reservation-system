import Link from "next/link";
import { formatDate } from "@/utils/date";
import { EventModel } from "@/models";
import { EventImage } from "./EventImage";

export type EventCardProps = {
  event: EventModel;
};

export function EventCard(props: EventCardProps) {
  return (
    <Link href={`/event/${props.event.id}/spots-layout`}>
      <div className="flex w-[277px] flex-col rounded-2xl bg-secondary">
        <EventImage src={props.event.image_url} alt={props.event.name} />
        <div className="flex flex-col gap-y-2 px-4 py-6">
          <p className="text-sm uppercase text-subtitle">
            {formatDate(props.event.date)}
          </p>
          <p className="font-semibold">{props.event.name}</p>
          <p className="text-sm font-normal">{props.event.location}</p>
        </div>
      </div>
    </Link>
  );
}
