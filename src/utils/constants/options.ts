/* eslint-disable radix */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-restricted-globals */
import { selectOption } from '@/models/common';
import { Language } from '@/models/enum';

function LANG_ENUM_OPTIONS() {
  const languageOptions = [];

  for (const key in Language) {
    if (isNaN(parseInt(key))) {
      languageOptions.push({
        label: key,
        value: Language[key].toString()
      });
    }
  }

  return languageOptions;
}

const languageOptions: selectOption[] = LANG_ENUM_OPTIONS();
const statusOptions: selectOption[] = [
  {
    value: '1',
    label: 'Aktiv'
  },
  {
    value: '2',
    label: 'Deaktiv'
  }
];

const chargePointStatusOptions: selectOption[] = [
  {
    value: '1',
    label: 'Available'
  },
  {
    value: '2',
    label: 'Occupied'
  },
  {
    value: '3',
    label: 'OutOfService'
  },
  {
    value: '4',
    label: 'Alarm'
  }
];

const isBlockedOptions: selectOption[] = [
  {
    value: '1',
    label: 'Bloklanmış'
  },
  {
    value: '2',
    label: 'Bloklanmamış'
  }
];

const roleOptions: selectOption[] = [
  {
    value: '1',
    label: 'Admin'
  },
  {
    value: '2',
    label: 'Moderator'
  }
];

const genderOptions: selectOption[] = [
  {
    value: '1',
    label: 'Kişi'
  },
  {
    value: '2',
    label: 'Qadın'
  }
];

export {
  languageOptions,
  genderOptions,
  roleOptions,
  isBlockedOptions,
  chargePointStatusOptions,
  statusOptions
};
