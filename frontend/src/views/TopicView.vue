<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import { api } from '../services/api'
import type { Topic, Challenge } from '../types'

const route = useRoute()
const topic = ref<Topic | null>(null)
const challenges = ref<(Challenge & { questionHtml?: string; explanationHtml?: string })[]>([])
const contentHtml = ref('')
const loading = ref(true)
const answers = ref<Record<number, string>>({})
const results = ref<Record<number, { correct: boolean } | null>>({})

onMounted(async () => {
  topic.value = await api.topics.get(Number(route.params.id))
  if (topic.value) {
    const res = await fetch(topic.value.content_url)
    const md = await res.text()
    contentHtml.value = await marked(md)

    const rawChallenges = topic.value.challenges || []
    for (const ch of rawChallenges) {
      const chRes = await fetch(ch.content_url)
      const chMd = await chRes.text()
      const parts = chMd.split('## Explicación')
      const questionPart = parts[0].replace('## Pregunta\n\n', '').trim()
      const explanationPart = parts[1]?.trim() || ''
      challenges.value.push({
        ...ch,
        questionHtml: await marked(questionPart),
        explanationHtml: await marked(explanationPart),
      })
    }
  }
  loading.value = false
})

async function submitAnswer(challengeId: number) {
  const answer = answers.value[challengeId]
  if (!answer) return
  try {
    const res = await api.progress.submit(challengeId, answer)
    results.value[challengeId] = { correct: res.correct }
  } catch {
    results.value[challengeId] = { correct: false }
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500">Cargando...</p>
    </div>

    <template v-else-if="topic">
      <div class="mb-8">
        <router-link :to="`/subjects/${topic.subject_id}`" class="text-blue-600 hover:underline text-sm">
          &larr; Volver a la materia
        </router-link>
        <h1 class="text-3xl font-bold text-gray-800 mt-2">{{ topic.title }}</h1>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 prose max-w-none" v-html="contentHtml"></div>

      <div v-if="challenges.length > 0">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Retos</h2>
        <div v-for="challenge in challenges" :key="challenge.id"
          class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
          <div class="mb-4">
            <p class="text-sm text-gray-500 mb-1">{{ challenge.points }} pts</p>
            <div class="text-gray-800 font-medium" v-html="challenge.questionHtml"></div>
          </div>

          <div class="space-y-2 mb-4">
            <label v-for="option in challenge.options" :key="option"
              class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition"
              :class="{
                'bg-green-50 border-green-300': results[challenge.id]?.correct && answers[challenge.id] === option,
                'bg-red-50 border-red-300': results[challenge.id] && !results[challenge.id]?.correct && answers[challenge.id] === option
              }">
              <input type="radio" :name="`challenge-${challenge.id}`" :value="option"
                v-model="answers[challenge.id]" :disabled="results[challenge.id] !== undefined"
                class="accent-blue-600" />
              <span class="text-gray-700">{{ option }}</span>
            </label>
          </div>

          <div v-if="results[challenge.id]" class="mb-4">
            <p v-if="results[challenge.id]!.correct" class="text-green-600 font-medium">
              ¡Correcto! +{{ challenge.points }} pts
            </p>
            <p v-else class="text-red-600 font-medium">
              Incorrecto
            </p>
            <div v-if="challenge.explanationHtml" class="text-gray-600 text-sm mt-1 italic prose" v-html="challenge.explanationHtml"></div>
          </div>

          <button v-if="!results[challenge.id]" @click="submitAnswer(challenge.id)"
            :disabled="!answers[challenge.id]"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
            Responder
          </button>
        </div>
      </div>
    </template>
  </div>
</template>
