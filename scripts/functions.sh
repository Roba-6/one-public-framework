# ===== Define Functions ===============================================================

# ----- Constants ----------------------------------------------------------------------
SCREEN_WIDTH=88
FIRST_CHAR_NUM=7

# ----- Functions ----------------------------------------------------------------------
# Get color code.
#
# $1 - color name
# $2 - is background color
# Return - color code
function get_color_code {
  COLOR_CODE=(
    "black" "red" "green" "yellow" "blue"
    "magenta" "cyan" "white" "ext" "def"
  )

  for i in "${!COLOR_CODE[@]}"; do
    if [[ "${COLOR_CODE[$i]}" = "$1" ]]; then
      code="${i}"
   fi
  done

  if [ -z "$code" ]; then
    code="9"
  fi

  if [[ $2 -eq 1 ]]; then
    code="4${code}"
  else
    code="3${code}"
  fi

  echo "$code"
}

# Output text with style.
#
# $1 - text to output
# $2 - foreground color name
# $3 - background color name
# $4 - is bold
function print_with_style {
  fg_color=$(get_color_code "$2")
  bg_color=$(get_color_code "$3" 1)

  if [[ $4 -eq 1 ]]; then
    style="1"
  else
    style="0"
  fi

  printf "\033[%s;%s;%sm%b\033[m" "$style" "$fg_color" "$bg_color" "$1"
}

# Output text with style and new line.
#
# wrapping the function `print_with_style`, and returns length of text.
# $1 - text to output
# $2 - foreground color name
# $3 - background color name
# $4 - is bold
# Return - length of text
function printf_with_style {
  print_with_style "$1" "$2" "$3" "$4"
  printf "\n"
  return ${#1}
}

# Output text with style, and returns length of text.
#
# $1 - text to output
# $2 - foreground color name
# $3 - background color name
# $4 - is bold
# Return - length of text
function print_count {
  print_with_style "$1" "$2" "$3" "$4"
  return ${#1}
}

# Output message level labels.
#
# $1 - message level
function printl {
  case $1 in
    "FAT" )
      print_with_style "[FATAL]" "red" "magenta" 1
      ;;
    "ERR" )
      print_with_style "[ERROR]" "yellow" "red" 1
      ;;
    "WARN" )
      print_with_style "[ WARN]" "black" "yellow" 1
      ;;
    * )
      print_with_style "[ INFO]" "blue" "white" 1
      ;;
  esac
  printf " "
}

# Get length of text
#
# $1 - text
# Return - length of text
function count_str {
  echo ${#1}
}

# Get a fixed-width text.
#
# $1 - text
# $2 - width of text
function get_fix_width_str {
  printf -- "${1}%0.s" $(seq 0 $(($2 - 1)))
}

# Output the title of the processing.
#
# $1 - process name
function printp {
  SECTION_HR_CODE="="
  title=" $1 "
  title_count=$(count_str "$title")
  end_char_num=$((SCREEN_WIDTH - FIRST_CHAR_NUM - title_count))
  section_start=$(get_fix_width_str "$SECTION_HR_CODE" "$FIRST_CHAR_NUM")
  section_end=$(get_fix_width_str "$SECTION_HR_CODE" $end_char_num)
  printf_with_style "$section_start$title$section_end" "blue"
}

# Output processing result.
#
# $1 - process name
# $2 - result of processing
# Return - result of processing
function print_result {
  DOING_CODE="."
  RST_LIST=("Success" "Failed!")
  step_count=$(count_str "$1 ")

  if [ "$2" -eq 0 ]; then
    result_msg=${RST_LIST[0]}
    rst_format=$(print_with_style "$result_msg" "green")
  else
    result_msg=${RST_LIST[1]}
    rst_format=$(print_with_style "$result_msg" "red")
  fi

  rst_num=$(count_str "$result_msg")
  doing_char_num=$((SCREEN_WIDTH - FIRST_CHAR_NUM - rst_num - step_count - 2))
  doing=$(get_fix_width_str "$DOING_CODE" $doing_char_num)
  printf_with_style " $doing $rst_format" "white"

  return "$2"
}

# Checking version of Python.
function check_python_version {
  # get version of Python
  PYTHON_VERSION=$(python --version 2>&1 | awk '{print $2}')
  # get major version and minor version
  MAJOR_VERSION=$(echo "$PYTHON_VERSION" | cut -d. -f1)
  MINOR_VERSION=$(echo "$PYTHON_VERSION" | cut -d. -f2)

  # check version
  if [[ $MAJOR_VERSION -eq 3 && $MINOR_VERSION -ge 11 ]]; then
    version=$(print_with_style "$PYTHON_VERSION" "cyan")
    printl "INFO"
    printf_with_style "Your Python version is $version."
  else
    version=$(print_with_style "$PYTHON_VERSION" "magenta")
    proper_version=$(print_with_style "3.11" "yellow")
    printl "FAT"
    print_with_style "Your Python version is $version. "
    printf_with_style "Please use version $proper_version or higher."
    exit 1
  fi
}

# Output details.
#
# $1 - text of details
function print_details {
  str="${1//$'\n'/$'\n\t'}"
  str="${str//\\n/\n\t}"
  printf_with_style "\t$str" "white"
}

# Execute the specified process.
#
# $1 - process name
# $2 - process content
# $3 - output destination for detailed information
# $4 - details with filtering
# Return - result of processing
function run_process {
  printl "INFO"
  print_count "$1"
  detail_str=$(eval "$2")
  result=$?
  print_result "$1" $result
  if [ "$detail_str" != "" ]; then
    if [ "$4" != "" ]; then
      refine_str=$(echo "$detail_str" | grep "|")
      print_details "$refine_str"
    else
      print_details  "$detail_str"
    fi
    if [ "$3" != "" ]; then
      echo "$detail_str" >> "$3"
    fi
  fi

  return "$result"
}
