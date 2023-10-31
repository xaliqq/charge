/* eslint-disable no-restricted-globals */
/* eslint-disable radix */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-expressions */
import { IGlobalResponse, modalClose } from '@/models/common';
import {
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  FormControl,
  FormLabel,
  Stack,
  Input
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import { closeBtn, inputPlaceholderText } from '@/utils/constants/texts';
import { IProductItem, IProductUptade } from '@/models/product';
import { ProductService } from '@/services/product-services/product-services';

interface IProductEditModal extends modalClose {
  selectedItem: IProductItem | undefined;
}
function ProductEditModal({
  onClose,
  setRefreshComponent,
  selectedItem
}: IProductEditModal) {
  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting },
    setValue
  } = useForm<IProductItem>({
    mode: 'onChange',
    defaultValues: {
      id: selectedItem?.id,
      nameAz: '',
      nameEn: '',
      nameRu: '',
      descriptionAz: '',
      descriptionEn: '',
      descriptionRu: ''
    }
  });

  useEffect(() => {
    if (selectedItem) {
      setValue('descriptionAz', selectedItem?.descriptionAz);
      setValue('descriptionEn', selectedItem?.descriptionEn);
      setValue('descriptionRu', selectedItem?.descriptionRu);
      setValue('nameAz', selectedItem?.nameAz);
      setValue('nameEn', selectedItem?.nameEn);
      setValue('nameRu', selectedItem?.nameRu);
    }
  }, []);

  const onSubmit: SubmitHandler<IProductItem> = async (
    data: IProductItem
  ): Promise<void> => {
    const body: IProductUptade = {
      id: selectedItem?.id,
      nameAz: data?.nameAz || '',
      nameEn: data?.nameEn || '',
      nameRu: data?.nameRu || '',
      descriptionAz: data?.descriptionAz || '',
      descriptionEn: data?.descriptionEn || '',
      descriptionRu: data?.descriptionRu || ''
    };
    const res: IGlobalResponse =
      await ProductService.getInstance().updateProduct(body);
    if (res?.succeeded) {
      onClose && onClose();
      setRefreshComponent && setRefreshComponent((prev: boolean) => !prev);
    }
  };

  return (
    <ModalContent>
      <ModalHeader>MƏLUMATA DÜZƏLİŞ EDİLMƏSİ</ModalHeader>

      <ModalCloseButton />
      <ModalBody>
        <Box>
          <form
            noValidate
            id="product-edit-modal-submit-btn"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Stack spacing={4}>
              <Controller
                control={control}
                name="nameAz"
                render={({ field: { onChange, value } }) => (
                  <FormControl id="nameAz">
                    <FormLabel>Ad AZ</FormLabel>
                    <Input
                      onChange={onChange}
                      value={value || ''}
                      type="text"
                      placeholder={inputPlaceholderText('Ad az')}
                    />
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="nameEn"
                render={({ field: { onChange, value } }) => (
                  <FormControl id="nameEn">
                    <FormLabel>Ad EN</FormLabel>
                    <Input
                      onChange={onChange}
                      value={value || ''}
                      type="text"
                      placeholder={inputPlaceholderText('Ad en')}
                    />
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="nameRu"
                render={({ field: { onChange, value } }) => (
                  <FormControl id="nameRu">
                    <FormLabel>Ad RU</FormLabel>
                    <Input
                      onChange={onChange}
                      value={value || ''}
                      type="text"
                      placeholder={inputPlaceholderText('Ad ru')}
                    />
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="descriptionAz"
                render={({ field: { onChange, value } }) => (
                  <FormControl id="descriptionAz">
                    <FormLabel>Açıqlama AZ</FormLabel>
                    <Input
                      onChange={onChange}
                      value={value || ''}
                      type="text"
                      placeholder={inputPlaceholderText('Açıqlama az')}
                    />
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="descriptionEn"
                render={({ field: { onChange, value } }) => (
                  <FormControl id="descriptionEn">
                    <FormLabel>Açıqlama EN</FormLabel>
                    <Input
                      onChange={onChange}
                      value={value || ''}
                      type="text"
                      placeholder={inputPlaceholderText('Açıqlama ru')}
                    />
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="descriptionRu"
                render={({ field: { onChange, value } }) => (
                  <FormControl id="descriptionRu">
                    <FormLabel>Açıqlama RU</FormLabel>
                    <Input
                      onChange={onChange}
                      value={value || ''}
                      type="text"
                      placeholder={inputPlaceholderText('Açıqlama ru')}
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
          form="product-edit-modal-submit-btn"
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

export default ProductEditModal;
