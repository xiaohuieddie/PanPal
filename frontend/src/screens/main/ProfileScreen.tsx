import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const menuItems = [
  {
    icon: 'person-outline',
    title: '个人信息',
    subtitle: '编辑个人资料和健康目标',
  },
  {
    icon: 'restaurant-outline',
    title: '饮食偏好',
    subtitle: '管理菜系偏好和忌口食物',
  },
  {
    icon: 'notifications-outline',
    title: '提醒设置',
    subtitle: '设置用餐和打卡提醒',
  },
  {
    icon: 'analytics-outline',
    title: '健康报告',
    subtitle: '查看详细的营养分析报告',
  },
  {
    icon: 'gift-outline',
    title: '我的奖励',
    subtitle: '查看已获得的优惠券和徽章',
  },
  {
    icon: 'share-outline',
    title: '邀请好友',
    subtitle: '邀请好友一起健康饮食',
  },
  {
    icon: 'help-circle-outline',
    title: '帮助中心',
    subtitle: '常见问题和使用指南',
  },
  {
    icon: 'settings-outline',
    title: '设置',
    subtitle: '账户设置和隐私选项',
  },
];

export default function ProfileScreen() {
  const userInfo = {
    name: '健康用户',
    goal: '减脂瘦身',
    streak: 5,
    totalDays: 18,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* User Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={styles.userName}>{userInfo.name}</Text>
          <Text style={styles.userGoal}>目标：{userInfo.goal}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{userInfo.streak}</Text>
              <Text style={styles.statLabel}>连续天数</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{userInfo.totalDays}</Text>
              <Text style={styles.statLabel}>总打卡</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>奖励数</Text>
            </View>
          </View>
        </View>

        {/* Achievement Cards */}
        <View style={styles.achievementSection}>
          <Text style={styles.sectionTitle}>近期成就</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.achievementScroll}
          >
            <View style={styles.achievementCard}>
              <Text style={styles.achievementIcon}>🔥</Text>
              <Text style={styles.achievementTitle}>连续打卡</Text>
              <Text style={styles.achievementDesc}>5天连续</Text>
            </View>
            <View style={styles.achievementCard}>
              <Text style={styles.achievementIcon}>🎯</Text>
              <Text style={styles.achievementTitle}>营养达标</Text>
              <Text style={styles.achievementDesc}>本周85%</Text>
            </View>
            <View style={styles.achievementCard}>
              <Text style={styles.achievementIcon}>🏆</Text>
              <Text style={styles.achievementTitle}>新手奖励</Text>
              <Text style={styles.achievementDesc}>已获得</Text>
            </View>
          </ScrollView>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <View style={styles.menuIcon}>
                <Ionicons name={item.icon as any} size={24} color="#4CAF50" />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Version Info */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>PanPal v1.0.0</Text>
          <TouchableOpacity style={styles.logoutButton}>
            <Text style={styles.logoutText}>退出登录</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  },
  profileHeader: {
    backgroundColor: 'white',
    paddingTop: 30,
    paddingBottom: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userGoal: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  achievementSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  achievementScroll: {
    paddingHorizontal: 20,
  },
  achievementCard: {
    backgroundColor: 'white',
    width: 120,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementDesc: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  menuSection: {
    backgroundColor: 'white',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  logoutButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF5722',
  },
  logoutText: {
    fontSize: 16,
    color: '#FF5722',
    fontWeight: '500',
  },
});