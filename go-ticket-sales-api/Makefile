.PHONY: clean swag init-db build build-production run

# Directories
SWAGGER_DIR = ./docs
CMD_DIR = ./cmd/events
HANDLER_DIR = ./internal/events/infra/http

# Binary name
BINARY_NAME = events
BINARY_PATH = build/$(BINARY_NAME)

# DB variables
DB_USER = test_user
DB_PASSWORD = test_password
DB_HOST = localhost
DB_PORT = 3306
DB_NAME = test_db

clean:
	rm -rf $(SWAGGER_DIR)
	rm -f $(BINARY_PATH)

swag:
	swag init --output docs --dir ./cmd/events,./internal/events/infra/http,./internal/events/usecase

# Init DB (if needed)
init-db:
	mysql -u$(DB_USER) -p$(DB_PASSWORD) -h$(DB_HOST) -P$(DB_PORT) -e "CREATE DATABASE IF NOT EXISTS $(DB_NAME);"

build:
	go build -o $(BINARY_PATH) $(CMD_DIR)/main.go

build-production:
	CGO_ENABLED=0 GOOS=linux go build -o $(BINARY_PATH) $(CMD_DIR)/main.go

run: build
	./$(BINARY_PATH)

dev: swag build run

prod: swag build-production run
