package usecase

import (
	"github.com/gmatheus/full-cycle-ticket-reservation-system/go-ticket-sales-api/internal/events/domain"
	"github.com/gmatheus/full-cycle-ticket-reservation-system/go-ticket-sales-api/internal/events/infra/service"
)

type BuyTicketsInputDTO struct {
	EventID    string   `json:"event_id"`
	Spots      []string `json:"spots"`
	TicketType string   `json:"ticket_type"`
	CardHash   string   `json:"card_hash"`
	Email      string   `json:"email"`
}

type BuyTicketsOutputDTO struct {
	Tickets []TicketDTO `json:"tickets"`
}

type BuyTicketsUseCase struct {
	repo           domain.EventRepository
	partnerFactory service.PartnerFactory
}

func NewBuyTicketsUseCase(repo domain.EventRepository, partnerFactory service.PartnerFactory) *BuyTicketsUseCase {
	return &BuyTicketsUseCase{repo: repo, partnerFactory: partnerFactory}
}

func (uc *BuyTicketsUseCase) Execute(input BuyTicketsInputDTO) (*BuyTicketsOutputDTO, error) {
	// Verifica o evento
	event, err := uc.repo.FindEventByID(input.EventID)
	if err != nil {
		return nil, err
	}

	// Cria a solicitação de reserva
	req := &service.ReservationRequest{
		EventID:    input.EventID,
		Spots:      input.Spots,
		TicketType: input.TicketType,
		CardHash:   input.CardHash,
		Email:      input.Email,
	}

	// Obtém o serviço do parceiro
	partnerService, err := uc.partnerFactory.CreatePartner(event.PartnerID)
	if err != nil {
		return nil, err
	}

	// Reserva os lugares usando o serviço do parceiro
	reservationResponse, err := partnerService.MakeReservation(req)
	if err != nil {
		return nil, err
	}

	// Salva os ingressos no banco de dados
	tickets := make([]domain.Ticket, len(reservationResponse))
	for i, reservation := range reservationResponse {
		spot, err := uc.repo.FindSpotByName(event.ID, reservation.Spot)
		if err != nil {
			return nil, err
		}

		ticket, err := domain.NewTicket(event, spot, domain.TicketType(input.TicketType))
		if err != nil {
			return nil, err
		}

		err = uc.repo.CreateTicket(ticket)
		if err != nil {
			return nil, err
		}

		spot.Reserve(ticket.ID)
		err = uc.repo.ReserveSpot(spot.ID, ticket.ID)
		if err != nil {
			return nil, err
		}

		tickets[i] = *ticket
	}

	ticketDTOs := make([]TicketDTO, len(tickets))
	for i, ticket := range tickets {
		ticketDTOs[i] = TicketDTO{
			ID:         ticket.ID,
			SpotID:     ticket.Spot.ID,
			TicketType: string(ticket.TicketType),
			Price:      ticket.Price,
		}
	}

	return &BuyTicketsOutputDTO{Tickets: ticketDTOs}, nil
}
