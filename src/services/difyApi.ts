const DIFY_API_URL = 'http://dify.solocursor.com/v1';
const API_KEY = 'app-kT8J6V0fhnpIqvXNTKrQgkd8';

// 开发模式标志 - 设置为false来尝试真实API
const USE_MOCK_DATA = false;
export interface DifyResponse {
  answer: string;
  conversation_id?: string;
  message_id?: string;
}

export class DifyApiService {
  private static async makeRequest(endpoint: string, data: any): Promise<Response> {
    const url = `${DIFY_API_URL}${endpoint}`;
    console.log('请求URL:', url);
    console.log('请求数据:', JSON.stringify(data, null, 2));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(data),
    });

    console.log('响应状态:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('错误响应内容:', errorText);
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response;
  }

  static async askQuestionStream(
    question: string,
    onChunk: (chunk: string) => void,
    onComplete: (fullAnswer: string) => void
  ): Promise<void> {
    // 如果使用模拟数据模式
    if (USE_MOCK_DATA) {
      console.log('使用模拟数据模式 - 流式输出');
      const mockAnswers = [
        "宇宙的智慧告诉我们，每一个困惑都是成长的机会。当你感到迷茫时，不妨静下心来，倾听内心的声音。答案往往就在你的心中，只是需要时间去发现。",
        "生命就像一条河流，有时平静，有时湍急。你现在遇到的困难，正是宇宙在考验你的智慧和勇气。相信自己，相信过程，一切都会在最合适的时间得到解答。",
        "每个人都有自己的人生节奏，不要因为别人的步伐而焦虑。宇宙为每个人安排的道路都是独特的，你只需要专注于自己的成长，答案自然会显现。",
        "困惑是智慧的开始。当你开始质疑、思考、探索时，你已经踏上了觉醒的道路。保持好奇心，保持开放的心态，宇宙会引导你找到属于你的答案。",
        "静心聆听内在的声音，它会为你指引方向。每一次困惑都是宇宙给你的礼物，帮助你更深入地了解自己和这个世界。",
        "相信过程，相信时机。有些答案需要时间才能显现，就像种子需要时间才能发芽。耐心等待，答案会在最合适的时候到来。"
      ];

      const answer = mockAnswers[Math.floor(Math.random() * mockAnswers.length)];

      // 模拟流式输出
      let currentText = '';
      const words = answer.split('');

      for (let i = 0; i < words.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 50)); // 50ms延迟
        currentText += words[i];
        onChunk(currentText);
      }

      onComplete(answer);
      return;
    }

    // 真实API调用 - 工作流流式输出
    try {
      console.log('正在调用Dify 工作流 API - 流式输出...');

      const response = await this.makeRequest('/workflows/run', {
        inputs: {
          user_question: question
        },
        response_mode: 'streaming',
        user: 'user-' + Date.now(),
      });

      console.log('✅ 获得响应，开始处理流式数据... v2');

      // 检查是否支持流式读取
      if (!response.body || !response.body.getReader) {
        console.log('❌ 环境不支持流式读取，使用文本模式');
        // 对于不支持流式的环境，读取完整响应然后模拟流式输出
        const fullText = await response.text();
        console.log('📄 获得完整响应，开始模拟流式输出');

        // 解析SSE格式的响应
        let finalAnswer = '';
        const lines = fullText.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.slice(6).trim();
              if (!jsonStr) continue;

              const data = JSON.parse(jsonStr);
              if (data.event === 'workflow_finished' && data.data?.outputs?.polished_answer) {
                finalAnswer = data.data.outputs.polished_answer;
                break;
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }

        if (finalAnswer) {
          // 模拟流式输出效果
          let currentText = '';
          const chars = finalAnswer.split('');

          for (let i = 0; i < chars.length; i++) {
            currentText += chars[i];
            onChunk(currentText);
            await new Promise(resolve => setTimeout(resolve, 20)); // 20ms延迟
          }

          onComplete(finalAnswer);
          return;
        } else {
          throw new Error('No answer found in response');
        }
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullAnswer = '';
      let textChunkCount = 0;

      console.log('🔄 开始读取流式数据...');

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            console.log('📡 流式读取完成');
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const jsonStr = line.slice(6).trim();
                if (!jsonStr) continue;

                const data = JSON.parse(jsonStr);

                if (data.event === 'text_chunk' && data.data?.text) {
                  textChunkCount++;
                  fullAnswer += data.data.text;

                  // 每5个文本块更新一次UI，减少渲染压力
                  if (textChunkCount % 5 === 0 || textChunkCount === 1) {
                    console.log(`📝 更新UI (${textChunkCount} chunks): "${fullAnswer.slice(-20)}..."`);
                    onChunk(fullAnswer);
                  }
                } else if (data.event === 'workflow_finished') {
                  console.log('🎉 工作流完成');
                  if (data.data?.outputs?.polished_answer) {
                    fullAnswer = data.data.outputs.polished_answer;
                  }
                  onChunk(fullAnswer);
                  onComplete(fullAnswer);
                  return;
                }
              } catch (e) {
                // 忽略解析错误，继续处理
              }
            }
          }
        }

        // 如果循环结束但没有收到workflow_finished事件
        if (fullAnswer) {
          console.log('� 使用累积的答案');
          onComplete(fullAnswer);
        } else {
          throw new Error('No answer received');
        }

      } finally {
        reader.releaseLock();
      }

    } catch (error) {
      console.error('❌ 流式API错误:', error);

      // 降级到模拟数据
      console.log('🔄 降级到模拟数据模式');
      const mockAnswers = [
        "宇宙的智慧告诉我们，每一个困惑都是成长的机会。当你感到迷茫时，不妨静下心来，倾听内心的声音。答案往往就在你的心中，只是需要时间去发现。",
        "生命就像一条河流，有时平静，有时湍急。你现在遇到的困难，正是宇宙在考验你的智慧和勇气。相信自己，相信过程，一切都会在最合适的时间得到解答。",
        "每个人都有自己的人生节奏，不要因为别人的步伐而焦虑。宇宙为每个人安排的道路都是独特的，你只需要专注于自己的成长，答案自然会显现。"
      ];

      const answer = mockAnswers[Math.floor(Math.random() * mockAnswers.length)];

      // 模拟流式输出
      let currentText = '';
      const words = answer.split('');

      for (let i = 0; i < words.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 30));
        currentText += words[i];
        onChunk(currentText);
      }

      onComplete(answer);
    }
  }

  static async askQuestion(question: string): Promise<string> {
    // 如果使用模拟数据模式
    if (USE_MOCK_DATA) {
      console.log('使用模拟数据模式');
      const mockAnswers = [
        "宇宙的智慧告诉我们，每一个困惑都是成长的机会。当你感到迷茫时，不妨静下心来，倾听内心的声音。答案往往就在你的心中，只是需要时间去发现。",
        "生命就像一条河流，有时平静，有时湍急。你现在遇到的困难，正是宇宙在考验你的智慧和勇气。相信自己，相信过程，一切都会在最合适的时间得到解答。",
        "每个人都有自己的人生节奏，不要因为别人的步伐而焦虑。宇宙为每个人安排的道路都是独特的，你只需要专注于自己的成长，答案自然会显现。",
        "困惑是智慧的开始。当你开始质疑、思考、探索时，你已经踏上了觉醒的道路。保持好奇心，保持开放的心态，宇宙会引导你找到属于你的答案。",
        "静心聆听内在的声音，它会为你指引方向。每一次困惑都是宇宙给你的礼物，帮助你更深入地了解自己和这个世界。",
        "相信过程，相信时机。有些答案需要时间才能显现，就像种子需要时间才能发芽。耐心等待，答案会在最合适的时候到来。"
      ];

      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 2000));
      const randomAnswer = mockAnswers[Math.floor(Math.random() * mockAnswers.length)];
      return randomAnswer;
    }

    // 真实API调用
    try {
      console.log('正在调用Dify 工作流 API...');

      // 使用工作流API端点 - 流式输出
      const response = await this.makeRequest('/workflows/run', {
        inputs: {
          user_question: question
        },
        response_mode: 'streaming',
        user: 'user-' + Date.now(),
      });

      const data = await response.json();
      console.log('工作流API响应:', data);

      // 工作流的响应格式处理
      if (data.data && data.data.outputs) {
        // 尝试获取输出中的文本
        const outputs = data.data.outputs;
        console.log('工作流输出:', outputs);

        // 根据实际响应，优先查找 polished_answer
        if (outputs.polished_answer) {
          return outputs.polished_answer;
        } else if (outputs.answer) {
          return outputs.answer;
        } else if (outputs.text) {
          return outputs.text;
        } else if (outputs.result) {
          return outputs.result;
        } else {
          // 如果有多个输出，取第一个字符串值
          const firstOutput = Object.values(outputs)[0];
          if (typeof firstOutput === 'string') {
            return firstOutput;
          }
        }
      } else if (data.answer) {
        return data.answer;
      } else if (data.text) {
        return data.text;
      }

      throw new Error('No answer received from workflow API');
    } catch (error) {
      console.error('Dify API Error:', error);

      // 如果是配置问题，提供更友好的错误信息并降级到模拟数据
      if (error instanceof Error && error.message.includes('app_unavailable')) {
        console.log('检测到应用配置问题，使用备用智慧回答');
        const mockAnswers = [
          "宇宙的智慧告诉我们，每一个困惑都是成长的机会。当你感到迷茫时，不妨静下心来，倾听内心的声音。答案往往就在你的心中，只是需要时间去发现。",
          "生命就像一条河流，有时平静，有时湍急。你现在遇到的困难，正是宇宙在考验你的智慧和勇气。相信自己，相信过程，一切都会在最合适的时间得到解答。",
          "每个人都有自己的人生节奏，不要因为别人的步伐而焦虑。宇宙为每个人安排的道路都是独特的，你只需要专注于自己的成长，答案自然会显现。",
          "困惑是智慧的开始。当你开始质疑、思考、探索时，你已经踏上了觉醒的道路。保持好奇心，保持开放的心态，宇宙会引导你找到属于你的答案。"
        ];

        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 1500));
        const randomAnswer = mockAnswers[Math.floor(Math.random() * mockAnswers.length)];
        return randomAnswer;
      }

      throw new Error('无法获取宇宙的智慧，请稍后再试。');
    }
  }


}
