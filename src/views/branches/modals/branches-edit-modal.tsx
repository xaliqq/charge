/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-restricted-globals */
/* eslint-disable radix */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-expressions */
import Uploader from '@/components/forms/uploader/uploader';
import { modalClose, selectOption } from '@/models/common';
import {
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Image,
  useToast,
  FormControl,
  FormLabel,
  Stack,
  Input,
  Tooltip
} from '@chakra-ui/react';
import { useState } from 'react';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import {
  closeBtn,
  inputPlaceholderText,
  inputValidationText,
  selectPlaceholderText
} from '@/utils/constants/texts';
import { AxiosError } from 'axios';
import { IBranchItem, IBranchItemPayload, ITerminalGroupItem } from '@/models/branches';
import { BranchesServies } from '@/services/branches-services/branches-services';
import { Select } from 'chakra-react-select';

interface IAboutEditModal extends modalClose {
  selectedItem: IBranchItem | null;
}

function BranchesEditModal({
  onClose,
  setRefreshComponent,
  selectedItem
}: IAboutEditModal) {
  const [photo, setPhoto] = useState<File | null>(null);
  const {
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting }
  } = useForm<IBranchItemPayload>({
    mode: 'onChange',
    defaultValues: {
      id: 0,
      externalId: selectedItem?.externalId,
      externalName: selectedItem?.externalName,
      externalCode: selectedItem?.externalCode,
      externalAddress: selectedItem?.externalAddress,
      longitude: selectedItem?.longitude,
      latitude: selectedItem?.latitude,
      internalNameAz: selectedItem?.internalNameAz,
      internalNameEn: selectedItem?.internalNameEn,
      internalNameRu: selectedItem?.internalNameRu,
      internalAddressAz: selectedItem?.internalAddressAz,
      internalAddressEn: selectedItem?.internalAddressEn,
      internalAddressRu: selectedItem?.internalAddressRu,
      phoneNumber: selectedItem?.phoneNumber,
      terminalGroup: selectedItem?.terminalGroups?.find((z: ITerminalGroupItem) => z?.isMain) ?? null,
      openingHour: selectedItem?.openingHour ? { value: selectedItem?.openingHour?.toString(), label: selectedItem?.openingHour?.toString() } : null,
      closingHour: selectedItem?.closingHour ? { value: selectedItem?.closingHour?.toString(), label: selectedItem?.closingHour?.toString() } : null,
    }
  });

  const toast = useToast();

  const onSubmit: SubmitHandler<IBranchItemPayload> = async (
    data: IBranchItemPayload
  ): Promise<void> => {
    const formData = new FormData();
    selectedItem?.id && formData.append('id', selectedItem.id.toString());
    photo && formData.append('photo', photo);

    if (data?.closingHour && typeof data?.closingHour === 'object' && 'value' in data?.closingHour) {
      formData.append('closingHour', data?.closingHour?.value.toString());
    }
    if (data?.openingHour && typeof data?.openingHour === 'object' && 'value' in data?.openingHour) {
      formData.append('openingHour', data?.openingHour.value.toString());
    }

    formData.append('externalAddress', data?.externalAddress.toString());
    formData.append('externalCode', data?.externalCode.toString())
    formData.append('terminalGroup', data?.terminalGroup?.value ? data?.terminalGroup?.value : '');
    formData.append('externalId', data?.externalId.toString());
    formData.append('externalName', data?.externalName.toString());
    data?.internalAddressAz &&
      formData.append('internalAddressAz', data?.internalAddressAz.toString());
    data?.internalAddressEn &&
      formData.append('internalAddressEn', data?.internalAddressEn.toString());
    data?.internalAddressRu &&
      formData.append('internalAddressRu', data?.internalAddressRu.toString());
    data?.internalNameAz &&
      formData.append('internalNameAz', data?.internalNameAz.toString());
    data?.internalNameEn &&
      formData.append('internalNameEn', data?.internalNameEn.toString());
    data?.internalNameRu &&
      formData.append('internalNameRu', data?.internalNameRu.toString());
    formData.append('latitude', data?.latitude.toString());
    formData.append('longitude', data?.longitude.toString());
    data?.phoneNumber &&
      formData.append('phoneNumber', data?.phoneNumber.toString());

    try {
      await BranchesServies.getInstance().updateBranche(formData);
      toast({
        title: 'Əməliyyat uğurla icra olundu',
        description: 'İnqridient məlumatları uğurla yeniləndi',
        status: 'success',
        position: 'top-right',
        duration: 3000,
        isClosable: true
      });
      onClose && onClose();
      setRefreshComponent && setRefreshComponent((prev: boolean) => !prev);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
        if (error?.response?.data?.messages?.length) {
          error.response.data.messages?.map((z: string) =>
            toast({
              title: 'Xəta baş verdi',
              description: z,
              status: 'error',
              position: 'top-right',
              duration: 3000,
              isClosable: true
            })
          );
        } else {
          toast({
            title: 'Xəta baş verdi',
            description:
              'İnqridient məlumatlarının yenilənməsi zamanı xəta baş verdi',
            status: 'error',
            position: 'top-right',
            duration: 3000,
            isClosable: true
          });
        }
      }
    }
  };

  const hoursArray: selectOption[] = [];

  // eslint-disable-next-line no-plusplus
  for (let hour = 0; hour <= 23; hour++) {
    const hourString: string = hour.toString().padStart(2, '0');
    const timeLabel: string = `${hourString}:00`;

    hoursArray.push({ value: timeLabel, label: timeLabel });
  }

  return (
    <ModalContent>
      <ModalHeader>MƏLUMATA DÜZƏLİŞ EDİLMƏSİ</ModalHeader>

      <ModalCloseButton />
      <ModalBody>
        <Box>
          <form
            noValidate
            id="web-About-edit-modal-submit-btn"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Stack spacing={4}>
              <Controller
                control={control}
                name="externalAddress"
                rules={{
                  required: {
                    value: false,
                    message: inputValidationText('Ünvan (Sistem)')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errors.externalAddress)}
                    isDisabled
                    id="externalAddress"
                  >
                    <FormLabel>Ünvan (Sistem)</FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={
                        errors.externalAddress
                          ? errors.externalAddress.message
                          : ''
                      }
                    >
                      <Input
                        onChange={onChange}
                        value={value}
                        type="text"
                        placeholder={inputPlaceholderText('Ünvan (Sistem)')}
                      />
                    </Tooltip>
                  </FormControl>
                )}
              />{' '}
              <Controller
                control={control}
                name="externalCode"
                rules={{
                  required: {
                    value: false,
                    message: inputValidationText('Kod (Sistem)')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errors.externalCode)}
                    isDisabled
                    id="externalCode"
                  >
                    <FormLabel>Kod (Sistem)</FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={
                        errors.externalCode ? errors.externalCode.message : ''
                      }
                    >
                      <Input
                        onChange={onChange}
                        value={value}
                        type="text"
                        placeholder={inputPlaceholderText('Kod (Sistem)')}
                      />
                    </Tooltip>
                  </FormControl>
                )}
              />{' '}
              <Controller
                control={control}
                name="externalId"
                rules={{
                  required: {
                    value: false,
                    message: inputValidationText('İD (sistem)')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errors.externalId)}
                    isDisabled
                    id="externalId"
                  >
                    <FormLabel>İD (sistem)</FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={errors.externalId ? errors.externalId.message : ''}
                    >
                      <Input
                        onChange={onChange}
                        value={value}
                        type="text"
                        placeholder={inputPlaceholderText('İD (sistem)')}
                      />
                    </Tooltip>
                  </FormControl>
                )}
              />{' '}
              <Controller
                control={control}
                name="externalName"
                rules={{
                  required: {
                    value: false,
                    message: inputValidationText('Ad (Sistem)')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errors.externalName)}
                    isDisabled
                    id="externalName"
                  >
                    <FormLabel>Ad (Sistem)</FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={
                        errors.externalName ? errors.externalName.message : ''
                      }
                    >
                      <Input
                        onChange={onChange}
                        value={value}
                        type="text"
                        placeholder={inputPlaceholderText('Ad (Sistem)')}
                      />
                    </Tooltip>
                  </FormControl>
                )}
              />{' '}
              <Controller
                control={control}
                name="latitude"
                rules={{
                  required: {
                    value: false,
                    message: inputValidationText('Meridian')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errors.latitude)}
                    isDisabled
                    id="latitude"
                  >
                    <FormLabel>Meridian</FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={errors.latitude ? errors.latitude.message : ''}
                    >
                      <Input
                        onChange={onChange}
                        value={value}
                        type="text"
                        placeholder={inputPlaceholderText('Meridian')}
                      />
                    </Tooltip>
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="longitude"
                rules={{
                  required: {
                    value: false,
                    message: inputValidationText('Paralel')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errors.longitude)}
                    isDisabled
                    id="longitude"
                  >
                    <FormLabel>Paralel</FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={errors.longitude ? errors.longitude.message : ''}
                    >
                      <Input
                        onChange={onChange}
                        value={value}
                        type="text"
                        placeholder={inputPlaceholderText('Paralel')}
                      />
                    </Tooltip>
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="internalAddressAz"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Ünvan (AZ)')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errors.internalAddressAz)}
                    isRequired
                    id="internalAddressAz"
                  >
                    <FormLabel>Ünvan (AZ)</FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={
                        errors.internalAddressAz
                          ? errors.internalAddressAz.message
                          : ''
                      }
                    >
                      <Input
                        onChange={onChange}
                        value={value ?? ''}
                        type="text"
                        placeholder={inputPlaceholderText('Ünvan (AZ)')}
                      />
                    </Tooltip>
                  </FormControl>
                )}
              />{' '}
              <Controller
                control={control}
                name="internalAddressEn"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Ünvan (EN)')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errors.internalAddressEn)}
                    isRequired
                    id="internalAddressEn"
                  >
                    <FormLabel>Ünvan (EN)</FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={
                        errors.internalAddressEn
                          ? errors.internalAddressEn.message
                          : ''
                      }
                    >
                      <Input
                        onChange={onChange}
                        value={value ?? ''}
                        type="text"
                        placeholder={inputPlaceholderText('Ünvan (EN)')}
                      />
                    </Tooltip>
                  </FormControl>
                )}
              />{' '}
              <Controller
                control={control}
                name="internalAddressRu"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Ünvan (RU)')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errors.internalAddressRu)}
                    isRequired
                    id="internalAddressRu"
                  >
                    <FormLabel>Ünvan (RU)</FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={
                        errors.internalAddressRu
                          ? errors.internalAddressRu.message
                          : ''
                      }
                    >
                      <Input
                        onChange={onChange}
                        value={value ?? ''}
                        type="text"
                        placeholder={inputPlaceholderText('Ünvan (RU)')}
                      />
                    </Tooltip>
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="internalNameAz"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Ad (AZ)')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errors.internalNameAz)}
                    isRequired
                    id="internalNameAz"
                  >
                    <FormLabel>Ad (AZ)</FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={
                        errors.internalNameAz
                          ? errors.internalNameAz.message
                          : ''
                      }
                    >
                      <Input
                        onChange={onChange}
                        value={value ?? ''}
                        type="text"
                        placeholder={inputPlaceholderText('Ad (AZ)')}
                      />
                    </Tooltip>
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="internalNameEn"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Ad (EN)')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errors.internalNameEn)}
                    isRequired
                    id="internalNameEn"
                  >
                    <FormLabel>Ad (EN)</FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={
                        errors.internalNameEn
                          ? errors.internalNameEn.message
                          : ''
                      }
                    >
                      <Input
                        onChange={onChange}
                        value={value ?? ''}
                        type="text"
                        placeholder={inputPlaceholderText('Ad (EN)')}
                      />
                    </Tooltip>
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="internalNameRu"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Ad (RU)')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errors.internalNameRu)}
                    isRequired
                    id="internalNameRu"
                  >
                    <FormLabel>Ad (RU)</FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={
                        errors.internalNameRu
                          ? errors.internalNameRu.message
                          : ''
                      }
                    >
                      <Input
                        onChange={onChange}
                        value={value ?? ''}
                        type="text"
                        placeholder={inputPlaceholderText('Ad (RU)')}
                      />
                    </Tooltip>
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="phoneNumber"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Telefon')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errors.phoneNumber)}
                    isRequired
                    id="phoneNumber"
                  >
                    <FormLabel>Telefon</FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={
                        errors.phoneNumber ? errors.phoneNumber.message : ''
                      }
                    >
                      <Input
                        onChange={onChange}
                        value={value ?? ''}
                        type="number"
                        placeholder={inputPlaceholderText('Telefon')}
                      />
                    </Tooltip>
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="openingHour"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Açılış saatı')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errors.openingHour)}
                    id="openingHour"
                    isRequired
                  >
                    <FormLabel fontSize="sm" mb={1}>
                      Açılış saatı
                    </FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={
                        errors.openingHour ? errors.openingHour.message : ''
                      }
                    >
                      <div>
                        <Select
                          onChange={onChange}
                          value={value}
                          options={hoursArray}
                          placeholder={selectPlaceholderText('Açılış saatı')}
                        />
                      </div>
                    </Tooltip>
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="closingHour"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Bağlanış saatı')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errors.closingHour)}
                    id="closingHour"
                    isRequired
                  >
                    <FormLabel fontSize="sm" mb={1}>
                      Bağlanış saatı
                    </FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={
                        errors.closingHour ? errors.closingHour.message : ''
                      }
                    >
                      <div>
                        <Select
                          onChange={onChange}
                          value={value}
                          options={hoursArray}
                          placeholder={selectPlaceholderText('Bağlanış saatı')}
                        />
                      </div>
                    </Tooltip>
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="terminalGroup"
                rules={{
                  required: {
                    value: false,
                    message: inputValidationText('Terminal')
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(errors.terminalGroup)}
                    id="terminalGroup"

                  >
                    <FormLabel fontSize="sm" mb={1}>
                      Terminal
                    </FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={
                        errors.terminalGroup ? errors.terminalGroup.message : ''
                      }
                    >
                      <div>
                        <Select
                          onChange={onChange}
                          value={value}
                          isClearable
                          options={selectedItem?.terminalGroups}
                          placeholder={selectPlaceholderText('Terminal')}
                        />
                      </div>
                    </Tooltip>
                  </FormControl>
                )}
              />
            </Stack>
          </form>
        </Box>
        <Box mt={5}>
          <Uploader
            onChange={e => setPhoto(e[0])}
            limit={1}
            accept={['image/png', 'image/jpg', 'image/jpeg']}
          />
        </Box>
        {!photo && selectedItem?.imageUrl && (
          <Box mt={5}>
            <Image
              border="1px solid black"
              h={300}
              w={300}
              mb={1}
              objectFit="contain"
              src={`${import.meta.env.VITE_BASE_URL_IMG
                }${selectedItem?.imageUrl}`}
            />
          </Box>
        )}
      </ModalBody>

      <ModalFooter>
        <Button mr={3} variant="gray" onClick={onClose}>
          {closeBtn}
        </Button>
        <Button
          form="web-About-edit-modal-submit-btn"
          type="submit"
          isDisabled={!isValid}
          isLoading={isSubmitting}
        >
          Düzəliş
        </Button>
      </ModalFooter>
    </ModalContent>
  );
}
export default BranchesEditModal;
