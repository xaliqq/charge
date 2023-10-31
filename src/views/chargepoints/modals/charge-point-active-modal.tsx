/* eslint-disable no-restricted-globals */
/* eslint-disable radix */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-expressions */
import { modalClose } from '@/models/common';
import {
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  useToast,
  FormControl,
  FormLabel,
  Stack,
  Input
} from '@chakra-ui/react';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import { closeBtn } from '@/utils/constants/texts';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { ChargePointServices } from '@/services/charge-points-services/charge-points-services';
import {
  IChargePointDetailItem,
  IChargePointsItem
} from '@/models/charge-points';
// import { ChargePointServices } from '@/services/charge-points-services/charge-points-services';

interface IChargePointEditPayload {
  id: string;
  maxVoltage: string | number;
  latitude: string | number;
  longitude: string | number;
  pricePerHour: string;
  rowId: string;
}
interface IChargePointEditModal extends modalClose {
  id: string;
}
function ChargePointEditModal({
  onClose,
  setRefreshComponent,
  id
}: IChargePointEditModal) {
  const [chargePointData, setchargePointData] =
    useState<IChargePointsItem | null>(null);
  const {
    handleSubmit,
    control,
    setValue,
    formState: { isValid, isSubmitting }
  } = useForm<IChargePointEditPayload>({
    mode: 'onChange',
    defaultValues: {
      id,
      maxVoltage: '',
      latitude: '',
      longitude: '',
      pricePerHour: '2',
      rowId: ''
    }
  });

  const toast = useToast();

  const onSubmit: SubmitHandler<IChargePointEditPayload> = async (
    data: IChargePointEditPayload
  ): Promise<void> => {
    try {
      await ChargePointServices.getInstance().activateChargePoint(data);
      toast({
        title: 'Əməliyyat uğurla icra olundu',
        description: 'Məntəqə məlumatları uğurla yeniləndi',
        status: 'success',
        position: 'top-right',
        duration: 3000,
        isClosable: true
      });
      onClose && onClose();
      setRefreshComponent && setRefreshComponent((prev: boolean) => !prev);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
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
              'Məntəqə məlumatlarının yenilənməsi zamanı xəta baş verdi',
            status: 'error',
            position: 'top-right',
            duration: 3000,
            isClosable: true
          });
        }
      }
    }
  };

  const fetchChargePointById = async () => {
    try {
      const res: IChargePointDetailItem =
        await ChargePointServices.getInstance().getChargePointById(id);
      setchargePointData(res.data);
      const { data } = res;
      setValue('maxVoltage', data?.maxVoltage);
      setValue('latitude', data?.latitude);
      setValue('longitude', data?.longitude);
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
              'Məntəqə məlumatlarının gətirilməsi zamanı xəta baş verdi',
            status: 'error',
            position: 'top-right',
            duration: 3000,
            isClosable: true
          });
        }
      }
    }
  };

  console.log(chargePointData);

  useEffect(() => {
    id && fetchChargePointById();
  }, []);

  return (
    <ModalContent>
      <ModalHeader>MƏNTƏQƏNİN AKTİV EDİLMƏSİ</ModalHeader>

      <ModalCloseButton />
      <ModalBody>
        <Box>
          <form
            id="charge-edit-modal-submit-btn"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Stack spacing={4}>
              <Controller
                control={control}
                name="maxVoltage"
                rules={{
                  required: true
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl isRequired id="maxVoltage">
                    <FormLabel fontSize="sm" mb={1}>
                      Voltage (max)
                    </FormLabel>
                    <Input
                      onChange={onChange}
                      disabled
                      value={value}
                      borderRadius="md"
                      type="number"
                      placeholder="Daxil edin"
                    />
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="latitude"
                rules={{
                  required: true
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl isRequired id="latitude">
                    <FormLabel fontSize="sm" mb={1}>
                      Latitude
                    </FormLabel>
                    <Input
                      onChange={onChange}
                      value={value}
                      disabled
                      borderRadius="md"
                      type="number"
                      placeholder="Daxil edin"
                    />
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="longitude"
                rules={{
                  required: true
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl isRequired id="longitude">
                    <FormLabel fontSize="sm" mb={1}>
                      Longitude
                    </FormLabel>
                    <Input
                      onChange={onChange}
                      value={value}
                      disabled
                      borderRadius="md"
                      type="number"
                      placeholder="Daxil edin"
                    />
                  </FormControl>
                )}
              />

              <Controller
                control={control}
                name="pricePerHour"
                rules={{
                  required: true
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl isRequired id="pricePerHour">
                    <FormLabel fontSize="sm" mb={1}>
                      Saatlıq qiymət
                    </FormLabel>
                    <Input
                      onChange={onChange}
                      value={value}
                      borderRadius="md"
                      type="number"
                      placeholder="Daxil edin"
                    />
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="rowId"
                rules={{
                  required: true
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl isRequired id="rowId">
                    <FormLabel fontSize="sm" mb={1}>
                      Sıra ID
                    </FormLabel>
                    <Input
                      onChange={onChange}
                      value={value}
                      borderRadius="md"
                      type="number"
                      placeholder="Daxil edin"
                    />
                  </FormControl>
                )}
              />
            </Stack>
          </form>
        </Box>
      </ModalBody>

      <ModalFooter>
        <Button mr={3} variant="gray" onClick={onClose}>
          {closeBtn}
        </Button>
        <Button
          form="charge-edit-modal-submit-btn"
          type="submit"
          isDisabled={!isValid}
          isLoading={isSubmitting}
        >
          Təsdiq
        </Button>
      </ModalFooter>
    </ModalContent>
  );
}

export default ChargePointEditModal;
