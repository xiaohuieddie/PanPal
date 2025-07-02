import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const mockCheckIns = [
  { date: '2024-07-01', breakfast: true, lunch: true, dinner: false },
  { date: '2024-06-30', breakfast: true, lunch: true, dinner: true },
  { date: '2024-06-29', breakfast: true, lunch: false, dinner: true },
  { date: '2024-06-28', breakfast: true, lunch: true, dinner: true },
  { date: '2024-06-27', breakfast: false, lunch: true, dinner: true },
  { date: '2024-06-26', breakfast: true, lunch: true, dinner: true },
  { date: '2024-06-25', breakfast: true, lunch: true, dinner: true },
];

const mockRewards = [
  {
    id: 1,
    title: '美团外卖代金券',
    description: '10元无门槛代金券',
    icon: '🍜',
    unlocked: true,
    claimed: false,
    requirement: '连续打卡7天',
  },
  {
    id: 2,
    title: '盒马生鲜优惠券',
    description: '88折购物券',
    icon: '🛒',
    unlocked: false,
    claimed: false,
    requirement: '连续打卡14天',
  },
  {
    id: 3,
    title: '健身达人徽章',
    description: '专属成就徽章',
    icon: '🏆',
    unlocked: false,
    claimed: false,
    requirement: '连续打卡30天',
  },
];

export default function CheckInScreen() {
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const currentStreak = 5;
  const totalCheckIns = 18;

  const handleMealCheckIn = (mealType: string) => {
    Alert.alert(
      '打卡确认',
      `确认完成${mealType}打卡？`,
      [
        { text: '取消', style: 'cancel' },
        { text: '确认', onPress: () => console.log(`${mealType} checked in`) },
      ]
    );
  };

  const handleClaimReward = (reward: any) => {
    setSelectedReward(reward);
    setShowRewardModal(true);
  };

  const confirmClaimReward = () => {
    if (selectedReward) {
      Alert.alert('奖励已领取', '恭喜您获得了' + selectedReward.title + '！');
      setShowRewardModal(false);
      setSelectedReward(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Stats */}
        <LinearGradient
          colors={['#4CAF50', '#8BC34A']}
          style={styles.statsCard}
        >
          <View style={styles.statsContent}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{currentStreak}</Text>
              <Text style={styles.statLabel}>连续天数</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalCheckIns}</Text>
              <Text style={styles.statLabel}>总打卡数</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>75%</Text>
              <Text style={styles.statLabel}>完成率</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Today's Check-in */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>今日打卡</Text>
          <View style={styles.todayCheckIn}>
            <TouchableOpacity
              style={[styles.mealCheckIn, styles.completed]}
              onPress={() => handleMealCheckIn('早餐')}
            >
              <Text style={styles.mealIcon}>🌅</Text>
              <Text style={styles.mealText}>早餐</Text>
              <Text style={styles.checkMark}>✓</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.mealCheckIn, styles.completed]}
              onPress={() => handleMealCheckIn('午餐')}
            >
              <Text style={styles.mealIcon}>☀️</Text>
              <Text style={styles.mealText}>午餐</Text>
              <Text style={styles.checkMark}>✓</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.mealCheckIn}
              onPress={() => handleMealCheckIn('晚餐')}
            >
              <Text style={styles.mealIcon}>🌙</Text>
              <Text style={styles.mealText}>晚餐</Text>
              <Text style={styles.pendingText}>待打卡</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Weekly Calendar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>本周打卡记录</Text>
          <View style={styles.calendarContainer}>
            {mockCheckIns.slice(0, 7).map((day, index) => (
              <View key={index} style={styles.calendarDay}>
                <Text style={styles.dayLabel}>
                  {new Date(day.date).toLocaleDateString('zh-CN', { weekday: 'short' })}
                </Text>
                <View style={styles.dayCheckIns}>
                  <View style={[styles.checkDot, day.breakfast && styles.completedDot]} />
                  <View style={[styles.checkDot, day.lunch && styles.completedDot]} />
                  <View style={[styles.checkDot, day.dinner && styles.completedDot]} />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Rewards Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>奖励中心</Text>
          <View style={styles.rewardsContainer}>
            {mockRewards.map((reward) => (
              <View key={reward.id} style={styles.rewardCard}>
                <View style={styles.rewardIcon}>
                  <Text style={styles.rewardIconText}>{reward.icon}</Text>
                </View>
                <View style={styles.rewardInfo}>
                  <Text style={styles.rewardTitle}>{reward.title}</Text>
                  <Text style={styles.rewardDescription}>{reward.description}</Text>
                  <Text style={styles.rewardRequirement}>{reward.requirement}</Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.rewardButton,
                    reward.unlocked ? styles.unlockedButton : styles.lockedButton,
                  ]}
                  onPress={() => reward.unlocked && handleClaimReward(reward)}
                >
                  <Text
                    style={[
                      styles.rewardButtonText,
                      reward.unlocked ? styles.unlockedButtonText : styles.lockedButtonText,
                    ]}
                  >
                    {reward.claimed ? '已领取' : reward.unlocked ? '立即领取' : '未解锁'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Motivational Quote */}
        <View style={styles.section}>
          <View style={styles.quoteCard}>
            <Text style={styles.quoteText}>
              "坚持不是为了感动谁，而是为了让自己知道，自己可以做到。"
            </Text>
            <Text style={styles.quoteAuthor}>— 继续加油！</Text>
          </View>
        </View>
      </ScrollView>

      {/* Reward Claim Modal */}
      <Modal
        visible={showRewardModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRewardModal(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>领取奖励</Text>
            {selectedReward && (
              <>
                <Text style={styles.modalRewardIcon}>{selectedReward.icon}</Text>
                <Text style={styles.modalRewardTitle}>{selectedReward.title}</Text>
                <Text style={styles.modalRewardDescription}>
                  {selectedReward.description}
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalCancelButton}
                    onPress={() => setShowRewardModal(false)}
                  >
                    <Text style={styles.modalCancelText}>取消</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalConfirmButton}
                    onPress={confirmClaimReward}
                  >
                    <Text style={styles.modalConfirmText}>确认领取</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsCard: {
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 24,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  todayCheckIn: {
    gap: 12,
  },
  mealCheckIn: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  completed: {
    backgroundColor: '#E8F5E8',
  },
  mealIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  mealText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  checkMark: {
    fontSize: 20,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  pendingText: {
    fontSize: 14,
    color: '#666',
  },
  calendarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  calendarDay: {
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  dayCheckIns: {
    gap: 4,
  },
  checkDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
  },
  completedDot: {
    backgroundColor: '#4CAF50',
  },
  rewardsContainer: {
    gap: 12,
  },
  rewardCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  rewardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rewardIconText: {
    fontSize: 24,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  rewardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  rewardRequirement: {
    fontSize: 12,
    color: '#999',
  },
  rewardButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  unlockedButton: {
    backgroundColor: '#4CAF50',
  },
  lockedButton: {
    backgroundColor: '#E0E0E0',
  },
  rewardButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  unlockedButtonText: {
    color: 'white',
  },
  lockedButtonText: {
    color: '#999',
  },
  quoteCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quoteText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  quoteAuthor: {
    fontSize: 14,
    color: '#666',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  modalRewardIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  modalRewardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  modalRewardDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#666',
  },
  modalConfirmButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
  },
  modalConfirmText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});