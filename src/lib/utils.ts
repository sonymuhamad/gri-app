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

export function isValidDate(dateString: string) {
  const dateRegex = /^(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/;
  return dateRegex.test(dateString);
}

export const toDataURL = (url: string) => {
  const promise = new Promise<{ base64Url: ArrayBuffer | string | null }>(
    (resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onload = function () {
        var reader = new FileReader();
        reader.readAsDataURL(xhr.response);
        reader.onloadend = function () {
          resolve({ base64Url: reader.result });
        };
      };
      xhr.open("GET", url);
      xhr.responseType = "blob";
      xhr.send();
    }
  );

  return promise;
};

export function generateRandomNumber(): number {
  // Get current date and time
  const currentTime: Date = new Date();
  const day: number = currentTime.getDate(); // Day of the month (1-31)
  const hour: number = currentTime.getHours(); // Hour of the day (0-23)

  // Use day and hour to set seed for random number generator
  const seed: number = day * 24 + hour;
  const random: number = Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10

  // Generate and return random number
  return random;
}
