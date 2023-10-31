/* eslint-disable no-restricted-globals */
/* eslint-disable radix */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-expressions */
import { IGlobalResponse, modalClose } from '@/models/common';
import { ICategoryUptade } from '@/models/category';
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
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import { closeBtn, inputPlaceholderText } from '@/utils/constants/texts';
import { CategoryService } from '@/services/category-services/category-services';
import { useEffect } from 'react';

interface ICategoryEditModal extends modalClose {
  selectedItem: ICategoryUptade | undefined;
}
function CategoryEditModal({
  onClose,
  setRefreshComponent,
  selectedItem
}: ICategoryEditModal) {
  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting },
    setValue
  } = useForm<ICategoryUptade>({
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

  const onSubmit: SubmitHandler<ICategoryUptade> = async (
    data: ICategoryUptade
  ): Promise<void> => {
    const body: ICategoryUptade = {
      id: selectedItem ? selectedItem?.id : null,
      nameAz: data?.nameAz || '',
      nameEn: data?.nameEn || '',
      nameRu: data?.nameRu || '',
      descriptionAz: data?.descriptionAz || '',
      descriptionEn: data?.descriptionEn || '',
      descriptionRu: data?.descriptionRu || ''
    };
    const res: IGlobalResponse =
      await CategoryService.getInstance().updateCategory(body);
    if (res?.succeeded) {
      onClose && onClose();
      setRefreshComponent && setRefreshComponent((prev: boolean) => !prev);
    }
  };

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

  return (
    <ModalContent>
      <ModalHeader>MƏLUMATA DÜZƏLİŞ EDİLMƏSİ</ModalHeader>

      <ModalCloseButton />
      <ModalBody>
        <Box>
          <form
            noValidate
            id="category-edit-modal-submit-btn"
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
          form="category-edit-modal-submit-btn"
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

export default CategoryEditModal;
