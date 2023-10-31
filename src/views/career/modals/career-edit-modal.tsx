/* eslint-disable no-restricted-syntax */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
import Uploader from '@/components/forms/uploader/uploader';
import { modalClose } from '@/models/common';
import {
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  useToast,
  Box,
  Input,
  FormControl,
  FormLabel,
  Tooltip,
  Image
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
  closeBtn,
  editBtn,
  inputPlaceholderText,
  inputValidationText
} from '@/utils/constants/texts';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { CareerServices } from '@/services/career-services/career-services';
import {
  ICareerListDescription,
  ICareerListItem,
  ICareerListTitle
} from '@/models/career';
import DescriptionFieldArray from '../components/career-description-field-array';

interface InputDescription {
  description: string;
  id?: number | string;
  LanguageId?: number | string;
}

interface OutputDescription {
  Description: string;
  Id?: number | string;
}

interface InputTitle {
  titleAz: string;
  titleEn: string;
  titleRu: string;
}

interface OutputTitle {
  Title: string;
  Id: number | string;
  LanguageId?: number | string;
}

export interface CareerAddModalFormData {
  title: {
    titleAz: string;
    titleEn: string;
    titleRu: string;
  };
  descriptionAZ: {
    id: number | string;
    description: string;
  }[];
  descriptionEN: {
    id: number | string;
    description: string;
  }[];
  descriptionRU: {
    id: number | string;
    description: string;
  }[];
}
interface ICareerEditModalProps extends modalClose {
  selectedItem: ICareerListItem | undefined;
}

