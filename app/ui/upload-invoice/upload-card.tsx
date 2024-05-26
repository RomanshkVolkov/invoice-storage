'use client';
import { Button, ModalBody, useDisclosure } from '@nextui-org/react';
import Form from './upload-form';
import { Modal, ModalContent, ModalFooter } from '@nextui-org/react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

export default function UploadCard() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button className="" onClick={onOpen}>
        <CloudArrowUpIcon className="h-6 w-6" />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <Form />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onClick={onClose}>
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
