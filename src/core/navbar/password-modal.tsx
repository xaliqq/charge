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
    IconButton,
    InputGroup,
    InputRightElement,

} from '@chakra-ui/react';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import {
    closeBtn,
    editBtn,
    inputPlaceholderText,
    inputValidationText,
} from '@/utils/constants/texts';

import { AxiosError } from 'axios';
import { AuthService, IChangePassword } from '@/services/auth-services/auth-services';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useState } from 'react';





function PasswordModal({ onClose, }: modalClose) {
    const {
        handleSubmit,
        control,
        setError,
        watch,
        clearErrors,
        formState: { errors, isValid, isSubmitting }
    } = useForm<IChangePassword>({
        mode: 'onChange',
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: '',


        }
    });

    const toast = useToast();

    const [oldPasswordShow, setOldPasswordShow] = useState(false);
    const [newPasswordShow, setNewPasswordShow] = useState(false);
    const [confirmNewPasswordShow, setConfirmNewPasswordShow] = useState(false);


    const onSubmit: SubmitHandler<IChangePassword> = async (
        data: IChangePassword
    ): Promise<void> => {

        try {
            await new AuthService().changePassword(data);
            toast({
                title: 'Əməliyyat uğurla icra olundu',
                description: 'Yeni şifrənin təkrarı məlumatları uğurla dəyişdirildi edildi',
                status: 'success',
                position: 'top-right',
                duration: 3000,
                isClosable: true
            });
            onClose && onClose();
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
                            'Şifrə məlumatlarının əlavə dəyişdirilməsi zamanı xəta baş verdi',
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
                    <form id='change-password-modal-submit-btn' onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={4}>
                            <Controller
                                control={control}
                                name="oldPassword"
                                rules={{
                                    required: {
                                        value: true,
                                        message: inputValidationText('Köhnə Şifrə')
                                    }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <FormControl
                                        isInvalid={Boolean(errors.oldPassword)}
                                        isRequired
                                        id="oldPassword"
                                    >
                                        <FormLabel>Köhnə Şifrə</FormLabel>
                                        <Tooltip
                                            hasArrow
                                            placement="top-end"
                                            label={errors.oldPassword ? errors.oldPassword.message : ''}
                                        >
                                            <InputGroup size="md">
                                                <Input
                                                    onChange={onChange}
                                                    value={value}
                                                    type={oldPasswordShow ? 'text' : 'password'}
                                                    placeholder={inputPlaceholderText('Köhnə Şifrə')}
                                                />
                                                <InputRightElement width="4.5rem">
                                                    <IconButton
                                                        h="1.75rem"
                                                        size="sm"
                                                        onClick={() => value && setOldPasswordShow(!oldPasswordShow)}
                                                        aria-label="Show oldPassword"
                                                        icon={!oldPasswordShow ? <FiEye /> : <FiEyeOff />}
                                                    />
                                                </InputRightElement>
                                            </InputGroup>
                                        </Tooltip>
                                    </FormControl>
                                )}
                            />
                            <Controller
                                control={control}
                                name="newPassword"
                                rules={{
                                    required: {
                                        value: true,
                                        message: inputValidationText('Yeni Şifrə')
                                    },
                                    validate: {
                                        RequireDigit: value => /[^0-9]/.test(value) || 'Şifrəda ən azı 1 rəqəm olmalıdır ',
                                        RequireLowercase: value => /[a-z]/.test(value) || 'Şifrədə ən az 1 kiçik hərf olmalıdır',
                                        RequireUppercase: value => /[A-Z]/.test(value) || 'Şifrədə ən az 1 böyük hərf olmalıdır  ',
                                    }

                                }}
                                render={({ field: { onChange, value } }) => (
                                    <FormControl
                                        isInvalid={Boolean(errors.newPassword)}
                                        isRequired
                                        id="newPassword"
                                    >
                                        <FormLabel>Yeni Şifrə</FormLabel>
                                        <Tooltip
                                            hasArrow
                                            placement="top-end"
                                            label={errors.newPassword ? errors.newPassword.message : ''}
                                        >
                                            <InputGroup size="md">
                                                <Input
                                                    value={value}

                                                    onChange={e => {
                                                        onChange(e)
                                                        if (watch('newPassword') !== watch('confirmNewPassword')) {
                                                            setError('newPassword', { message: 'Yeni şifrə və yeni şifrənin təkrarı eyni olmalıdı' })
                                                            setError('confirmNewPassword', { message: 'Yeni şifrə və yeni şifrənin təkrarı eyni olmalıdı' })
                                                        }
                                                        else {
                                                            clearErrors('newPassword')
                                                            clearErrors('confirmNewPassword')
                                                        }
                                                    }}
                                                    type={newPasswordShow ? 'text' : 'password'}
                                                    placeholder={inputPlaceholderText('Yeni Şifrə')}
                                                />
                                                <InputRightElement width="4.5rem">
                                                    <IconButton
                                                        h="1.75rem"
                                                        size="sm"
                                                        onClick={() => value && setNewPasswordShow(!newPasswordShow)}
                                                        aria-label="Show newPassword"
                                                        icon={!newPasswordShow ? <FiEye /> : <FiEyeOff />}
                                                    />
                                                </InputRightElement>
                                            </InputGroup>
                                        </Tooltip>
                                    </FormControl>
                                )}
                            />
                            <Controller
                                control={control}
                                name="confirmNewPassword"
                                rules={{
                                    required: {
                                        value: true,
                                        message: inputValidationText('Yeni şifrənin təkrarı')
                                    },
                                    validate: {
                                        RequireDigit: value => /[^0-9]/.test(value) || 'Şifrəda ən azı 1 rəqəm olmalıdır ',
                                        RequireLowercase: value => /[a-z]/.test(value) || 'Şifrədə ən az 1 kiçik hərf olmalıdır',
                                        RequireUppercase: value => /[A-Z]/.test(value) || 'Şifrədə ən az 1 böyük hərf olmalıdır  ',
                                    }

                                }}
                                render={({ field: { onChange, value } }) => (
                                    <FormControl
                                        isInvalid={Boolean(errors.confirmNewPassword)}
                                        isRequired
                                        id="confirmNewPassword"
                                    >
                                        <FormLabel>Yeni şifrənin təkrarı</FormLabel>
                                        <Tooltip
                                            hasArrow
                                            placement="top-end"
                                            label={errors.confirmNewPassword ? errors.confirmNewPassword.message : ''}
                                        >
                                            <InputGroup size="md">
                                                <Input
                                                    value={value}

                                                    onChange={e => {

                                                        onChange(e)
                                                        if (watch('newPassword') !== watch('confirmNewPassword')) {
                                                            setError('newPassword', { message: 'Yeni şifrə və yeni şifrənin təkrarı eyni olmalıdı' })
                                                            setError('confirmNewPassword', { message: 'Yeni şifrə və yeni şifrənin təkrarı eyni olmalıdı' })
                                                        }

                                                        else {
                                                            clearErrors('newPassword')
                                                            clearErrors('confirmNewPassword')
                                                        }
                                                    }}
                                                    type={confirmNewPasswordShow ? 'text' : 'password'}
                                                    placeholder={inputPlaceholderText('Yeni şifrənin təkrarı')}
                                                />
                                                <InputRightElement width="4.5rem">
                                                    <IconButton
                                                        h="1.75rem"
                                                        size="sm"
                                                        onClick={() => value && setConfirmNewPasswordShow(!confirmNewPasswordShow)}
                                                        aria-label="Show confirmNewPassword"
                                                        icon={!confirmNewPasswordShow ? <FiEye /> : <FiEyeOff />}
                                                    />
                                                </InputRightElement>
                                            </InputGroup>
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
                    form="change-password-modal-submit-btn"
                    type="submit"
                    isDisabled={!isValid}
                    isLoading={isSubmitting}
                >
                    {editBtn}
                </Button>
            </ModalFooter>
        </ModalContent>
    );
}

export default PasswordModal;
