#!/bin/bash
# ===== Management Script ==============================================================

# Process
PROCESS=("init" "update" "build" "start" "test")
# Options
OPTIONS=("--dev" "--prod" "--back" "--front")
# Current date time
DATETIME="$(date '+%Y%m%d%H%M%S')"
# Path of Management Script
SCRIPT_PATH=$(realpath -- "$0")
# Path of Project
PROJECT_DIR=$(dirname "$SCRIPT_PATH")
# Absolute path of log folder
LOG_DIR="$PROJECT_DIR/logs"
# Absolute path of log file
LOG_FILE="$PROJECT_DIR/logs/$1_$DATETIME.log"

# Check execution mode
IS_BACK=$(echo "$@" | grep "${OPTIONS[2]:2}")
IS_FRONT=$(echo "$@" | grep "${OPTIONS[3]:2}")
IS_NOT_ALL="${IS_BACK}${IS_FRONT}"
IS_PROD=$(echo "$@" | grep "${OPTIONS[1]:2}")

source "$PROJECT_DIR/scripts/functions.sh"

if [ -e "$PROJECT_DIR/.env" ]; then
  source "$PROJECT_DIR/.env"
elif [ -e "$PROJECT_DIR/.env.test" ]; then
  source "$PROJECT_DIR/.env.test"
else
  printl "FAT"
  printf_with_style "Cannot find environment file!" "magenta" "def" 1
  exit 0
fi

mkdir -p "$LOG_DIR"

# validate options
if [ "$IS_PROD" = "" ]; then
  # Development Mode
  mode=$(print_with_style "Development" "cyan")
else
  # Production Mode
  mode=$(print_with_style "Production" "cyan")
fi

case $1 in
  # Initialization Process
  "${PROCESS[0]}" )
    printp "Initializing Application"

    printl "INFO"

    if [ "$IS_BACK" != "" ] && [ "$IS_FRONT" = "" ]; then
      side=$(print_with_style " Backend" "cyan")
    elif [ "$IS_BACK" = "" ] && [ "$IS_FRONT" != "" ]; then
      side=$(print_with_style " Frontend" "cyan")
    else
      :
    fi

    printf_with_style "Initializing$side Application in $mode Mode."

    # Initialize backend
    if [ "$IS_BACK" != "" ] || [ "$IS_NOT_ALL" = "" ]; then
      cd "$PROJECT_DIR/backend" || exit

      # Installing dependencies
      if [ -f pyproject.toml ]; then
        process="
          poetry env activate >/dev/null 2>&1"
        run_process "Creating Virtualenv of backend" "$process" "$LOG_FILE"

        if [ "$IS_PROD" = "" ]; then
          # Development Mode
          process="
            eval $(poetry env activate);
            poetry install --no-root >> $LOG_FILE"
        else
          # Production Mode
          process="
            eval $(poetry env activate);
            poetry install >> $LOG_FILE"
        fi
        run_process "Installing all dependencies of backend" "$process"
      else
        printl "FAT"
        file=$(print_with_style "pyproject.toml" "magenta")
        printf_with_style "Cannot find file $file."
        exit 1
      fi

      eval "$(poetry env activate)"
      check_python_version

      cd "$PROJECT_DIR" || exit
      process="pre-commit install >> $LOG_FILE"
      run_process "Installing pre-commit hooks" "$process"

      cd "$PROJECT_DIR/backend" || exit
      process="pybabel compile -d locales >/dev/null 2>&1"
      run_process "Compiling locale messages of backend" "$process" "$LOG_FILE"

      process="alembic upgrade head >/dev/null 2>&1"
      run_process "Creating database" "$process" "$LOG_FILE"
    fi

    # Initialize frontend
    if [ "$IS_FRONT" != "" ] || [ "$IS_NOT_ALL" = "" ]; then
      cd "$PROJECT_DIR/frontend" || exit
      # install dependencies for frontend
      process="yarn >/dev/null 2>&1 >> $LOG_FILE"
      run_process "Installing all dependencies of frontend" "$process"
    fi

    exit 0
    ;;

  # Update Process
  "${PROCESS[1]}" )
    printp "Updating Application"

    # Update for backend
    if [ "$IS_BACK" != "" ] || [ "$IS_NOT_ALL" = "" ]; then
      cd "$PROJECT_DIR/backend" || exit

      process="pybabel extract -F babel.cfg -o locales/messages.pot . >/dev/null 2>&1"
      run_process "Updating translation template of backend" "$process"
      process="pybabel update -i locales/messages.pot -d locales >/dev/null 2>&1"
      run_process "Updating translation files of backend" "$process"

    fi

    exit 0
    ;;

  # Build Process
  "${PROCESS[2]}" )
    printp "Building Application"

    # Build backend
    if [ "$IS_BACK" != "" ] || [ "$IS_NOT_ALL" = "" ]; then
      cd "$PROJECT_DIR/backend" || exit

      process="pybabel compile -d locales >/dev/null 2>&1"
      run_process "Compiling locale messages of backend" "$process" "$LOG_FILE"

      process="poetry build >> $LOG_FILE"
      run_process "Building the backend as a package" "$process"
    fi

    # Build frontend
    if [ "$IS_FRONT" != "" ] || [ "$IS_NOT_ALL" = "" ]; then
      cd "$PROJECT_DIR/frontend" || exit

      process="yarn build >/dev/null 2>&1 >> $LOG_FILE"
      run_process "Building the frontend as a package" "$process"
    fi

    exit 0
    ;;

  "${PROCESS[3]}" )
    printp "Start Application"

    # Start backend
    if [ "$IS_BACK" != "" ] || [ "$IS_NOT_ALL" = "" ]; then
      cd "$PROJECT_DIR/backend" || exit

      if [ "$IS_PROD" = "" ]; then
        # Development Mode
        process="poetry run uvicorn one_public_api:app --reload"
      else
        # Production Mode
        process="poetry run uvicorn one_public_api:app --host 0.0.0.0"
      fi
      run_process "Start the One Public API server in $mode mode\n" "$process"
    fi

    # Start frontend
    if [ "$IS_FRONT" != "" ] || [ "$IS_NOT_ALL" = "" ]; then
      cd "$PROJECT_DIR/frontend" || exit

      if [ "$IS_PROD" = "" ]; then
        # Development Mode
        yarn dev
      else
        # Production Mode
        yarn start
      fi
    fi

    exit 0
    ;;

  # Not specify process
  * )
    printl "FAT"
    printf_with_style "Missing necessary command line arguments." "magenta" "def" 1
    exit 1
    ;;
esac
