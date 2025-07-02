## 产品需求文档（PRD）

### 产品名称：
PanPal

---

## 一、产品背景与目标

随着健康意识提升，越来越多中国城市用户希望实现科学饮食、控制体重或增肌等目标。但大多数人缺乏营养知识，且工作繁忙，无暇设计菜单与采购食材。我们希望通过AI帮助用户生成个性化每周食谱，并接入本地生鲜平台实现自动化购物，降低健康饮食门槛。

> 🔍 市场洞察：
- 根据艾媒咨询（iiMedia Research）2024年报告，中国健康管理行业市场规模已突破1.1万亿元，其中营养膳食类应用市场年增速超30%。
- QuestMobile 数据显示，健康饮食类APP日活用户中，72%来自一二线城市，56%为20-39岁年轻用户。
- Keep、薄荷健康等平台的用户调研显示，超过60%的用户表示“愿意在家做饭，但缺乏时间规划菜谱和购买食材”。

---

## 二、核心目标（MVP阶段）

1. 获取用户身体状态和饮食目标
2. 生成个性化每周菜单（营养均衡）
3. 自动生成购物清单并跳转采购平台
4. 支持每日打卡机制
5. 完成挑战后给予真实激励（如代金券）
6. 构建激励闭环与初步用户社区氛围

---

## 三、目标用户

- 一线及新一线城市年轻上班族（20–40岁）
- 注重健康但缺乏营养知识与时间规划
- 有一定烹饪能力或愿意尝试在家做饭
- 追求效率、性价比与个性化体验
- 健身、控糖控脂、素食等人群细分垂类

---

## 四、用户流程概述

1. 进入欢迎页，一键微信登录
2. 引导式问答收集用户信息：
   - 性别、年龄、身高体重、目标
   - 偏好菜系、忌口食材、过敏项
   - 每次做饭时间预期
3. 系统生成一周菜单（每日三餐）
4. 菜谱详情页可查看营养值、步骤、所需食材、推荐视频
5. 一键生成购物清单，跳转盒马/美团买菜等平台下单
6. 用户每日做饭后打卡（拍照或按钮）
7. 连续完成7天，解锁奖励：外卖/生鲜平台代金券
8. 用户可浏览社区食谱、排行榜、热门短视频

---

## 五、功能模块

### 1. 用户注册与基础信息录入
- 微信/手机号登录
- Onboarding 引导式问答：
  - 性别、年龄段、身高体重、体脂率（选填）
  - 健康目标：减脂、增肌、控糖、维持
  - 饮食偏好：川菜、家常、轻食、健身风、素食
  - 忌口与过敏项：自动排除食谱
  - 每次可花时间做饭：<15分钟 / 15-30分钟 / >30分钟

### 2. 菜谱生成系统
- 初期基于规则系统 + 标签分类（逐步支持AI个性推荐）
- 每日三餐推荐，显示：菜名、图文步骤、所需食材、营养信息（热量/蛋白/脂肪/碳水）
- 每道菜可“换一换”获取替代推荐
- 可设置预算档位：经济 / 标准 / 高端

### 3. 食材清单与采购跳转
- 自动将菜单中所需食材汇总成购物清单
- 用户可点击“一键跳转”至：
  - 盒马
  - 美团买菜
  - 京东到家（后期）
- 跳转支持带上商品参数、返佣码、记录点击率
- 每周计划支持“打印版”/“PDF导出”

### 4. 打卡与激励机制（核心留存手段）
- 每日打卡形式：点击“已完成”或上传做饭照片
- 记录连续打卡天数，形成仪式感与视觉反馈（如“火苗图标”）
- 每完成一个阶段挑战（如7天、14天）可获得：
  - 外卖平台代金券（美团10元券）
  - 生鲜平台优惠码（盒马88折）
  - 商家联名产品优惠
  - 成就徽章系统（“减脂达人”等）
- 用户可分享挑战成果图到朋友圈/小红书

### 5. 社区/内容平台化构思（中期扩展）
- 用户可浏览别人打卡图，点赞评论
- 热门菜单挑战（如“本周复刻最高的10道菜”）
- 平台食谱创作者入驻计划（可连接美食博主）
- 用户点击菜谱页支持“一键下单同款食材”

---

## 六、数据指标（MVP验证目标）

- 注册转化率 > 40%
- 一周后留存率 > 25%
- 菜谱点击转化率 > 50%
- 购物清单跳转点击率 > 30%
- 打卡完成率（连续7天） > 10%
- 奖励兑换完成率 > 8%
- 用户NPS评分 > 65

---

## 七、版本计划（MVP）

### V0.1
- 用户问卷式设置
- 每周菜单生成
- 静态食材清单页面
- 打卡按钮功能初步上线

