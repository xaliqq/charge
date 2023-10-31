/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import { Dispatch, SetStateAction } from 'react';

interface IGlobalResponse {
  message: string;
  succeeded: boolean;
}

type modalClose = {
  onClose?: () => void;
  onOpen?: () => void;
  setRefreshComponent?: Dispatch<SetStateAction<boolean>>;
};

type selectOption = {
  readonly value: string;
  readonly label: string;
};

export type { modalClose, selectOption, IGlobalResponse };
