package domain

import (
	"errors"

	"github.com/google/uuid"
)

var (
	ErrSpotNotFound        = errors.New("spot not found")
	ErrSpotNameRequired    = errors.New("spot name is required")
	ErrSpotNameLength      = errors.New("spot name must be at least 2 characters long")
	ErrSpotNamePrefix      = errors.New("spot name must start with a letter")
	ErrSpotNameSuffix      = errors.New("spot name must end with a number")
	ErrSpotAlreadyReserved = errors.New("spot already reserved")
)

type SpotStatus string

const (
	SpotStatusAvailable SpotStatus = "available"
	SpotStatusSold      SpotStatus = "sold"
)

type Spot struct {
	ID       string
	EventID  string
	Name     string // all name uses the rule: Letter+Number. Ex: A1, B2, C3, etc.
	Status   SpotStatus
	TicketID string
}

// NewSpot creates a new spot with the given parameters.
func NewSpot(event *Event, name string) (*Spot, error) {
	spot := &Spot{
		ID:      uuid.New().String(),
		EventID: event.ID,
		Name:    name,
		Status:  SpotStatusAvailable,
	}
	if err := spot.Validate(); err != nil {
		return nil, err
	}
	return spot, nil
}

// Validate checks if the spot data is valid.
func (s *Spot) Validate() error {
	if len(s.Name) == 0 {
		return ErrSpotNameRequired
	}
	if len(s.Name) < 2 {
		return ErrSpotNameLength
	}
	// Validate if the spot name is in the correct format
	if s.Name[0] < 'A' || s.Name[0] > 'Z' {
		return ErrSpotNamePrefix
	}
	if s.Name[1] < '0' || s.Name[1] > '9' {
		return ErrSpotNameSuffix
	}
	return nil
}

// Reserve reserves the spot for the given ticket ID.
func (s *Spot) Reserve(ticketID string) error {
	if s.Status == SpotStatusSold {
		return ErrSpotAlreadyReserved
	}
	s.Status = SpotStatusSold
	s.TicketID = ticketID
	return nil
}