### V0.2
- 接入购物跳转链接
- 每日打卡记录系统
- 奖励机制上线（手动发放）
- 微信/短信代金券推送

### V1.0
- 内容推荐模块上线
- 自动化代金券发放接口接入
- 社区浏览、分享机制试水
- 排行榜挑战页上线

---

## English Version (Expanded)

### Product Name:
PanPal

---

## 1. Product Background & Vision

As health awareness continues to grow in China, more urban dwellers seek to eat scientifically to lose weight, build muscle, or manage chronic conditions. However, many lack nutritional knowledge, time to plan meals, or energy to shop regularly. This product leverages AI to generate personalized weekly menus based on user health metrics and goals, and links to local grocery platforms (e.g. Hema, Meituan) to enable one-click shopping.

> 🔍 Market Insight:
- According to iiMedia Research (2024), China's health management industry exceeds 1.1 trillion RMB, with the dietary and nutrition sector growing at over 30% annually.
- QuestMobile reports that over 72% of healthy diet app users live in Tier 1–2 cities, and 56% are aged 20–39.
- Surveys from Keep and Boohee (薄荷健康) show 60%+ users say: "I want to cook at home but lack the time to plan and buy groceries."

---

## 2. MVP Goals

1. Collect user body stats, goals, and dietary preferences
2. Generate AI-powered personalized weekly menus
3. Auto-generate shopping list + link to Hema/Meituan
4. Allow simple daily check-in mechanism
5. Reward consistent users with real-world coupons
6. Establish early-stage user retention and lightweight community

---

## 3. Target Users

- Urban professionals aged 20–40 in Tier 1 and 2 cities
- Health-conscious, time-limited individuals
- Open to home cooking if simplified
- Interested in personalization, saving money, and better food
- Niche groups: gym-goers, diabetics, vegetarians, clean eaters

---

## 4. MVP User Journey

1. Welcome screen → WeChat login
2. Smart onboarding Q&A:
   - Age, gender, height, weight, (body fat optional)
   - Goal: lose fat, gain muscle, control sugar, maintain
   - Cuisine preference, allergens, dislikes
   - Expected time to cook: <15 / 15–30 / >30 mins
3. AI generates 7-day menu (3 meals/day)
4. Recipe view shows ingredients, cooking steps, nutrition info, and demo videos
5. One-click shopping list → jump to Hema/Meituan/JD Home
6. Daily check-in by photo or tap
7. After 7-day streak → unlock rewards:
   - Meituan/Hema coupon
   - Badges, leaderboards, challenge tracker
8. Optional: browse trending meals, social feed, or content hub

---

## 5. Feature Modules

### 1. Registration & Health Setup
- Login via WeChat or mobile
- Smart Q&A intake:
  - Gender, age group, height, weight, (body fat optional)
  - Health goal: lose fat, build muscle, control sugar
  - Cuisine styles: Chinese, light food, fitness-style, vegetarian
  - Dislikes and allergies
  - Time willing to spend per meal

### 2. Meal Plan Generator
- Rule-based system in MVP, AI-driven in later phases
- Each meal contains:
  - Name, ingredients, image/video tutorial, nutrition (kcal, protein, fat, carbs)
- User can swap dishes easily
- Support pricing tiers: budget / standard / premium

### 3. Grocery List + Platform Linking
- Automatically compile grocery list for weekly plan
- One-click redirect to:
  - Hema Fresh
  - Meituan Grocery
  - JD Home (future)
- Redirect includes referral tracking, item list auto-filled
- Export PDF / print-friendly weekly plan

### 4. Check-In & Reward System
- Daily meal check-in via tap or photo
- Visual feedback for streaks (fire icons, charts, etc.)
- After 7/14-day streaks, user unlocks:
  - Meituan 10 RMB coupons
  - Hema 12% off code
  - Cross-brand promos
  - Achievement badges (e.g. "Fat Loss Pro")
- Optional social sharing to Xiaohongshu/WeChat

### 5. Light Community / Content (Future Expansion)
- Browse popular meals
- See others' check-in records, leave comments
- Creator Program: invite foodie influencers
- One-click "Buy Same Ingredients" from shared recipes

---

## 6. MVP Metrics for Success

- Registration conversion > 40%
- 7-day retention > 25%
- Recipe CTR > 50%
- Grocery jump CTR > 30%
- Check-in completion > 10%
- Coupon redemption rate > 8%
- User NPS > 65

---

## 7. Release Roadmap

### V0.1
- Health intake Q&A
- Weekly menu generation
- Static grocery list display
- Basic check-in button

### V0.2
- Grocery link integration
- Streak tracker + local data logging
- Manual coupon dispatch via WeChat/SMS

### V1.0
- Content recommendation module
- Auto-coupon API integration
- Community feed + leaderboard challenge page

