/* eslint-disable no-restricted-globals */
/* eslint-disable radix */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-expressions */
import { modalClose, selectOption } from '@/models/common';
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
  Stack
} from '@chakra-ui/react';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import { closeBtn, selectPlaceholderText } from '@/utils/constants/texts';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { ChargePointServices } from '@/services/charge-points-services/charge-points-services';

import { Select } from 'chakra-react-select';
import {
  IGetPartnersSelectResponse,
  PartnerServices
} from '@/services/partner-services/partner-services';

interface IPartnerAddPayload {
  chargePointId: string;
  partnerId: selectOption | null;
}
interface IChargePointEditModal extends modalClose {
  id: string;
}
function ChargePointEditModal({
  onClose,
  setRefreshComponent,
  id
}: IChargePointEditModal) {
  const [partnerSelectlist, setPartnerSelectlist] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting }
  } = useForm<IPartnerAddPayload>({
    mode: 'onChange',
    defaultValues: {
      chargePointId: id,
      partnerId: null
    }
  });

  const toast = useToast();

  const onSubmit: SubmitHandler<IPartnerAddPayload> = async (
    data: IPartnerAddPayload
  ): Promise<void> => {
    const body = {
      ...data,
      partnerId: data?.partnerId?.value
    };
    try {
      await ChargePointServices.getInstance().addPartner(body);
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

  const fetchData = async () => {
    setLoading(true);

    try {
      const res: IGetPartnersSelectResponse =
        await PartnerServices.getInstance().getPartnersSelect();
      setPartnerSelectlist(res.data);

      setLoading(false);
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
              'İstifadəçilər məlumatlarının gətirilməsi zamanı xəta baş verdi',
            status: 'error',
            position: 'top-right',
            duration: 3000,
            isClosable: true
          });
        }
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ModalContent>
      <ModalHeader>PARTNYOR ƏLAVƏ EDİLMƏSİ</ModalHeader>

      <ModalCloseButton />
      <ModalBody>
        <Box height={150}>
          <form
            id="charge-edit-modal-submit-btn"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Stack spacing={4}>
              <Controller
                control={control}
                name="partnerId"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <FormControl id="activationStatus">
                    <FormLabel fontSize="sm" mb={1}>
                      Partner
                    </FormLabel>
                    <Select
                      className="chakra-select"
                      onChange={onChange}
                      value={value}
                      isLoading={loading}
                      options={partnerSelectlist}
                      placeholder={
                        <div className="custom-select-placeholder">
                          {selectPlaceholderText('Partner')}
                        </div>
                      }
                      isClearable
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
