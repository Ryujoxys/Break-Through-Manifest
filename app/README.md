# 卡点解惑 - React Native App

一个基于Expo的移动应用，帮助用户通过AI获得人生困惑的解答。

## 功能特性

- 🤔 **问题输入**: 用户可以输入任何困惑或问题
- 🌌 **AI解答**: 通过Dify API获取智慧回答
- 🎨 **优雅UI**: 简洁的卡片式设计，渐变背景
- ✨ **动画效果**: 温和的淡入动画增强用户体验
- 📱 **移动优化**: 完全适配移动设备，支持Expo Go

## 技术栈

- **React Native** - 跨平台移动应用框架
- **Expo** - 开发工具链和平台
- **TypeScript** - 类型安全的JavaScript
- **React Navigation** - 页面导航
- **Expo Linear Gradient** - 渐变背景
- **Dify API** - AI问答服务

## 项目结构

```
src/
├── screens/          # 页面组件
│   ├── InputScreen.tsx    # 问题输入页面
│   └── AnswerScreen.tsx   # 答案显示页面
├── components/       # 可复用组件
│   ├── CustomButton.tsx   # 自定义按钮
│   └── LoadingIndicator.tsx # 加载指示器
├── services/         # API服务
│   └── difyApi.ts         # Dify API集成
├── styles/           # 样式文件
│   └── globalStyles.ts    # 全局样式
└── types/            # TypeScript类型定义
    └── index.ts
```

## 快速开始

1. **安装依赖**
   ```bash
   npm install
   ```

2. **启动开发服务器**
   ```bash
   npx expo start
   ```

3. **在设备上运行**
   - 下载 Expo Go 应用
   - 扫描终端中显示的二维码
   - 或者按 `i` 在iOS模拟器中打开
   - 或者按 `a` 在Android模拟器中打开

## 使用说明

1. **输入问题**: 在主页面的文本框中输入你的困惑
2. **提交问题**: 点击"提交问题"按钮
3. **等待回答**: 系统会显示加载动画，通常在10秒内返回结果
4. **查看答案**: 在答案页面查看宇宙的智慧回答
5. **返回提问**: 点击"返回提问"继续询问新问题

## 开发说明

- 使用TypeScript确保代码质量
- 遵循React Native最佳实践
- 响应式设计适配不同屏幕尺寸
- 错误处理和用户友好的提示信息
- 优雅的加载状态和动画效果
