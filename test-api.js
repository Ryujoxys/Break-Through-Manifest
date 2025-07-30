// 简单的API测试脚本
const DIFY_API_URL = 'http://dify.solocursor.com/v1';
const API_KEY = 'app-kT8J6V0fhnpIqvXNTKrQgkd8';

async function testDifyAPI() {
  try {
    console.log('开始测试Dify API...');
    
    const response = await fetch(`${DIFY_API_URL}/workflows/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        inputs: {
          user_question: '你好，这是一个工作流流式测试'
        },
        response_mode: 'streaming',
        user: 'test-user-' + Date.now(),
      }),
    });

    console.log('响应状态:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('错误响应:', errorText);
      return;
    }

    // 处理流式响应
    const reader = response.body?.getReader();
    if (!reader) {
      console.log('❌ 流式响应不可用');
      return;
    }

    console.log('✅ 开始接收流式数据...\n');

    const decoder = new TextDecoder();
    let buffer = '';
    let chunkCount = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        console.log('\n✅ 流式响应完成');
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          chunkCount++;
          try {
            const data = JSON.parse(line.slice(6));
            console.log(`📦 Chunk ${chunkCount}:`, JSON.stringify(data, null, 2));
          } catch (e) {
            console.log(`📦 Chunk ${chunkCount} (raw):`, line);
          }
        } else if (line.trim()) {
          console.log('📝 其他数据:', line);
        }
      }
    }
    
  } catch (error) {
    console.error('测试失败:', error);
  }
}

testDifyAPI();
