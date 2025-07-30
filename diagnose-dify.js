// Dify API 诊断工具
const DIFY_API_URL = 'http://dify.solocursor.com/v1';
const API_KEY = 'app-kT8J6V0fhnpIqvXNTKrQgkd8';

async function diagnoseDifyAPI() {
  console.log('🔍 开始诊断Dify API配置...\n');
  
  // 1. 测试服务器连接
  console.log('1️⃣ 测试服务器连接...');
  try {
    const response = await fetch(DIFY_API_URL.replace('/v1', ''));
    console.log(`✅ 服务器响应: ${response.status} ${response.statusText}`);
  } catch (error) {
    console.log(`❌ 服务器连接失败: ${error.message}`);
    return;
  }
  
  // 2. 测试API密钥格式
  console.log('\n2️⃣ 检查API密钥格式...');
  if (API_KEY.startsWith('app-')) {
    console.log('✅ API密钥格式正确 (app-xxx)');
  } else {
    console.log('❌ API密钥格式可能不正确，应该以 "app-" 开头');
  }
  
  // 3. 测试不同的API端点
  console.log('\n3️⃣ 测试不同的API端点...');
  
  const endpoints = [
    { name: 'completion-messages', path: '/completion-messages' },
    { name: 'chat-messages', path: '/chat-messages' }
  ];
  
  for (const endpoint of endpoints) {
    console.log(`\n📡 测试 ${endpoint.name} 端点...`);
    
    try {
      const testData = endpoint.name === 'chat-messages' ? {
        inputs: {},
        query: '测试',
        response_mode: 'blocking',
        conversation_id: '',
        user: 'test-user'
      } : {
        inputs: { query: '测试' },
        response_mode: 'blocking',
        user: 'test-user'
      };
      
      const response = await fetch(`${DIFY_API_URL}${endpoint.path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(testData),
      });
      
      const responseText = await response.text();
      console.log(`状态: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        console.log('✅ 成功！');
        console.log('响应:', responseText.substring(0, 200) + '...');
      } else {
        console.log('❌ 失败');
        console.log('错误响应:', responseText);
        
        try {
          const errorData = JSON.parse(responseText);
          console.log(`错误代码: ${errorData.code}`);
          console.log(`错误信息: ${errorData.message}`);
        } catch (e) {
          // 忽略JSON解析错误
        }
      }
    } catch (error) {
      console.log(`❌ 请求失败: ${error.message}`);
    }
  }
  
  // 4. 提供解决建议
  console.log('\n💡 解决建议:');
  console.log('1. 检查Dify控制台中的应用状态');
  console.log('2. 确认应用已发布并启用API访问');
  console.log('3. 验证API密钥是否正确且未过期');
  console.log('4. 检查应用类型是否与API端点匹配');
  console.log('5. 确认服务器地址是否正确');
}

diagnoseDifyAPI().catch(console.error);
