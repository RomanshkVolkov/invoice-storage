'use client';
import { Button, ModalBody, useDisclosure } from '@nextui-org/react';
import Form from './upload-form';
import { Modal, ModalContent, ModalFooter } from '@nextui-org/react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

export default function UploadCard() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Form />
    </>
  );
}
