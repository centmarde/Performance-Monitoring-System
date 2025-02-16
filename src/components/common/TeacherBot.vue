<template>
  <div class="teacher-bot">
    <v-card
      v-if="isChatVisible"
      elevation="4"
      class="chat-interface"
      color="primary-lighten-1"
      rounded="lg"
    >
      <v-card-title class="d-flex justify-space-between align-center pa-2">
        <span class="text-subtitle-2">AI Chat</span>
        <v-btn
          icon="mdi-chevron-down"
          variant="text"
          density="comfortable"
          size="small"
          @click="toggleChat"
        ></v-btn>
      </v-card-title>
      
      <v-card-text class="chat-messages pa-2" v-html="chatResponse"></v-card-text>
      
      <v-card-text class="pa-2">
        <div class="d-flex align-center gap-2">
          <v-text-field
            v-model="chatInput"
            hide-details
            density="compact"
            placeholder="Type your message..."
            @keyup.enter="sendMessage"
            variant="outlined"
            :disabled="isLoading"
          ></v-text-field>
          <v-btn
            :icon="isLoading ? 'mdi-loading mdi-spin' : 'mdi-send'"
            variant="text"
            density="comfortable"
            size="small"
            @click="sendMessage"
            :disabled="isLoading"
          ></v-btn>
        </div>
      </v-card-text>
    </v-card>

    <v-card
      elevation="4"
      class="bot-bubble"
      color="primary-lighten-1"
      rounded="lg"
      v-show="!isChatVisible"
    >
      <transition name="fade" mode="out-in">
        <v-card-text 
          class="text-body-1 text-dark position-relative" 
          :key="currentAdvice"
        >
          <template v-if="shouldShowAdvice">
            <span class="close-button" @click="clearAdvice">×</span>
            {{ currentAdvice }}
          </template>
          <div v-else class="thinking-dots">
            <span>.</span>
            <span class="dot">.</span>
            <span class="dot">.</span>
            <span class="dot">.</span>
          </div>
        </v-card-text>
      </transition>
    </v-card>
    <v-avatar
      class="bot-avatar"
      color="primary"
      size="50"
      elevation="4"
      @click="toggleChat"
    >
      <v-icon :icon="isChatVisible ? 'mdi-close' : currentRobotIcon" size="large" color="white"></v-icon>
    </v-avatar>
  </div>
</template>

<script>
import { useGroqChat } from '@/composables/pusher';

export default {
  name: 'TeacherBot',
  data() {
    return {
      currentAdvice: '',
      adviceList: [
        "Remember to take regular breaks to maintain productivity!",
        "Consider using visual aids in your next lesson",
        "Don't forget to provide positive feedback to your students",
        "Try incorporating group activities for better engagement",
        "Review your lesson plans for tomorrow",
        "Consider using different assessment methods",
        "Make sure to document student progress",
        "Think about implementing peer-learning activities",
        "Time to update your teaching materials?",
        "Remember to stay hydrated during your classes!"
      ],
      isChatVisible: false,
      chatInput: '',
      chatResponse: '',
      isLoading: false,
      currentRobotIcon: 'mdi-robot',
      iconInterval: null
    }
  },
  setup() {
    const { chatContent, startChat } = useGroqChat();
    return { chatContent, startChat };
  },
  mounted() {
    setTimeout(() => {
      this.setRandomAdvice();
      // Alternate between showing advice and clearing it
      setInterval(() => {
        this.clearAdvice();
        setTimeout(this.setRandomAdvice, 2000);
      }, 30000);
    }, 30000);
    
    // Set up robot icon switching
    this.iconInterval = setInterval(() => {
      this.currentRobotIcon = this.currentRobotIcon === 'mdi-robot' 
        ? 'mdi-robot-excited' 
        : 'mdi-robot';
    }, 5000);
  },
  beforeUnmount() {
    if (this.iconInterval) {
      clearInterval(this.iconInterval);
    }
  },
  computed: {
    shouldShowAdvice() {
      return this.currentAdvice && !this.isChatVisible;
    }
  },
  methods: {
    setRandomAdvice() {
      const randomIndex = Math.floor(Math.random() * this.adviceList.length);
      this.currentAdvice = this.adviceList[randomIndex];
    },
    clearAdvice() {
      this.currentAdvice = '';
    },
    toggleChat() {
      this.isChatVisible = !this.isChatVisible;
      if (this.isChatVisible) {
        this.clearAdvice();
      } else {
        this.setRandomAdvice();
      }
    },
    async sendMessage() {
      if (!this.chatInput.trim() || this.isLoading) return;
      
      const userMessage = this.chatInput;
      this.chatInput = '';
      this.isLoading = true;
      
      try {
        await this.startChat(null, 'Teacher');
        this.chatResponse = this.chatContent;
      } catch (error) {
        console.error('Chat error:', error);
        this.chatResponse += '<br>Sorry, I encountered an error. Please try again.';
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>

<style scoped>
.teacher-bot {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 2;
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

.bot-bubble {
  max-width: 250px;
  margin-bottom: 10px;
  transition: opacity 0.3s ease;
}

.bot-avatar {
  cursor: pointer;
  transition: transform 0.2s;
}

.bot-avatar:hover {
  transform: scale(1.1);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.thinking-dots {
  display: flex;
  align-items: center;
  gap: 2px;
}

.thinking-dots .dot {
  animation: dotAnimation 1.4s infinite;
  opacity: 0;
}

.thinking-dots .dot:nth-child(2) {
  animation-delay: 0.2s;
}

.thinking-dots .dot:nth-child(3) {
  animation-delay: 0.4s;
}

.thinking-dots .dot:nth-child(4) {
  animation-delay: 0.6s;
}

@keyframes dotAnimation {
  0% { opacity: 0; }
  20% { opacity: 1; }
  100% { opacity: 0; }
}

.chat-interface {
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 300px;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.position-relative {
  position: relative;
}

.close-button {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  line-height: 14px;
  text-align: center;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  opacity: 0.6;
  transition: opacity 0.2s;
  background-color: rgba(0, 0, 0, 0.1);
}

.close-button:hover {
  opacity: 1;
}

.chat-messages {
  max-height: 300px;
  overflow-y: auto;
  white-space: pre-wrap;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  margin: 8px;
}

:deep(.mdi-spin) {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
