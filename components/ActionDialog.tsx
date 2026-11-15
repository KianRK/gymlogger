import { Modal, Pressable, StyleSheet, View } from 'react-native';

import CustomText from './CustomText';
import useThemeColors from '@/hooks/UseThemeColors';
import { Fonts, FontSize, Radius, Spacing, shadow } from '@/constants/Theme';

export type DialogAction = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
};

type Props = {
  visible: boolean;
  title: string;
  message?: string;
  actions: DialogAction[];
  onRequestClose?: () => void;
};

/** Centered dialog with a title and a row (or stack) of action buttons. */
export default function ActionDialog({
  visible,
  title,
  message,
  actions,
  onRequestClose,
}: Props) {
  const colors = useThemeColors();
  const stacked = actions.length > 2;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <Pressable
        style={[styles.overlay, { backgroundColor: colors.overlay }]}
        onPress={onRequestClose}
      >
        <Pressable
          style={[
            styles.dialog,
            { backgroundColor: colors.surface },
            shadow(colors.shadow, 3),
          ]}
        >
          <CustomText style={styles.title}>{title}</CustomText>
          {message && (
            <CustomText style={[styles.message, { color: colors.textMuted }]}>
              {message}
            </CustomText>
          )}
          <View style={[styles.actions, stacked && styles.actionsStacked]}>
            {actions.map((action) => {
              const variant = action.variant ?? 'secondary';
              const background =
                variant === 'primary'
                  ? colors.primary
                  : variant === 'danger'
                    ? colors.danger
                    : colors.surfaceAlt;
              const textColor =
                variant === 'secondary' ? colors.text : colors.onPrimary;
              return (
                <Pressable
                  key={action.label}
                  onPress={action.onPress}
                  style={({ pressed }) => [
                    styles.actionButton,
                    !stacked && styles.actionButtonFlex,
                    { backgroundColor: background, opacity: pressed ? 0.8 : 1 },
                  ]}
                >
                  <CustomText style={[styles.actionText, { color: textColor }]}>
                    {action.label}
                  </CustomText>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  dialog: {
    width: '100%',
    maxWidth: 360,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
  },
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSize.title,
    textAlign: 'center',
  },
  message: {
    fontSize: FontSize.body,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
  },
  actionsStacked: { flexDirection: 'column' },
  actionButton: {
    height: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  actionButtonFlex: { flex: 1 },
  actionText: { fontFamily: Fonts.semiBold, fontSize: FontSize.body },
});
