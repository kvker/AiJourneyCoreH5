import { describe, expect, it } from 'vitest'
import LLM from './llm'

const llm = new LLM({ knowledgeId: '1768553804254646272' }) // 长河老街知识库
describe('测试LLM的SSE接口onCompletions', () => {
  it('传入 doneCb, 最终会执行 doneCb, 且正常返回 result', async () => {
    await llm.onCompletions('你好啊', (chunk) => {
      // console.log(chunk)
    }, result => {
      // console.log(result)
      expect(typeof result).toEqual('string')
    })
  })
})

