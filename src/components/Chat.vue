<script lang="ts" setup>
import { ref, computed, watch, nextTick } from 'vue'
import type { Ref } from 'vue'
import { onCompletions } from '@/services/llm'

// 对话模块
const lastContent = ref('')
const textarea: Ref<HTMLTextAreaElement | undefined> = ref()
const listBox: Ref<HTMLDivElement | undefined> = ref()

type ChatList = GLMMessage[]

const chatList: Ref<ChatList> = ref([])
const isChating = ref(false)

const onCreateChat = (content: string, role: GLMMessage["role"]) => {
  chatList.value.push({ content, role })
  onScrollToBottom()
}

const onChat = async () => {
  const lastChat = chatList.value.at(-1)
  if (lastChat && !isChating.value) {
    try {
      isChating.value = true
      await onCompletions(chatList.value, (result) => {
        lastContent.value = result
        onScrollToBottom()
      }, done => {
        if (done) {
          isChating.value = false
          onCreateChat(lastContent.value, 'assistant')
          lastContent.value = ''
        }
      })
    } catch (error) {
      isChating.value = false
      alert(error)
      chatList.value.pop()
      console.error(error)
    }
  }
}

const onSend = (e: KeyboardEvent | MouseEvent) => {
  e.preventDefault()
  const content = textarea.value!.value.trim()
  if (content) {
    onCleanTextarea()
    onCreateChat(content, 'user')
    onChat()
  }
}

const onCleanTextarea = () => {
  textarea.value!.value = ''
}

const onScrollToBottom = () => {
  nextTick(() => {
    listBox.value!.scrollTop = listBox.value!.scrollHeight
  })
}
</script>

<template>
  <div class="chat-box bg-white shadow-2xl p-4 h-full flex flex-col">
    <div class="flex-1 chat-list-box w-full overflow-y-scroll" ref="listBox">
      <div class="chat chat-start">
        <div class="chat-bubble chat-bubble-accent">你好啊，有什么需要帮助的么？</div>
      </div>
      <div v-for="(chat, index) of chatList" :key="`chat${index}`" class="chat chat-start"
        :class="chat.role === 'assistant' ? 'chat-start' : 'chat-end'">
        <div class="chat-bubble" :class="chat.role === 'assistant' ? 'chat-bubble-accent' : 'chat-bubble-info'">{{
        chat.content }}</div>
      </div>
      <div v-if="lastContent" class="chat chat-start">
        <div class="chat-bubble chat-bubble-accent">{{ lastContent }}</div>
      </div>
    </div>
    <div class="chat-input-box flex justify-between items-center mt-2">
      <textarea class="textarea textarea-bordered textarea-sm flex-1"
        :placeholder="isChating ? '等待 AI 输出完成' : '请聊点什么吧'" :disabled="isChating" ref="textarea"
        @keydown.shift.enter="onSend"></textarea>
      <div class=" flex flex-col ml-4">
        <button class="btn btn-sm btn-primary" @click="onSend">发送</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-box {
  height: calc(100% - 4rem);
}
.chat {
  margin-bottom: 1rem;
}

textarea {
  resize: none;
}
</style>