function CareerEditModal({
  onClose,
  selectedItem,
  setRefreshComponent
}: ICareerEditModalProps) {
  const {
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting, isValid },
    control
  } = useForm<CareerAddModalFormData>({
    mode: 'onChange',
    defaultValues: {}
  });
  const [photo, setPhoto] = useState<File>();
  const toast = useToast();
  function convertData(input: {
    title: InputTitle;
    descriptionAZ: InputDescription[];
    descriptionEN: InputDescription[];
    descriptionRU: InputDescription[];
  }): {
    title: OutputTitle[];
    description: OutputDescription[];
  } {
    const outputTitle: OutputTitle[] = [
      {
        Title: input.title.titleAz,
        LanguageId: 1,
        Id:
          selectedItem?.titles.filter((z: ICareerListTitle) =>
            z.languageId === 1 ? z.id : 0
          )[0].id || 0
      },
      {
        Title: input.title.titleEn,
        LanguageId: 2,
        Id:
          selectedItem?.titles.filter((z: ICareerListTitle) =>
            z.languageId === 2 ? z.id : 0
          )[0].id || 0
      },
      {
        Title: input.title.titleRu,
        LanguageId: 3,
        Id:
          selectedItem?.titles.filter((z: ICareerListTitle) =>
            z.languageId === 3 ? z.id : 0
          )[0].id || 0
      }
    ];
    const outputDescription: OutputDescription[] = [
      ...input.descriptionAZ.map(desc => ({
        Description: desc.description,
        Id: desc.id || 0,
        LanguageId: 1
      })),
      ...input.descriptionEN.map(desc => ({
        Description: desc.description,
        Id: desc.id || 0,
        LanguageId: 2
      })),
      ...input.descriptionRU.map(desc => ({
        Description: desc.description,
        Id: desc.id || 0,
        LanguageId: 3
      }))
    ];
    return {
      title: outputTitle,
      description: outputDescription
    };
  }
  const onSubmit: SubmitHandler<CareerAddModalFormData> = async (
    data: CareerAddModalFormData
  ) => {
    const formData = new FormData();
    photo && formData.append('photo', photo || selectedItem?.imageUrl);
    formData.append('Titles', JSON.stringify(convertData(data).title));
    formData.append(
      'Descriptions',
      JSON.stringify(convertData(data).description)
    );
    selectedItem?.id && formData.append('id', String(selectedItem?.id));

    try {
      await CareerServices.getInstance().updateCareerList(formData);
      toast({
        title: 'Əməliyyat uğurla icra olundu',
        description: 'Karyera kontent məlumatları uğurla yeniləndi',
        status: 'success',
        position: 'top-right',
        duration: 3000,
        isClosable: true
      });
      onClose && onClose();
      setRefreshComponent && setRefreshComponent((prev: boolean) => !prev);
    } catch (error: any) {
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
            'Karyera kontent məlumatlarının yenilənməi zamanı xəta baş verdi',
          status: 'error',
          position: 'top-right',
          duration: 3000,
          isClosable: true
        });
      }
    }
  };

  useEffect(() => {
    selectedItem?.titles?.map((z: ICareerListTitle) => {
      if (z.languageId === 1) {
        setValue('title.titleAz', z?.title);
      }
      if (z.languageId === 2) {
        setValue('title.titleEn', z?.title);
      }
      if (z.languageId === 3) {
        setValue('title.titleRu', z?.title);
      }
    });
    selectedItem?.careerContentDescriptions.map((z: ICareerListDescription) => {
      if (z.languageId === 1) {
        setValue('descriptionAZ', [
          ...getValues('descriptionAZ'),
          { description: z?.description, id: z?.id }
        ]);
      }
      if (z.languageId === 2) {
        setValue('descriptionEN', [
          ...getValues('descriptionEN'),
          { description: z?.description, id: z?.id }
        ]);
      }
      if (z.languageId === 3) {
        setValue('descriptionRU', [
          ...getValues('descriptionRU'),
          { description: z?.description, id: z?.id }
        ]);
      }
    });
  }, []);

  return (
    <ModalContent>
      <ModalHeader>MƏLUMATA DÜZƏLİŞ EDİLMƏSİ</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <form id="career-add-modal-btn" onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <Tabs>
              <TabList>
                <Tab>AZ</Tab>
                <Tab>EN</Tab>
                <Tab>RU</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <Controller
                    control={control}
                    name="title.titleAz"
                    rules={{
                      required: {
                        value: true,
                        message: inputValidationText('Başlıq')
                      }
                    }}
                    render={({ field: { onChange, value } }) => (
                      <FormControl
                        isInvalid={Boolean(errors.title?.titleAz)}
                        id="titleAz"
                        isRequired
                      >
                        <FormLabel>Başlıq</FormLabel>
                        <Tooltip
                          hasArrow
                          placement="top-end"
                          label={
                            errors.title?.titleAz
                              ? errors.title.titleAz.message
                              : ''
                          }
                        >
                          <Input
                            onChange={onChange}
                            value={value}
                            type="text"
                            placeholder={inputPlaceholderText('Başlıq')}
                          />
                        </Tooltip>
                      </FormControl>
                    )}
                  />
                  <DescriptionFieldArray
                    errors={errors}
                    control={control}
                    name="descriptionAZ"
                  />
                </TabPanel>
                <TabPanel>
                  <Controller
                    control={control}
                    name="title.titleEn"
                    rules={{
                      required: {
                        value: true,
                        message: inputValidationText('Başlıq')
                      }
                    }}
                    render={({ field: { onChange, value } }) => (
                      <FormControl
                        isInvalid={Boolean(errors.title?.titleEn)}
                        id="titleEn"
                        isRequired
                      >
                        <FormLabel>Başlıq</FormLabel>
                        <Tooltip
                          hasArrow
                          placement="top-end"
                          label={
                            errors.title?.titleEn
                              ? errors.title?.titleEn.message
                              : ''
                          }
                        >
                          <Input
                            onChange={onChange}
                            value={value}
                            type="text"
                            placeholder={inputPlaceholderText('Başlıq')}
                          />
                        </Tooltip>
                      </FormControl>
                    )}
                  />
                  <DescriptionFieldArray
                    errors={errors}
                    control={control}
                    name="descriptionEN"
                  />
                </TabPanel>
                <TabPanel>
                  <Controller
                    control={control}
                    name="title.titleRu"
                    rules={{
                      required: {
                        value: true,
                        message: inputValidationText('Başlıq')
                      }
                    }}
                    render={({ field: { onChange, value } }) => (
                      <FormControl
                        isInvalid={Boolean(errors.title?.titleRu)}
                        id="titleRu"
                        isRequired
                      >
                        <FormLabel>Başlıq</FormLabel>
                        <Tooltip
                          hasArrow
                          placement="top-end"
                          label={
                            errors.title?.titleRu
                              ? errors.title?.titleRu.message
                              : ''
                          }
                        >
                          <Input
                            onChange={onChange}
                            value={value}
                            type="text"
                            placeholder={inputPlaceholderText('Başlıq')}
                          />
                        </Tooltip>
                      </FormControl>
                    )}
                  />
                  <DescriptionFieldArray
                    errors={errors}
                    control={control}
                    name="descriptionRU"
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
            <Uploader
              onChange={e => setPhoto(e[0])}
              limit={1}
              accept={['image/png', 'image/jpg', 'image/jpeg']}
            />
            {!photo && selectedItem?.imageUrl && (
              <Box mt={5}>
                <Image
                  border="1px solid black"
                  h={300}
                  w={300}
                  mb={1}
                  objectFit="contain"
                  src={`${
                    import.meta.env.VITE_BASE_URL_IMG
                  }${selectedItem?.imageUrl}`}
                />
              </Box>
            )}
          </Box>
        </form>
      </ModalBody>

      <ModalFooter>
        <Button mr={3} variant="gray" onClick={onClose}>
          {closeBtn}
        </Button>
        <Button
          isLoading={isSubmitting}
          form="career-add-modal-btn"
          type="submit"
          isDisabled={!isValid}
        >
          {editBtn}
        </Button>
      </ModalFooter>
    </ModalContent>
  );
}

export default CareerEditModal;
