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
  Tooltip
} from '@chakra-ui/react';
import { useState } from 'react';
import {
  addBtn,
  closeBtn,
  inputPlaceholderText,
  inputValidationText
} from '@/utils/constants/texts';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { CareerServices } from '@/services/career-services/career-services';
import DescriptionFieldArray from '../components/career-description-field-array';

export interface LanguageData {
  Title: string;
  Descriptions: string[];
}

export type TransformedData = Record<'Az' | 'En' | 'Ru', LanguageData>;

export type Description = {
  description: string;
};

export type Title = {
  titleAz: string;
  titleEn: string;
  titleRu: string;
};

export type InputData = {
  descriptionAZ: Description[];
  descriptionEN: Description[];
  descriptionRU: Description[];
  title: Title;
};

export interface CareerAddModalFormData {
  title: {
    titleAz: string;
    titleEn: string;
    titleRu: string;
  };
  descriptionAZ: {
    description: string;
  }[];
  descriptionEN: {
    description: string;
  }[];
  descriptionRU: {
    description: string;
  }[];
}
function CareerAddModal({ onClose, setRefreshComponent }: modalClose) {
  const {
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    control
  } = useForm<CareerAddModalFormData>({
    mode: 'onChange',
    defaultValues: {
      descriptionAZ: [
        {
          description: ''
        }
      ],
      descriptionEN: [
        {
          description: ''
        }
      ],
      descriptionRU: [
        {
          description: ''
        }
      ]
    }
  });
  const [photo, setPhoto] = useState<File>();
  const toast = useToast();

  function transformData(inputData: InputData): TransformedData {
    const transformed: TransformedData = {
      Az: {
        Title: inputData.title.titleAz,
        Descriptions: inputData.descriptionAZ.map(desc => desc.description)
      },
      En: {
        Title: inputData.title.titleEn,
        Descriptions: inputData.descriptionEN.map(desc => desc.description)
      },
      Ru: {
        Title: inputData.title.titleRu,
        Descriptions: inputData.descriptionRU.map(desc => desc.description)
      }
    };

    return transformed;
  }

  const onSubmit: SubmitHandler<CareerAddModalFormData> = async (
    data: CareerAddModalFormData
  ) => {
    console.log(transformData(data));
    const formData = new FormData();
    photo && formData.append('photo', photo);
    formData.append('Az', JSON.stringify(transformData(data).Az));
    formData.append('En', JSON.stringify(transformData(data).En));
    formData.append('Ru', JSON.stringify(transformData(data).Ru));

    try {
      await CareerServices.getInstance().createCareerList(formData);
      toast({
        title: 'Əməliyyat uğurla icra olundu',
        description: 'Karyera kontent məlumatları uğurla əlavə edildi',
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
            'Karyera kontent məlumatlarının əlavə edilməsi zamanı xəta baş verdi',
          status: 'error',
          position: 'top-right',
          duration: 3000,
          isClosable: true
        });
      }
    }
  };

  return (
    <ModalContent>
      <ModalHeader>MƏLUMATIN ƏLAVƏ EDİLMƏSİ</ModalHeader>
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
          isDisabled={photo === undefined || photo === null || !isValid}
        >
          {addBtn}
        </Button>
      </ModalFooter>
    </ModalContent>
  );
}

export default CareerAddModal;
