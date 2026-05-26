<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { User } from '../types'

const router = useRouter()
const route = useRoute()

const user = computed<User | null>(() => {
  const raw = localStorage.getItem('user')
  return raw ? JSON.parse(raw) : null
})

const isLoggedIn = computed(() => !!localStorage.getItem('token'))

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}
</script>

<template>
  <nav v-if="isLoggedIn && route.name !== 'Login' && route.name !== 'Register'"
    class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
      <router-link to="/dashboard" class="text-lg font-bold text-blue-600">
        StudyChallenge
      </router-link>
      <div class="flex items-center gap-4">
        <span class="text-sm text-gray-600">{{ user?.name }}</span>
        <button @click="logout"
          class="text-sm text-gray-500 hover:text-red-600 transition cursor-pointer">
          Cerrar sesión
        </button>
      </div>
    </div>
  </nav>
</template>
