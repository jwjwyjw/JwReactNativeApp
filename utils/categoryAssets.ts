import { NoteCategory } from '@/types/note';

export const getCategoryIcon = (category: NoteCategory) => {
  switch (category) {
    case NoteCategory.WORK_STUDY:
      return require('@/assets/images/icons/work.png');
    case NoteCategory.LIFE:
      return require('@/assets/images/icons/life.png');
    case NoteCategory.HEALTH:
      return require('@/assets/images/icons/health.png');
    default:
      return require('@/assets/images/icons/work.png');
  }
};

export const getCategoryAvatar = (category: NoteCategory) => {
  switch (category) {
    case NoteCategory.WORK_STUDY:
      return require('@/assets/images/avatars/work-avatar.png');
    case NoteCategory.LIFE:
      return require('@/assets/images/avatars/life-avatar.png');
    case NoteCategory.HEALTH:
      return require('@/assets/images/avatars/health-avatar.png');
    default:
      return null;
  }
};

export const getAvatarBackgroundColor = (category: NoteCategory): string => {
  switch (category) {
    case NoteCategory.WORK_STUDY:
      return '#C6F0D0'; // soft green
    case NoteCategory.LIFE:
      return '#CFE5FF'; // soft blue
    case NoteCategory.HEALTH:
      return '#FFE3B8'; // soft yellow
    default:
      return 'rgba(255, 255, 255, 0.2)';
  }
};
