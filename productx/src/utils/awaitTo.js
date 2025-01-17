// @ts-nocheck
/**
 * @param { Promise } promise
 * @param { Object= } errorExt - Additional Information you can pass to the err object
 * @return { Promise<[Object | null, Object | undefined]> }
 */
export function to(promise, errorExt) {
  return promise
    .then((response) => [null, response.data?.data, response])
    .catch((err) => {
      if (errorExt) {
        const parsedError = Object.assign({}, err, errorExt);
        return [parsedError, undefined, undefined];
      }
      return [err, undefined, undefined];
    });
}
