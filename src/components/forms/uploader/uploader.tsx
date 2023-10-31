import { useEffect, useState } from 'react';
import { Box, Flex, Heading, Image, useToast } from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import { FiDelete } from 'react-icons/fi';

interface UploaderProps {
  accept: string[];
  limit: number;
  aspectRatio?: number;
  defaultValues?: File[];
  // eslint-disable-next-line no-unused-vars
  onChange?: (uploadedFiles: File[]) => void;
}

function Uploader({
  accept,
  defaultValues,
  onChange,
  limit,
  aspectRatio
}: UploaderProps) {
  const toast = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>(
    defaultValues || []
  );

 const validateAspectRatio = (file: File) => {
    if (!aspectRatio) return true;

    return new Promise<boolean>((resolve) => {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;

        const minWidth = 1500;
        const minHeight = 2000;

        const isValidWidth = width >= minWidth;
        const isValidHeight = height >= minHeight;

        resolve(isValidWidth && isValidHeight);
      };
    });
  };

  const validateFile = (file: File) => {
    const isValidType = accept.includes(file.type);
    if (!isValidType) {
      toast({
        title: 'Xətalı format',
        description: `Dəstəklənməyən bir sənəd yükləməyə cəhd etdiniz: ${file.type}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
    return isValidType;
  };
  const onDrop = (acceptedFiles: File[]) => {
    console.log(acceptedFiles, 'tofiq');

    const isValidFiles = acceptedFiles.filter(validateFile);

    if (aspectRatio) {
      const validAspectFiles = isValidFiles.filter(validateAspectRatio);
      if (validAspectFiles.length !== isValidFiles.length) {
        toast({
          title: 'Səhv fayl ölçüsü',
          description: `İstənilən en-uzunluq faizi (${aspectRatio}).`,
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      }
      setUploadedFiles([...uploadedFiles, ...validAspectFiles]);
    } else {
      setUploadedFiles([...uploadedFiles, ...isValidFiles]);
    }
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/jpg': [],
      'image/gif': [],
      'image/zip': [],
      'image/pdf': [],
      'image/docx': [],
      'image/doc': [],
      'image/xls': []
    },
    maxFiles: limit,
    disabled: uploadedFiles?.length >= limit
  });

  const renderPreview = () => {
    if (uploadedFiles.length === 0) return null;

    return uploadedFiles.map((file: any) => (
      <Box
        border="1px solid black"
        borderRadius="md"
        p={1}
        w={100}
        mr={2}
        h={100}
        key={file.name}
        mt={3}
        pos="relative"
      >
        <Box
          cursor="pointer"
          onClick={() => {
            const filteredData = uploadedFiles?.filter(
              (z: any) => z.path !== file?.path
            );
            setUploadedFiles(filteredData);
          }}
          bg="white"
          pos="absolute"
          top="-5px"
          right="-5px"
          zIndex="1"
        >
          <FiDelete />
        </Box>

        <Image
          w="100%"
          objectFit="contain"
          h="100%"
          src={URL.createObjectURL(file)}
          alt={file.name}
        />
      </Box>
    ));
  };

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    onChange && onChange(uploadedFiles);
  }, [uploadedFiles]);

  useEffect(() => {
    if (defaultValues && defaultValues.length > 0) {
      // If defaultValues prop is provided, update the uploadedFiles state
      setUploadedFiles(defaultValues);
    }
  }, [defaultValues]);

  return (
    <Box cursor="pointer" border="1px dashed black" borderRadius="md" p={4}>
      <Flex
        {...getRootProps()}
        flexDir="column"
        align="center"
        justify="center"
      >
        <div>
          <input {...getInputProps()} />
          <Flex flexDir="column" align="center" justify="center">
            <Heading size="sm">
              Faylları bura daşıyın və ya yükləmək üçün klikləyin (icazə verilən
              limit - {limit?.toString()})
            </Heading>
          </Flex>
        </div>
      </Flex>

      <Flex> {renderPreview()}</Flex>
    </Box>
  );
}

export default Uploader;
