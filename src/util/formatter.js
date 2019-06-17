import moment from 'moment'

export function dateFormatter (dateObj) {
  return moment(dateObj).format('YYYY-MM-DD')
}

export function timeFormatter (dateStr) {
  return moment(dateStr).format('hh:mm')
}
