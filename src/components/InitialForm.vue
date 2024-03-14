<script lang="ts" setup>
import { ref, nextTick } from 'vue'
import type { Ref } from 'vue'

const emit = defineEmits(['formed'])

type InitialForm = {
  state: string,
}

// 对话模块
const listBox: Ref<HTMLDivElement | undefined> = ref()

type Message = GLMMessage & { answers?: string[], imageList?: string[] }
type ChatList = Message[]

const askList: ChatList = [
  {
    role: 'assistant',
    content: 'Hi!',
  },
  {
    role: 'assistant',
    content: '首先让我们认识一下，我是来来，你的专属讲解员！',
  },
  {
    role: 'assistant',
    content: '任何关于长河老街的内容，都可以问我哦。',
  },
  {
    role: 'assistant',
    content: '',
    imageList: ['https://sablcfile.kvker.com/5okMURHx2lMDwPSBf4swxkVFxtRx7OXa/1701318337.817.png'],
  },
  {
    role: 'assistant',
    content: '你希望哪一种讲解方式？',
  },
  {
    role: 'assistant',
    content: '好的，你的选择是：',
  },
  {
    role: 'assistant',
    content: '那么，开始长河之旅吧。',
  },
  {
    role: 'assistant',
    content: '有任何疑问，欢迎随时跟我联系。',
  },
]

const answers = [['常规', '简洁', '慢速']]
const selectAnswerIndex = ref(-1)
const initialForm: InitialForm = {
  state: '常规',
}
const chatList: Ref<ChatList> = ref([])

function sleep(ms: number = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function onCreateAsk() {
  const answerIndex = 4
  const chatLength = chatList.value.length
  const ask = askList[chatLength > answerIndex ? chatLength - 1 : chatLength]
  if (chatLength === answerIndex + 2) {
    ask.content += initialForm.state
  }
  chatList.value.push(ask)
  sleep().then(() => {
    if (chatLength === answerIndex) {
      onRenderAnswers()
    } else if (chatLength >= askList.length) {
      onEnd()
    } else {
      onCreateAsk()
    }
  })
  onScrollToBottom()
}

function onRenderAnswers() {
  chatList.value.push({
    role: 'user',
    content: '',
    answers: answers[0],
  })
  onScrollToBottom()
}

function onSelectAnswer(answer: string, index: number) {
  initialForm.state = answer
  selectAnswerIndex.value = index
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
  emit('formed')
}
</script>

<template>
  <div class="chat-box fixed w-full h-full left-0 top-0 bg-white shadow-2xl p-4 h-full flex flex-col">
    <div class="flex-1 chat-list-box w-full overflow-y-scroll" ref="listBox">
      <template v-for="(chat, index) of chatList" :key="index">
        <div v-if="chat.role === 'assistant'" class="chat chat-start">
          <div class="chat-image avatar">
            <div class="w-10 rounded-full">
              <img alt="Tailwind CSS chat bubble component"
                src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
            </div>
          </div>
          <div v-if="chat.content" class="chat-bubble">{{ chat.content }}</div>
          <template v-else-if="chat.imageList && chat.imageList.length">
            <img v-for="url of chat.imageList" :key="url" class="w-32 h-32 object-contain" :src="url">
          </template>
        </div>
        <div v-else class="chat chat-end">
          <div class="chat-image avatar">
            <div class="w-10 rounded-full">
              <img alt="Tailwind CSS chat bubble component"
                src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
            </div>
          </div>
          <div class="chat-bubble">
            <button class="btn btn-accent btn-sm mx-1"
              :class="selectAnswerIndex === index ? 'btn-secondary' : 'btn-outline'"
              v-for="(answer, index) in chat.answers" :key="`answer${index}`" @click="onSelectAnswer(answer, index)">
              {{ answer }}
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped></style>