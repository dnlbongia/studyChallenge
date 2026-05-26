<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '../services/api'
import type { Subject } from '../types'

const subjects = ref<Subject[]>([])
const loading = ref(true)

onMounted(async () => {
  subjects.value = await api.subjects.list()
  loading.value = false
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-2">Mis Materias</h1>
    <p class="text-gray-600 mb-8">Selecciona una materia para empezar a estudiar</p>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500">Cargando materias...</p>
    </div>

    <div v-else-if="subjects.length === 0" class="text-center py-12 bg-gray-50 rounded-xl">
      <p class="text-gray-500 text-lg">No hay materias disponibles aún.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link v-for="subject in subjects" :key="subject.id" :to="`/subjects/${subject.id}`"
        class="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 border border-gray-100 block">
        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
          <span class="text-2xl">📐</span>
        </div>
        <h2 class="text-xl font-semibold text-gray-800 mb-2">{{ subject.name }}</h2>
        <p class="text-gray-500 text-sm mb-2">{{ subject.year }}</p>
        <p class="text-gray-600 text-sm line-clamp-2">{{ subject.description }}</p>
      </router-link>
    </div>
  </div>
</template>
