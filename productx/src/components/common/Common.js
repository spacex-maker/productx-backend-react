import {useEffect, useState} from "react";
import { formatDate as formatDateTz, parseBackendUtc, getAdminTimezone } from "src/utils/dateUtils";
import dayjs from "dayjs";

/** UTC wall clock -> admin browser timezone */
const formatDate = (date, format = "YYYY-MM-DD HH:mm:ss") => formatDateTz(date, format);

export { formatDate }


function formatTimeDifference(createTime) {
  const [timeDifference, setTimeDifference] = useState("");

  useEffect(() => {
    const updateDifference = () => {
      const parsed = parseBackendUtc(createTime);
      if (!parsed || !parsed.isValid()) {
        setTimeDifference("");
        return;
      }
      const now = dayjs();
      const created = parsed.tz(getAdminTimezone());
      const diffInSeconds = Math.max(0, Math.floor(now.diff(created, "second")));
      const hours = Math.floor(diffInSeconds / 3600);
      const minutes = Math.floor((diffInSeconds % 3600) / 60);
      const seconds = diffInSeconds % 60;

      if (hours > 0) {
        setTimeDifference(`${hours}h ${minutes}m ${seconds}s`);
      } else if (minutes > 0) {
        setTimeDifference(`${minutes}m ${seconds}s`);
      } else {
        setTimeDifference(`${seconds}s`);
      }
    };

    const interval = setInterval(updateDifference, 1000);
    updateDifference();

    return () => clearInterval(interval);
  }, [createTime]);

  return timeDifference;
}
export { formatTimeDifference }