export function dateFormatter (dateObj) {
  let mm = dateObj.getMonth() + 1
  let dd = dateObj.getDate()

  return [dateObj.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd
  ].join('-')
}

export function timeFormatter (dateStr) {
  const dateObj = new Date(dateStr)

  let hours = dateObj.getHours()
  let minutes = dateObj.getMinutes()

  return [
    (hours > 9 ? '' : '0') + hours,
    (minutes > 9 ? '' : '0') + minutes
  ].join(':')
}
