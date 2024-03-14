<script lang="ts" setup>
import { ref, nextTick } from 'vue'
import type { Ref } from 'vue'

type InitialForm = {
  age: number,
  sex: string,
}

// 对话模块
const lastContent = ref('')
const listBox: Ref<HTMLDivElement | undefined> = ref()

type Message = GLMMessage & { answers?: number[] | string[] }
type ChatList = Message[]

const askList: ChatList = [
  {
    role: 'assistant',
    content: '请问，你的年龄是？',
  },
  {
    role: 'assistant',
    content: '请问，你的性别是？',
  },
]
const answerList: ChatList = [
  {
    role: 'user',
    content: '我的年龄是',
  },
  {
    role: 'user',
    content: '我的性别是',
  },
]

const answers = [[18, 19, 20], ['男', '女']]
const initialForm: InitialForm = {
  age: 0,
  sex: '',
}
let stepIndex = 0
const chatList: Ref<ChatList> = ref([])

function sleep(ms: number = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function onCreateAsk() {
  chatList.value.push(askList[stepIndex])
  sleep().then(() => {
    onCreateAnswer()
  })
  onScrollToBottom()
}

function onCreateAnswer() {
  chatList.value.push(answerList[stepIndex])
  sleep(500).then(() => {
    onRenderAnswers()
  })
  onScrollToBottom()
}

function onRenderAnswers() {
  chatList.value.push({
    role: 'assistant',
    content: '',
    answers: answers[stepIndex],
  })
  onScrollToBottom()
}

function onSelectAnswer(answer: number | string, index: number) {
  if (stepIndex === 0) {
    initialForm.age = answer as number
  } else if (stepIndex === 1) {
    initialForm.sex = answer as string
  }
  stepIndex++
  if (stepIndex >= askList.length) {
    onEnd()
    return
  }
  sleep().then(() => {
    onCreateAsk()
  })
}

function onScrollToBottom() {
  nextTick(() => {
    listBox.value!.scrollTop = listBox.value!.scrollHeight
  })
}

onCreateAsk()

// 结束
function onEnd() {
  localStorage.setItem('inititalFormed', 'true')
  localStorage.setItem('inititalForm', JSON.stringify(initialForm))
}
</script>

<template>
  <div class="chat-box bg-white shadow-2xl p-4 h-full flex flex-col">
    <div class="flex-1 chat-list-box w-full overflow-y-scroll" ref="listBox">
      <div class="chat chat-start">
        <div class="chat-bubble chat-bubble-accent">你好啊，欢迎来到长河老街。</div>
      </div>
      <div v-for="(chat, index) of chatList" :key="`chat${index}`" class="chat chat-start"
        :class="chat.role === 'assistant' ? 'chat-start' : 'chat-end'">
        <div class="chat-bubble" :class="chat.role === 'assistant' ? 'chat-bubble-accent' : 'chat-bubble-info'">
          <p v-if="chat.content">{{ chat.content }}</p>
          <div v-else-if="chat.answers && chat.answers.length">
            <button class="btn btn-secondary btn-sm mx-1" v-for="(answer, index) in chat.answers"
              :key="`answer${index}`" @click="onSelectAnswer(answer, index)">
              {{ answer }}
            </button>
          </div>
        </div>
      </div>
      <div v-if="lastContent" class="chat chat-start">
        <div class="chat-bubble chat-bubble-accent">{{ lastContent }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>