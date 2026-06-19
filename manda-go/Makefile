# =============================================================
# MANDA GO — Makefile
# =============================================================
# make dev          → démarre tout (DB + Redis + API)
# make flutter      → lance l'app Flutter
# make db           → démarre seulement la DB
# make migrate      → lance les migrations SQL
# make seed         → insère les données de test
# make logs         → affiche les logs de l'API
# make stop         → arrête tous les services
# make clean        → supprime volumes Docker
# make test         → lance tous les tests
# make build        → build production Flutter + API
# make status       → statut de tous les services
# make help         → affiche cette aide
# =============================================================

# ─── Couleurs ANSI ───────────────────────────────────────────
RED    := \033[0;31m
GREEN  := \033[0;32m
YELLOW := \033[1;33m
BLUE   := \033[0;34m
PURPLE := \033[0;35m
CYAN   := \033[0;36m
BOLD   := \033[1m
RESET  := \033[0m

# ─── Configuration ────────────────────────────────────────────
DOCKER_COMPOSE_FILE := infrastructure/docker/docker-compose.yml
DOCKER_COMPOSE      := docker compose -f $(DOCKER_COMPOSE_FILE)
BACKEND_DIR         := backend
FLUTTER_DIR         := flutter
FLUTTER_BIN         := flutter

.PHONY: help dev flutter flutter-web db migrate seed logs logs-all stop clean \
        test api-test api-test-cov flutter-test flutter-analyze flutter-format \
        build status tools-up tools-down env-check flutter-check node-check \
        restart shell-api shell-db install install-backend install-flutter

# ─── Help (défaut) ────────────────────────────────────────────
help:
	@echo ""
	@echo "$(BOLD)$(RED)  Manda Go — Commandes disponibles$(RESET)"
	@echo "$(CYAN)══════════════════════════════════════════════$(RESET)"
	@echo ""
	@echo "$(BOLD)$(GREEN)Developpement:$(RESET)"
	@echo "  $(YELLOW)make dev$(RESET)             Demarre tout (DB + Redis + API en mode watch)"
	@echo "  $(YELLOW)make flutter$(RESET)         Lance l'app Flutter"
	@echo "  $(YELLOW)make flutter-web$(RESET)     Lance l'app Flutter dans Chrome"
	@echo "  $(YELLOW)make db$(RESET)              Demarre seulement PostgreSQL + Redis"
	@echo "  $(YELLOW)make logs$(RESET)            Affiche les logs de l'API en temps reel"
	@echo "  $(YELLOW)make status$(RESET)          Statut de tous les services Docker"
	@echo "  $(YELLOW)make restart$(RESET)         Redemarrage complet"
	@echo ""
	@echo "$(BOLD)$(GREEN)Base de donnees:$(RESET)"
	@echo "  $(YELLOW)make migrate$(RESET)         Lance les migrations SQL"
	@echo "  $(YELLOW)make seed$(RESET)            Insere les donnees de test"
	@echo "  $(YELLOW)make shell-db$(RESET)        Ouvre psql dans le conteneur DB"
	@echo ""
	@echo "$(BOLD)$(GREEN)Tests:$(RESET)"
	@echo "  $(YELLOW)make test$(RESET)            Lance tous les tests (API + Flutter)"
	@echo "  $(YELLOW)make api-test$(RESET)        Tests backend NestJS uniquement"
	@echo "  $(YELLOW)make api-test-cov$(RESET)    Tests backend avec couverture"
	@echo "  $(YELLOW)make flutter-test$(RESET)    Tests Flutter uniquement"
	@echo "  $(YELLOW)make flutter-analyze$(RESET) Analyse statique Flutter"
	@echo "  $(YELLOW)make flutter-format$(RESET)  Formate le code Flutter"
	@echo ""
	@echo "$(BOLD)$(GREEN)Build:$(RESET)"
	@echo "  $(YELLOW)make build$(RESET)           Build production (Flutter APK + API Docker)"
	@echo ""
	@echo "$(BOLD)$(GREEN)Outils Dev:$(RESET)"
	@echo "  $(YELLOW)make tools-up$(RESET)        Demarre Adminer + Redis Commander"
	@echo "  $(YELLOW)make tools-down$(RESET)      Arrete les outils dev"
	@echo "  $(YELLOW)make shell-api$(RESET)       Shell dans le conteneur API"
	@echo ""
	@echo "$(BOLD)$(GREEN)Installation:$(RESET)"
	@echo "  $(YELLOW)make install$(RESET)         Installe toutes les dependances"
	@echo "  $(YELLOW)make install-backend$(RESET) Installe les dep. backend (npm)"
	@echo "  $(YELLOW)make install-flutter$(RESET) Installe les dep. Flutter (pub get)"
	@echo ""
	@echo "$(BOLD)$(GREEN)Nettoyage:$(RESET)"
	@echo "  $(YELLOW)make stop$(RESET)            Arrete tous les services Docker"
	@echo "  $(YELLOW)make clean$(RESET)           Supprime les volumes Docker (donnees perdues!)"
	@echo ""

# ─── Vérifications préalables ────────────────────────────────
env-check:
	@echo "$(CYAN)  Verification de l'environnement...$(RESET)"
	@command -v docker >/dev/null 2>&1 || { \
		echo "$(RED)  Docker n'est pas installe. Voir: https://docs.docker.com/get-docker/$(RESET)"; \
		exit 1; \
	}
	@docker info >/dev/null 2>&1 || { \
		echo "$(RED)  Docker n'est pas demarre. Ouvrez Docker Desktop.$(RESET)"; \
		exit 1; \
	}
	@echo "$(GREEN)  Docker OK$(RESET)"

flutter-check:
	@command -v $(FLUTTER_BIN) >/dev/null 2>&1 || { \
		echo "$(RED)  Flutter n'est pas installe ou pas dans le PATH.$(RESET)"; \
		echo "$(YELLOW)  Voir: https://flutter.dev/docs/get-started/install$(RESET)"; \
		exit 1; \
	}
	@echo "$(GREEN)  Flutter detecte: $$($(FLUTTER_BIN) --version 2>/dev/null | head -1)$(RESET)"

node-check:
	@command -v node >/dev/null 2>&1 || { \
		echo "$(RED)  Node.js n'est pas installe. Voir: https://nodejs.org$(RESET)"; \
		exit 1; \
	}
	@echo "$(GREEN)  Node.js $$(node --version) detecte$(RESET)"

# ─── Développement ────────────────────────────────────────────
dev: env-check
	@echo ""
	@echo "$(BOLD)$(RED)  Demarrage de Manda Go...$(RESET)"
	@echo "$(CYAN)──────────────────────────────────────────────$(RESET)"
	@if [ ! -f $(BACKEND_DIR)/.env ]; then \
		echo "$(YELLOW)  Fichier .env manquant — copie de .env.example$(RESET)"; \
		cp $(BACKEND_DIR)/.env.example $(BACKEND_DIR)/.env; \
		echo "$(YELLOW)  Editez $(BACKEND_DIR)/.env avec vos cles API$(RESET)"; \
	fi
	@echo "$(BLUE)  Demarrage de PostgreSQL + Redis + API...$(RESET)"
	$(DOCKER_COMPOSE) up --build -d
	@echo ""
	@$(MAKE) --no-print-directory _print-urls

_print-urls:
	@echo "$(GREEN)$(BOLD)  Services demarres !$(RESET)"
	@echo ""
	@echo "$(CYAN)  API NestJS   : http://localhost:3000/api/v1$(RESET)"
	@echo "$(CYAN)  Health check : http://localhost:3000/api/v1/health$(RESET)"
	@echo "$(CYAN)  PostgreSQL   : localhost:5432$(RESET)"
	@echo "$(CYAN)  Redis        : localhost:6379$(RESET)"
	@echo ""
	@echo "$(YELLOW)  Logs en temps reel: make logs$(RESET)"
	@echo "$(YELLOW)  Lance Flutter     : make flutter$(RESET)"
	@echo ""

db: env-check
	@echo "$(BLUE)  Demarrage de PostgreSQL + Redis...$(RESET)"
	$(DOCKER_COMPOSE) up -d manda-db manda-redis
	@echo "$(GREEN)  Base de donnees demarree$(RESET)"
	@echo "$(CYAN)    PostgreSQL : localhost:5432 (manda_user / manda_pass / manda_go)$(RESET)"
	@echo "$(CYAN)    Redis      : localhost:6379$(RESET)"

# ─── Flutter ──────────────────────────────────────────────────
flutter: flutter-check
	@echo "$(BLUE)  Demarrage de l'app Flutter...$(RESET)"
	@cd $(FLUTTER_DIR) && $(FLUTTER_BIN) pub get
	@echo "$(GREEN)  Dependances Flutter installees$(RESET)"
	@echo "$(YELLOW)  Choisissez un appareil dans la liste ci-dessous:$(RESET)"
	@cd $(FLUTTER_DIR) && $(FLUTTER_BIN) run

flutter-web: flutter-check
	@echo "$(BLUE)  Demarrage de Flutter Web...$(RESET)"
	@cd $(FLUTTER_DIR) && $(FLUTTER_BIN) run -d chrome

# ─── Base de données ──────────────────────────────────────────
migrate: env-check
	@echo "$(BLUE)  Lancement des migrations SQL...$(RESET)"
	$(DOCKER_COMPOSE) exec manda-api node -e "require('./dist/database/migrate').migrate()" || \
		echo "$(YELLOW)  Note: Les migrations sont auto-appliquees au demarrage via les scripts SQL$(RESET)"
	@echo "$(GREEN)  Migrations terminees$(RESET)"

seed: env-check
	@echo "$(BLUE)  Insertion des donnees de test...$(RESET)"
	$(DOCKER_COMPOSE) exec manda-db psql -U manda_user -d manda_go \
		-f /docker-entrypoint-initdb.d/002_seed_data.sql
	@echo "$(GREEN)  Donnees de test inserees$(RESET)"

# ─── Logs ─────────────────────────────────────────────────────
logs: env-check
	@echo "$(CYAN)  Logs de l'API (Ctrl+C pour quitter)...$(RESET)"
	$(DOCKER_COMPOSE) logs -f manda-api

logs-all: env-check
	@echo "$(CYAN)  Logs de tous les services (Ctrl+C pour quitter)...$(RESET)"
	$(DOCKER_COMPOSE) logs -f

# ─── Statut ───────────────────────────────────────────────────
status: env-check
	@echo ""
	@echo "$(BOLD)$(CYAN)  Statut des services Manda Go$(RESET)"
	@echo "$(CYAN)──────────────────────────────────────────────$(RESET)"
	$(DOCKER_COMPOSE) ps
	@echo ""
	@echo "$(BOLD)Ports exposes:$(RESET)"
	@echo "  $(CYAN)API     : http://localhost:3000/api/v1$(RESET)"
	@echo "  $(CYAN)Adminer : http://localhost:8080  (si tools-up actif)$(RESET)"
	@echo "  $(CYAN)Redis UI: http://localhost:8081  (si tools-up actif)$(RESET)"
	@echo ""

# ─── Tests ────────────────────────────────────────────────────
test: api-test flutter-test
	@echo ""
	@echo "$(GREEN)$(BOLD)  Tous les tests passes !$(RESET)"

api-test: node-check
	@echo "$(BLUE)  Tests backend NestJS...$(RESET)"
	@cd $(BACKEND_DIR) && npm run test
	@echo "$(GREEN)  Tests API OK$(RESET)"

api-test-cov: node-check
	@echo "$(BLUE)  Tests backend avec couverture...$(RESET)"
	@cd $(BACKEND_DIR) && npm run test:cov

flutter-test: flutter-check
	@echo "$(BLUE)  Tests Flutter...$(RESET)"
	@cd $(FLUTTER_DIR) && $(FLUTTER_BIN) test
	@echo "$(GREEN)  Tests Flutter OK$(RESET)"

flutter-analyze: flutter-check
	@echo "$(BLUE)  Analyse statique Flutter...$(RESET)"
	@cd $(FLUTTER_DIR) && $(FLUTTER_BIN) analyze
	@echo "$(GREEN)  Analyse Flutter OK$(RESET)"

flutter-format: flutter-check
	@echo "$(BLUE)  Formatage du code Flutter...$(RESET)"
	@cd $(FLUTTER_DIR) && $(FLUTTER_BIN) format lib/
	@echo "$(GREEN)  Code formate$(RESET)"

# ─── Build production ─────────────────────────────────────────
build: env-check flutter-check
	@echo ""
	@echo "$(BOLD)$(PURPLE)  Build production Manda Go...$(RESET)"
	@echo "$(CYAN)──────────────────────────────────────────────$(RESET)"
	@echo "$(BLUE)  Build API Docker...$(RESET)"
	$(DOCKER_COMPOSE) build manda-api
	@echo "$(BLUE)  Build Flutter APK (release)...$(RESET)"
	@cd $(FLUTTER_DIR) && $(FLUTTER_BIN) build apk --release
	@if [ "$$(uname)" = "Darwin" ]; then \
		echo "$(BLUE)  Build Flutter iOS...$(RESET)"; \
		cd $(FLUTTER_DIR) && $(FLUTTER_BIN) build ios --release --no-codesign; \
	else \
		echo "$(YELLOW)  Build iOS ignore (macOS requis)$(RESET)"; \
	fi
	@echo ""
	@echo "$(GREEN)$(BOLD)  Build termine !$(RESET)"
	@echo "$(CYAN)    APK : $(FLUTTER_DIR)/build/app/outputs/flutter-apk/app-release.apk$(RESET)"

# ─── Outils de développement ──────────────────────────────────
tools-up: env-check
	@echo "$(BLUE)  Demarrage des outils dev (Adminer + Redis Commander)...$(RESET)"
	$(DOCKER_COMPOSE) --profile dev-tools up -d manda-adminer manda-redis-commander
	@echo "$(GREEN)  Outils demarres$(RESET)"
	@echo "$(CYAN)    Adminer        : http://localhost:8080$(RESET)"
	@echo "$(CYAN)    Redis Commander: http://localhost:8081$(RESET)"

tools-down: env-check
	@echo "$(BLUE)  Arret des outils dev...$(RESET)"
	$(DOCKER_COMPOSE) stop manda-adminer manda-redis-commander 2>/dev/null || true
	@echo "$(GREEN)  Outils arretes$(RESET)"

# ─── Arrêt et nettoyage ───────────────────────────────────────
stop: env-check
	@echo "$(YELLOW)  Arret de tous les services...$(RESET)"
	$(DOCKER_COMPOSE) down
	@echo "$(GREEN)  Services arretes$(RESET)"

clean: env-check
	@echo "$(RED)  ATTENTION: Cette commande supprime TOUTES les donnees Docker !$(RESET)"
	@read -p "Etes-vous sur ? (tapez 'oui' pour confirmer) " confirm; \
	if [ "$$confirm" = "oui" ]; then \
		echo "$(YELLOW)  Suppression des volumes...$(RESET)"; \
		$(DOCKER_COMPOSE) down -v --remove-orphans; \
		docker system prune -f; \
		echo "$(GREEN)  Nettoyage termine$(RESET)"; \
	else \
		echo "$(CYAN)  Annule.$(RESET)"; \
	fi

# ─── Raccourcis ───────────────────────────────────────────────
restart: stop dev

shell-api: env-check
	$(DOCKER_COMPOSE) exec manda-api sh

shell-db: env-check
	$(DOCKER_COMPOSE) exec manda-db psql -U manda_user -d manda_go

install-backend: node-check
	@echo "$(BLUE)  Installation des dependances backend...$(RESET)"
	@cd $(BACKEND_DIR) && npm install
	@echo "$(GREEN)  Dependances backend installees$(RESET)"

install-flutter: flutter-check
	@echo "$(BLUE)  Installation des dependances Flutter...$(RESET)"
	@cd $(FLUTTER_DIR) && $(FLUTTER_BIN) pub get
	@echo "$(GREEN)  Dependances Flutter installees$(RESET)"

install: install-backend install-flutter
	@echo "$(GREEN)$(BOLD)  Toutes les dependances installees$(RESET)"
