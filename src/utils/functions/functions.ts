/* eslint-disable no-prototype-builtins */
import { selectOption } from '@/models/common';
import { IHTTPSParams } from '@/services/config';

/* eslint-disable no-restricted-syntax */
function convertFormDataToQueryParams<T>(formData: T): IHTTPSParams[] {
  const z: IHTTPSParams[] = [];
  for (const key in formData) {
    if (formData?.hasOwnProperty(key)) {
      z.push({
        name: key,
        value: formData[key] as string | number | null | selectOption
      });
    }
  }
  return z;
}

export { convertFormDataToQueryParams };
