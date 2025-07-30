// 简化的流式测试
const DIFY_API_URL = 'http://dify.solocursor.com/v1';
const API_KEY = 'app-kT8J6V0fhnpIqvXNTKrQgkd8';

async function testStreamSimple() {
  console.log('🔍 开始简化流式测试...');
  
  try {
    const response = await fetch(`${DIFY_API_URL}/workflows/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        inputs: {
          user_question: '简单测试问题'
        },
        response_mode: 'streaming',
        user: 'test-user-' + Date.now(),
      }),
    });

    console.log('响应状态:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ 错误响应:', errorText);
      return;
    }

    console.log('✅ 开始读取流...');
    
    const reader = response.body?.getReader();
    if (!reader) {
      console.log('❌ 无法获取reader');
      return;
    }

    const decoder = new TextDecoder();
    let chunkCount = 0;
    let textChunks = 0;
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        console.log('✅ 流读取完成');
        break;
      }

      chunkCount++;
      const chunk = decoder.decode(value, { stream: true });
      
      // 简单统计
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.includes('text_chunk')) {
          textChunks++;
          console.log(`📝 Text chunk ${textChunks}`);
        } else if (line.includes('workflow_finished')) {
          console.log('🎉 工作流完成');
        }
      }
      
      if (chunkCount % 10 === 0) {
        console.log(`📦 已处理 ${chunkCount} 个数据块`);
      }
    }
    
    console.log(`📊 总计: ${chunkCount} 个数据块, ${textChunks} 个文本块`);
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

testStreamSimple();
