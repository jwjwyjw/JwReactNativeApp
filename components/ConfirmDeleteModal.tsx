import React from 'react';
import { AppModal } from './AppModal';

interface ConfirmDeleteModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteModal({
  visible,
  title = 'Delete Note',
  message = 'Are you sure you want to delete this note?',
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) {
  return (
    <AppModal
      visible={visible}
      title={title}
      message={message}
      onRequestClose={onCancel}
      buttons={[
        { label: 'Cancel', variant: 'secondary', onPress: onCancel },
        { label: 'Delete', variant: 'destructive', onPress: onConfirm },
      ]}
    />
  );
}
