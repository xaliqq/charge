/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
import { selectOption } from '@/models/common';
import axios, {
  AxiosError,
  AxiosResponse,
  CancelTokenSource,
  InternalAxiosRequestConfig
} from 'axios';
import { ErrorHandler } from './error-handler';
import { HttpError } from './http_error';

// Create a new instance of Axios with default configuration
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

// Define a request interceptor to add the authorization token to headers if available
axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = JSON.parse(localStorage.getItem('userToken') || '{}');
  // Replace with your token retrieval logic
  if (token) {
    config.headers.Authorization = `Bearer ${token?.token}`;
  }
  return config;
});

const axiosErrorHandler = (error: unknown) => {
  if (error instanceof AxiosError) {
    console.log(error.response?.data);
    if (error?.response?.data?.messages?.length) {
      return error.response.data.messages;
    }
    return 'Xəta baş verdi';
  }
  return 'Xəta baş verdi';
};

// Define a response interceptor to handle cancellation tokens and error responses
axios.interceptors.response.use(
  (response: AxiosResponse) => response,
  async error => {
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message);
    } else {
      const { response } = error;
      if (response) {
        const { status } = response;
        switch (status) {
          case 401:
            localStorage.removeItem('userToken');
            window.location.href = `/login`;
            break;
          case 403:
            window.location.href = '/no-permission';
            break;
          default:
            // ErrorHandler.getInstance().showError(axiosErrorHandler(error))
            break;
        }
      } else {
        console.error('Network error:', error.message);
      }
    }

    return Promise.reject(error);
    // return Promise.reject(error);
  }
);

export function cancelRequest(cancelTokenSource: CancelTokenSource) {
  cancelTokenSource.cancel('Request canceled by user');
}

const responseBody = (response: any) => response.data;

export interface IHTTPSParams {
  name: string;
  value: string | number | null | selectOption;
}

const buildQueryParams = (par: any) => {
  if (!par) return null;
  const payload: any = {};

  par.forEach((element: any) => {
    if (
      !element.value ||
      element.value === undefined ||
      element.value?.toString()?.trim().length <= 0
    ) {
      return;
    }

    payload[element.name] = element.value?.value
      ? element.value?.value.toString()
      : element.value.toString();
  });
  return payload;
};

// New HTTP API

export type ErrorCallBack = (e: HttpError) => void;

export class HttpUtil {
  static async get(
    url: string,
    params: IHTTPSParams[] | null | number,
    isStream?: boolean | undefined,
    onError?: ErrorCallBack
  ): Promise<any | null> {
    try {
      const result = await axios
        .get(url, {
          params: buildQueryParams(params),
          responseType: isStream ? 'blob' : 'json'
        })
        .then(responseBody);
      return result;
    } catch (e: any) {
      const error = new HttpError(e.response.status, axiosErrorHandler(e));
      if (onError) onError!(error);
      if (error.preventDefault) {
        return null;
      }
      ErrorHandler.getInstance().showError(error.message);
    }
    return null;
  }

  static async post(url: string, body: any, onError?: ErrorCallBack) {
    try {
      const result = await axios.post(url, body).then(responseBody);
      return result;
    } catch (e: any) {
      const error = new HttpError(e.response.status, axiosErrorHandler(e));
      if (onError) onError!(error);
      if (error.preventDefault) {
        return null;
      }
      ErrorHandler.getInstance().showError(error.message);
    }

    return null;
  }

  static async put(url: string, body: any, onError?: ErrorCallBack) {
    try {
      const result = await axios.put(url, body).then(responseBody);
      return result;
    } catch (e: any) {
      const error = new HttpError(e.response.status, axiosErrorHandler(e));
      if (onError) onError!(error);
      if (error.preventDefault) {
        return null;
      }
      ErrorHandler.getInstance().showError(error.message);
    }

    return null;
  }

  static async delete(url: string, body: any, onError?: ErrorCallBack) {
    try {
      const result = await axios.delete(url, body).then(responseBody);
      return result;
    } catch (e: any) {
      const error = new HttpError(e.response.status, axiosErrorHandler(e));
      if (onError) onError!(error);
      if (error.preventDefault) {
        return null;
      }
      ErrorHandler.getInstance().showError(error.message);
    }

    return null;
  }
}
