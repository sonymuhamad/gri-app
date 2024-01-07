export function generateRandomString(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export function createUrlWithQueryParams(
  path: string,
  queryParams: { [key: string]: string | string[] | number | null | undefined }
): string {
  const urlParams = new URLSearchParams();

  Object.entries(queryParams).map(([k, v]) => {
    if (v) {
      urlParams.append(k, v.toString());
    }
  });

  const queryString = urlParams.toString();

  return queryString ? `${path}?${queryString}` : path;
}

export function getTodayAndTomorrow() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date();
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return [today, tomorrow];
}
