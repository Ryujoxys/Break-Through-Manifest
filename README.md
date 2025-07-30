# 卡点解惑 - 宇宙智慧问答应用

一个基于React Native + Expo的移动应用，通过AI工作流为用户提供人生困惑的智慧解答。

## ✨ 功能特性

- 🤔 **智能问答**: 输入任何困惑，获得宇宙的智慧回答
- 🌊 **流式输出**: 答案逐字显示，提供流畅的用户体验
- 🎨 **优雅设计**: 简洁的卡片式UI，渐变背景，温和动画
- 📱 **跨平台**: 支持iOS、Android和Web，可在Expo Go中运行
- 🔄 **智能降级**: 自动适配不同环境，确保最佳体验

## 🛠️ 技术栈

- **React Native** - 跨平台移动应用框架
- **Expo** - 开发工具链和平台
- **TypeScript** - 类型安全的JavaScript
- **React Navigation** - 页面导航
- **Expo Linear Gradient** - 渐变背景
- **Dify API** - AI工作流服务

## 🚀 快速开始

### 环境要求

- Node.js 16+
- npm 或 yarn
- Expo CLI
- Expo Go 应用（用于手机测试）

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd bk/app
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npx expo start
   ```

4. **在设备上运行**
   - 下载 Expo Go 应用
   - 扫描终端中的二维码
   - 或按 `w` 在浏览器中打开

## 📱 使用说明

1. **输入问题**: 在主页面输入你的困惑或问题
2. **提交问题**: 点击"提交问题"按钮
3. **观看答案**: 答案会逐字显示，带有流畅的动画效果
4. **继续提问**: 点击"返回提问"继续询问新问题

## 🏗️ 项目结构

```
app/
├── src/
│   ├── screens/          # 页面组件
│   │   ├── InputScreen.tsx    # 问题输入页面
│   │   └── AnswerScreen.tsx   # 答案显示页面
│   ├── components/       # 可复用组件
│   │   ├── CustomButton.tsx   # 自定义按钮
│   │   └── LoadingIndicator.tsx # 加载指示器
│   ├── services/         # API服务
│   │   └── difyApi.ts         # Dify API集成
│   ├── styles/           # 样式文件
│   │   └── globalStyles.ts    # 全局样式
│   └── types/            # TypeScript类型定义
│       └── index.ts
├── App.tsx              # 应用入口
└── package.json         # 项目配置
```

## 🔧 API配置

应用使用Dify工作流API提供智能回答：

- **端点**: `/workflows/run`
- **模式**: 流式输出 (streaming)
- **输入格式**: `{ user_question: string }`
- **响应格式**: Server-Sent Events (SSE)

## 🌟 核心特性

### 流式输出
- 支持真正的流式API调用
- 自动检测环境兼容性
- 智能降级到模拟流式输出
- 跨平台兼容（Web/iOS/Android）

### 用户体验
- 立即响应，无需等待
- 逐字显示答案
- 温和的淡入动画
- 优雅的错误处理

### 技术亮点
- TypeScript类型安全
- 模块化组件设计
- 响应式布局
- 优雅的状态管理

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！

---

*让宇宙的智慧指引你的人生之路* ✨
