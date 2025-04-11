import moment from "moment-timezone"

export const toJakartaTime = (date: Date | string | null) => {
  return date ? moment(date).tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss") : "_"
}
