/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-restricted-globals */
/* eslint-disable radix */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-expressions */
import { modalClose, } from '@/models/common';
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
    Input,
    Tooltip,

} from '@chakra-ui/react';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import {
    addBtn,
    closeBtn,
    inputPlaceholderText,
    inputValidationText,
    selectPlaceholderText
} from '@/utils/constants/texts';

import { Select } from 'chakra-react-select';
import { genderOptions, roleOptions } from '@/utils/constants/options';
import { UsersServies, } from "@/services/user-services/user-services";
import { AxiosError } from 'axios';
import { IUserItem } from '@/models/users';
import DatePicker from '@/components/forms/date-picker/date-picker';



function UserAddModal({ onClose, setRefreshComponent }: modalClose) {
    const {
        handleSubmit,
        control,
        formState: { errors, isValid, isSubmitting }
    } = useForm<IUserItem>({
        mode: 'onChange',
        defaultValues: {
            firstname: '',
            lastname: '',
            phoneNumber: '',
            email: '',
            roleId: null,
            genderId: null,
            birthday: null
        }
    });

    const toast = useToast();

    const onSubmit: SubmitHandler<IUserItem> = async (
        data: IUserItem
    ): Promise<void> => {
        const payload = {
            ...data,
            // birthday: data?.birthday ? new Date(data?.birthday) : null,
            birthday: null,
            apiLogin: 'ramiz',
            genderId: data?.genderId && typeof data?.genderId === 'object' && 'value' in data?.genderId ? Number(data?.genderId?.value) : null,
            roleId: data?.roleId && typeof data?.roleId === 'object' && 'value' in data?.roleId ? Number(data?.roleId?.value) : null
        }
        try {
            await UsersServies.getInstance().createUser(payload);
            toast({
                title: 'Əməliyyat uğurla icra olundu',
                description: 'İstifadəçi məlumatları uğurla əlavə edildi',
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
                            'İstifadəçi məlumatlarının əlavə edilməsi zamanı xəta baş verdi',
                        status: 'error',
                        position: 'top-right',
                        duration: 3000,
                        isClosable: true
                    });
                }
            }
        }
    };

    return (
        <ModalContent>
            <ModalHeader>MƏLUMATIN ƏLAVƏ EDİLMƏSİ</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Box>
                    <form
                        noValidate
                        id="user-add-modal-submit-btn"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <Stack spacing={4}>
                            <Controller
                                control={control}
                                name="birthday"
                                rules={{
                                    required: {
                                        value: true,
                                        message: inputValidationText('Doğum tarixi')
                                    }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <FormControl
                                        isInvalid={Boolean(errors.birthday)}
                                        id="birthday"
                                        isRequired
                                    >
                                        <FormLabel fontSize="sm" mb={1}>
                                            Doğum tarixi
                                        </FormLabel>
                                        <Tooltip
                                            hasArrow
                                            placement="top-end"
                                            label={errors.birthday ? errors.birthday.message : ''}
                                        >
                                            <div>
                                                <DatePicker
                                                    name="date-input"
                                                    type="date"
                                                    placeholder="Sifariş tarixi"
                                                    value={value?.toString()}
                                                    onChange={onChange}
                                                />
                                            </div>
                                        </Tooltip>
                                    </FormControl>
                                )}
                            />

                            <Controller
                                control={control}
                                name="roleId"
                                rules={{
                                    required: {
                                        value: true,
                                        message: inputValidationText('Rol')
                                    }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <FormControl
                                        isInvalid={Boolean(errors.roleId)}
                                        id="roleId"
                                        isRequired
                                    >
                                        <FormLabel fontSize="sm" mb={1}>
                                            Rol
                                        </FormLabel>
                                        <Tooltip
                                            hasArrow
                                            placement="top-end"
                                            label={errors.roleId ? errors.roleId.message : ''}
                                        >
                                            <div>
                                                <Select
                                                    onChange={onChange}
                                                    value={value}
                                                    options={roleOptions}
                                                    placeholder={selectPlaceholderText('Rol')}

                                                />
                                            </div>
                                        </Tooltip>
                                    </FormControl>
                                )}
                            />
                            <Controller
                                control={control}
                                name="genderId"
                                rules={{
                                    required: {
                                        value: true,
                                        message: inputValidationText('Cins')
                                    }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <FormControl
                                        isInvalid={Boolean(errors.genderId)}
                                        id="genderId"
                                        isRequired
                                    >
                                        <FormLabel fontSize="sm" mb={1}>
                                            Cins
                                        </FormLabel>
                                        <Tooltip
                                            hasArrow
                                            placement="top-end"
                                            label={errors.genderId ? errors.genderId.message : ''}
                                        >
                                            <div>
                                                <Select
                                                    onChange={onChange}
                                                    value={value}
                                                    options={genderOptions}
                                                    placeholder={selectPlaceholderText('Cins')}
                                                />
                                            </div>
                                        </Tooltip>
                                    </FormControl>
                                )}
                            />
                            <Controller
                                control={control}
                                name="firstname"
                                rules={{
                                    required: {
                                        value: true,
                                        message: inputValidationText('Ad')
                                    }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <FormControl
                                        isInvalid={Boolean(errors.firstname)}
                                        isRequired
                                        id="firstname"
                                    >
                                        <FormLabel fontSize="sm" mb={1}>Ad</FormLabel>
                                        <Tooltip
                                            hasArrow
                                            placement="top-end"
                                            label={errors.firstname ? errors.firstname.message : ''}
                                        >
                                            <Input
                                                onChange={onChange}
                                                value={value}
                                                type="text"
                                                placeholder={inputPlaceholderText('Ad')}
                                            />
                                        </Tooltip>
                                    </FormControl>
                                )}
                            />
                            <Controller
                                control={control}
                                name="lastname"
                                rules={{
                                    required: {
                                        value: true,
                                        message: inputValidationText('Soyad')
                                    }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <FormControl
                                        isInvalid={Boolean(errors.lastname)}
                                        id="lastname"
                                        isRequired
                                    >
                                        <FormLabel fontSize="sm" mb={1}>Soyad</FormLabel>
                                        <Tooltip
                                            hasArrow
                                            placement="top-end"
                                            label={
                                                errors.lastname ? errors.lastname.message : ''
                                            }
                                        >
                                            <Input
                                                onChange={onChange}
                                                value={value}
                                                type="text"
                                                placeholder={inputPlaceholderText('Soyad')}
                                            />
                                        </Tooltip>
                                    </FormControl>
                                )}
                            />
                            <Controller
                                control={control}
                                name="email"
                                rules={{
                                    required: {
                                        value: true,
                                        message: inputValidationText('Email')
                                    }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <FormControl
                                        isInvalid={Boolean(errors.email)}
                                        id="email"
                                        isRequired
                                    >
                                        <FormLabel fontSize="sm" mb={1}>Email</FormLabel>
                                        <Tooltip
                                            hasArrow
                                            placement="top-end"
                                            label={
                                                errors.email ? errors.email.message : ''
                                            }
                                        >
                                            <Input
                                                onChange={onChange}
                                                value={value}
                                                type="text"
                                                placeholder={inputPlaceholderText('Email')}
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
                                        id="phoneNumber"
                                        isRequired
                                    >
                                        <FormLabel fontSize="sm" mb={1}>Telefon</FormLabel>
                                        <Tooltip
                                            hasArrow
                                            placement="top-end"
                                            label={
                                                errors.phoneNumber ? errors.phoneNumber.message : ''
                                            }
                                        >
                                            <Input
                                                onChange={onChange}
                                                value={value}
                                                type="text"
                                                placeholder={inputPlaceholderText('Telefon')}
                                            />
                                        </Tooltip>
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
                    form="user-add-modal-submit-btn"
                    type="submit"
                    isDisabled={!isValid}
                    isLoading={isSubmitting}
                >
                    {addBtn}
                </Button>
            </ModalFooter>
        </ModalContent>
    );
}

export default UserAddModal;
