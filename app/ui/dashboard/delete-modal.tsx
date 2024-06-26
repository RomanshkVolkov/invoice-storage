'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

type DeleteAction = (_id: number) => Promise<
  | {
      errors: {};
      message: string;
    }
  | undefined
>;

export default function DeleleteModal({
  id,
  children,
  title,
  deleteAction,
  showDelete = true,
}: {
  id: number;
  children: React.ReactNode;
  title: string;
  deleteAction: DeleteAction;
  showDelete?: boolean;
}) {
  const { onOpenChange } = useDisclosure();
  const router = useRouter();
  return (
    <Modal
      className="max-w-[500px]"
      onOpenChange={onOpenChange}
      onClose={() => router.back()}
      isOpen
    >
      <ModalContent>
        {(_onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>{children}</ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                variant="light"
                onPress={() => router.back()}
              >
                Close
              </Button>
              {showDelete && (
                <DeleteAction id={id} deleteAction={deleteAction} />
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

function DeleteAction({
  id,
  deleteAction,
}: {
  id: number;
  deleteAction: DeleteAction;
}) {
  const router = useRouter();

  const handleDelete = async () => {
    const state = await deleteAction(id);
    if (state?.message) {
      toast.error(state.message);
    } else {
      toast.success('Eliminado correctamente');
    }
    router.back();
  };

  return (
    <form action={handleDelete}>
      <DeleteButton />
    </form>
  );
}

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <Button color="danger" type="submit" isLoading={pending}>
      Eliminar
    </Button>
  );
}
