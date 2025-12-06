import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Linking,
  Image,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/theme';
import { useRouter } from 'expo-router';
import { NoteStorageService } from '@/services/noteStorage';
import { ExportService } from '@/services/exportService';
import { GradientHeader } from '@/components/GradientHeader';
import { GradientFooterButton } from '@/components/GradientFooterButton';
import { GlassCard } from '@/components/GlassCard';

export default function SettingsPage() {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleExportAsFile = async () => {
    try {
      const { fileName } = await ExportService.exportAsFile();
      Alert.alert('Export complete', `Saved export file:\n\n${fileName}`);
    } catch (error) {
      console.error('Error exporting notes as file:', error);
      Alert.alert('Error', 'Failed to export notes as file.');
    }
  };

  const handleShareNotes = async () => {
    try {
      await ExportService.shareViaShareSheet();
    } catch (error) {
      console.error('Error sharing notes:', error);
      Alert.alert('Error', 'Failed to share notes.');
    }
  };

  const handleDeleteAllNotes = () => {
    console.log('Delete All Notes button pressed');
    setShowConfirmModal(true);
  };

  const handleBack = () => {
    if (router.canGoBack?.()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const confirmDelete = async () => {
    console.log('Delete confirmed');
    setShowConfirmModal(false);
    setIsDeleting(true);
    try {
      await NoteStorageService.deleteAllNotes();
      console.log('Notes deleted successfully');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        handleBack();
      }, 2000);
    } catch (error) {
      console.error('Error deleting notes:', error);
      Alert.alert('Error', 'Failed to delete notes');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    console.log('Delete cancelled');
    setShowConfirmModal(false);
  };

  const menuItems = [
    {
      icon: '📁',
      title: 'Export notes (file)',
      useImage: false,
      imageSource: null,
      action: handleExportAsFile,
    },
    {
      icon: '📤',
      title: 'Share notes',
      useImage: false,
      imageSource: null,
      action: handleShareNotes,
    },
    {
      icon: '🎧',
      title: 'Online Customer',
      useImage: true,
      imageSource: require('@/assets/images/icons/headphone-icon.png'),
      action: () => Linking.openURL('https://support.example.com'),
    },
    {
      icon: '📜',
      title: 'User Agreement',
      useImage: true,
      imageSource: require('@/assets/images/icons/agreement.png'),
      action: () => Linking.openURL('https://example.com/terms'),
    },
    {
      icon: '🔒',
      title: 'Privacy Policy',
      useImage: true,
      imageSource: require('@/assets/images/icons/policy.png'),
      action: () => Linking.openURL('https://example.com/privacy'),
    },
    {
      icon: 'ℹ️',
      title: 'About Us',
      useImage: true,
      imageSource: require('@/assets/images/icons/about-us.png'),
      action: () => Alert.alert('About', 'Notes App v1.0.0'),
    },
  ];

  return (
    <LinearGradient
      colors={COLORS.backgroundGradient}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <GradientHeader
        title="Settings"
        showBackButton
        onBackPress={handleBack}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={item.action}
          >
            <GlassCard style={styles.menuItem}>
              <View style={styles.menuLeft}>
                {item.useImage && item.imageSource ? (
                  <Image source={item.imageSource} style={styles.iconImage} />
                ) : (
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                )}
                <Text style={styles.menuTitle}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.accentPink} />
            </GlassCard>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <GradientFooterButton
        label={isDeleting ? 'Deleting...' : 'Delete All Notes'}
        disabled={isDeleting}
        variant="danger"
        onPress={handleDeleteAllNotes}
      />

      {showToast && (
        <LinearGradient
          colors={COLORS.toastGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.toast}
        >
          <Text style={styles.toastText}>All notes have been cleared</Text>
        </LinearGradient>
      )}

      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete All Notes</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete all notes? This action cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={cancelDelete}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteModalButton]}
                onPress={confirmDelete}
              >
                <Text style={styles.deleteModalButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  menuItem: {
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuIcon: {
    fontSize: 20,
  },
  iconImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  menuTitle: {
    fontSize: 16,
    color: COLORS.primaryText,
    fontWeight: '500',
    paddingLeft: 18,
  },
  menuArrow: {
    fontSize: 24,
    color: COLORS.accentPink,
  },
  toast: {
    position: 'absolute',
    bottom: 140,
    left: '20%',
    width: '60%',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  toastText: {
    color: COLORS.primaryText,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.modalOverlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.modalBackground,
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: COLORS.modalMessageText,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.ghostButtonBackground,
  },
  cancelButtonText: {
    color: COLORS.primaryText,
    fontSize: 16,
    fontWeight: '600',
  },
  deleteModalButton: {
    backgroundColor: COLORS.destructive,
  },
  deleteModalButtonText: {
    color: COLORS.primaryText,
    fontSize: 16,
    fontWeight: '600',
  },
});