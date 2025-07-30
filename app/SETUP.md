# 项目配置说明

## 环境变量配置

为了保护API密钥等敏感信息，本项目使用环境变量进行配置。

### 1. 复制环境变量模板

```bash
cp .env.example .env
```

### 2. 编辑 `.env` 文件

```bash
# Dify API 配置
EXPO_PUBLIC_DIFY_API_URL=你的Dify服务器地址
EXPO_PUBLIC_DIFY_API_KEY=你的Dify应用API密钥

# 开发模式配置
EXPO_PUBLIC_USE_MOCK_DATA=false
```

### 3. 获取Dify API配置

1. 登录你的Dify控制台
2. 找到你的工作流应用
3. 在应用设置中找到API访问配置
4. 复制API密钥和服务器地址

### 4. 环境变量说明

- `EXPO_PUBLIC_DIFY_API_URL`: Dify API服务器地址
- `EXPO_PUBLIC_DIFY_API_KEY`: Dify应用的API密钥
- `EXPO_PUBLIC_USE_MOCK_DATA`: 是否使用模拟数据（true/false）

### 5. 安全注意事项

- ⚠️ **绝对不要**将 `.env` 文件提交到Git仓库
- ✅ `.env` 文件已被添加到 `.gitignore` 中
- ✅ 只提交 `.env.example` 作为配置模板
- 🔒 API密钥应该保密，不要在代码中硬编码

### 6. 部署配置

在生产环境中，请通过平台的环境变量设置功能配置这些变量：

- **Vercel**: 在项目设置的Environment Variables中添加
- **Netlify**: 在Site settings的Environment variables中添加
- **Expo EAS**: 使用 `eas.json` 配置环境变量

## 故障排除

### API密钥未设置
如果看到警告 "DIFY API密钥未设置"，请检查：
1. `.env` 文件是否存在
2. `EXPO_PUBLIC_DIFY_API_KEY` 是否正确设置
3. 重启开发服务器

### API调用失败
如果API调用失败，应用会自动降级到模拟数据模式，确保用户体验不受影响。
