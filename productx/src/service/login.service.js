import { to } from 'src/utils/awaitTo';
import axios from 'axios';

export const healthCheckService = async (url) => {
  return await to(
    axios.get(`${url}/manage/base/system/health`, {
      timeout: 5000,
      validateStatus: function (status) {
        return status >= 200 && status < 500;
      },
    }),
  );
};
