import { capitalize } from "./text";

export const formatDate = (date: string) =>
  capitalize(
    new Date(date).toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  );
