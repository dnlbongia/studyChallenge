<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '../services/api'
import type { Subject } from '../types'

const route = useRoute()
const subject = ref<Subject | null>(null)
const loading = ref(true)

onMounted(async () => {
  subject.value = await api.subjects.get(Number(route.params.id))
  loading.value = false
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500">Cargando...</p>
    </div>

    <template v-else-if="subject">
      <div class="mb-8">
        <router-link to="/dashboard" class="text-blue-600 hover:underline text-sm">&larr; Volver</router-link>
        <h1 class="text-3xl font-bold text-gray-800 mt-2">{{ subject.name }}</h1>
        <p class="text-gray-600 mt-1">{{ subject.year }}</p>
        <p class="text-gray-700 mt-2">{{ subject.description }}</p>
      </div>

      <div v-if="subject.topics && subject.topics.length > 0" class="space-y-4">
        <h2 class="text-xl font-semibold text-gray-800">Temas</h2>
        <router-link v-for="(topic, index) in subject.topics" :key="topic.id" :to="`/topics/${topic.id}`"
          class="block bg-white rounded-xl shadow-sm hover:shadow-md transition p-5 border border-gray-100">
          <div class="flex items-start gap-4">
            <span
              class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold shrink-0">
              {{ index + 1 }}
            </span>
            <div>
              <h3 class="text-lg font-medium text-gray-800">{{ topic.title }}</h3>
              <p class="text-sm text-gray-500 mt-1">{{ topic.challenges?.length || 0 }} reto(s)</p>
            </div>
          </div>
        </router-link>
      </div>

      <div v-else class="text-center py-12 bg-gray-50 rounded-xl">
        <p class="text-gray-500">No hay temas disponibles para esta materia.</p>
      </div>
    </template>
  </div>
</template>
