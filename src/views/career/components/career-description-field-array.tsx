/* eslint-disable array-callback-return */
import { Controller, useFieldArray } from 'react-hook-form';
import {
  FormControl,
  FormLabel,
  Input,
  List,
  ListItem,
  IconButton,
  Flex,
  Tooltip
} from '@chakra-ui/react';
import { FiDelete, FiPlus } from 'react-icons/fi';
import { inputValidationText } from '@/utils/constants/texts';
import { CareerAddModalFormData } from '../modals/career-add-modal';

type DescriptionFieldArrayProps = {
  control: any;
  name: any;
  errors: any;
};

function DescriptionFieldArray({
  control,
  errors,
  name
}: DescriptionFieldArrayProps) {
  const { fields, append, remove } = useFieldArray<CareerAddModalFormData>({
    control,
    name,
    rules: { required: true, minLength: 1 }
  });

  return (
    <>
      <List>
        {fields.map((item, index) => (
          <ListItem key={item.id}>
            <Flex align="flex-end" gap={20} my={5}>
              <Controller
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Açıqlama')
                  },
                  minLength: {
                    value: 5,
                    message:
                      'Açıqlama xanası ən az 5 simvoldan ibarət olmalıdır'
                  }
                }}
                name={
                  `${name}.${index}.description` as keyof CareerAddModalFormData
                }
                render={({ field: { onChange, value } }) => (
                  <FormControl
                    isInvalid={Boolean(
                      errors?.[name]?.[`${index}`]?.description
                    )}
                    isRequired
                    id={`${name}.${index}.description`}
                  >
                    <FormLabel>Açıqlama {index + 1}</FormLabel>
                    <Tooltip
                      hasArrow
                      placement="top-end"
                      label={
                        errors?.[name]?.[`${index}`]?.description
                          ? errors?.[name]?.[`${index}`]?.description.message
                          : ''
                      }
                    >
                      <Input
                        onChange={onChange}
                        value={value}
                        type="text"
                        placeholder="Açıqlama"
                      />
                    </Tooltip>
                  </FormControl>
                )}
              />
              <IconButton
                isRound
                variant="solid"
                onClick={() => remove(index)}
                colorScheme="teal"
                aria-label="Delete"
                fontSize="20px"
                icon={<FiDelete />}
              />
            </Flex>
          </ListItem>
        ))}
      </List>
      <IconButton
        mt={3}
        variant="solid"
        isRound
        onClick={() => append({ description: '' })}
        aria-label="Add"
        fontSize="20px"
        icon={<FiPlus />}
      />
    </>
  );
}

export default DescriptionFieldArray;
