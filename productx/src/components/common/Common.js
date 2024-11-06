import {useEffect, useState} from "react";

const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
};

export { formatDate }


function formatTimeDifference(createTime) {
  const [timeDifference, setTimeDifference] = useState("");

  useEffect(() => {
    const updateDifference = () => {
      const now = new Date();
      const created = new Date(createTime);
      const diffInSeconds = Math.floor((now - created) / 1000);
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
    updateDifference(); // 初始化调用

    return () => clearInterval(interval); // 清除定时器
  }, [createTime]);

  return timeDifference;
}
export { formatTimeDifference }
