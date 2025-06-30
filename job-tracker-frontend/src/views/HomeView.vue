<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { Bookmark, Repeat, BarChart, StickyNote } from 'lucide-vue-next'
import icon from '@/assets/img/icon-3.png'

const features = [
  { icon: Bookmark, titleTh: 'บันทึกตำแหน่งงาน', titleEn: 'Save job positions' },
  { icon: Repeat, titleTh: 'ตั้งเตือน follow-up', titleEn: 'Set follow up reminders' },
  { icon: BarChart, titleTh: 'รายงานสถิติ', titleEn: 'Generate statistics' },
  { icon: StickyNote, titleTh: 'บันทึก feedback/note', titleEn: 'Log feedback and notes' }
]
</script>

<template>
  <div class="min-h-full w-full bg-gradient-to-b from-white to-emerald-50 flex justify-center items-center py-12 px-4">
    <section class="landing-hero max-w-6xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
      <div class="w-full min-h-[300px] bg-transparent rounded-2xl overflow-hidden flex justify-center items-center p-4 mb-8 relative">
        <img 
          :src="icon" 
          alt="Job Application Tracking" 
          class="w-auto h-full md:h-64 object-cover rounded-xl transform hover:scale-105 transition-transform duration-300"
        />
        <div class="absolute -top-4 -right-4 w-24 h-24 bg-emerald-100 rounded-full opacity-50"></div>
        <div class="absolute -bottom-4 -left-4 w-32 h-32 bg-emerald-200 rounded-full opacity-30"></div>
      </div>

      <h1 class="text-4xl md:text-5xl font-bold mb-6 text-gray-800 relative">
        <span class="emoji text-5xl inline-block mr-2 animate-bounce">🎯</span> 
        ติดตามการสมัครงานอย่างมืออาชีพ
      </h1>
      <p class="text-xl text-gray-600 leading-relaxed mb-8 max-w-2xl mx-auto ">
        Track every job application. Stay organized. Land your 
        <span class="text-emerald-600 font-bold relative group">
          dream job.
          <span class="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 transform scale-x-0 transition-transform duration-300"></span>
        </span>
      </p>

      <RouterLink :to="{ name: 'applications' }">
        <button class="px-8 py-4 text-white text-lg font-semibold rounded-xl border-none cursor-pointer bg-emerald-500 hover:bg-emerald-600 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-emerald-200 relative overflow-hidden group">
          <span class="relative z-10">เริ่มต้นใช้งาน</span>
          <div class="absolute inset-0 bg-emerald-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </button>
      </RouterLink>
      
      <div class="grid grid-cols-4 gap-6 mt-16">
        <div 
          v-for="f in features" 
          :key="f.titleTh"
          class="feature-card"
        >
          <div class="p-3 bg-white rounded-full mb-4 shadow-sm">
            <component class="text-emerald-600" :is="f.icon" size="40" />
          </div>
          <p class="text-lg font-bold text-gray-800 mb-2">{{ f.titleTh }}</p>
          <p class="text-sm text-gray-600">{{ f.titleEn }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.landing-hero {
  max-width: 900px;
  width: 100%;
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px 0 rgba(16, 185, 129, 0.10);
  padding: 2.5rem 1.5rem;
  margin: 0 auto;
  text-align: center;
  position: relative;
}

.landing-hero .w-full {
  min-height: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background: transparent;
  border-radius: 1.5rem;
  overflow: hidden;
  margin-bottom: 2rem;
  padding: 1.5rem 0.5rem;
}

.landing-hero img {
  max-height: 200px;
  width: auto;
  object-fit: contain;
  border-radius: 1rem;
  z-index: 1;
}

.landing-hero .absolute {
  z-index: 0;
}

h1 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #1e293b;
  line-height: 1.2;
}

.emoji {
  font-size: 2.5rem;
  vertical-align: middle;
  margin-right: 0.5rem;
  animation: bounce 1.2s infinite;
}

p {
  margin-bottom: 0;
}

.landing-hero p.text-xl {
  font-size: 1.2rem;
  color: #64748b;
  margin-bottom: 2.5rem;
  line-height: 1.7;
  text-align: center;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.landing-hero .group {
  position: relative;
  display: inline-block;
}

.landing-hero .group span:last-child {
  display: block;
  height: 3px;
  background: #10b981;
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  transform: scaleX(0);
  transition: transform 0.3s;
}

.landing-hero .group:hover span:last-child {
  transform: scaleX(1);
}

.landing-hero button {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  padding: 1.25rem 2rem;
  min-width: 240px;
  border-radius: 1.25rem; 
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-top: 2.5rem;
}

.feature-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 0.5rem;
  border-radius: 1.25rem;
  background: #ecfdf5;
  border: 1px solid #d1fae5;
  transition: box-shadow 0.3s, transform 0.3s;
}
.feature-card:hover {
  box-shadow: 0 4px 16px 0 rgba(16, 185, 129, 0.10);
  transform: translateY(-4px);
}
.feature-card .p-3 {
  background: #fff;
  border-radius: 9999px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px 0 rgba(16, 185, 129, 0.08);
}
.feature-card p {
  margin-bottom: 0.25rem;
}
.feature-card p.text-lg {
  font-weight: bold;
  color: #1e293b;
}
.feature-card p.text-sm {
  color: #64748b;
}

@media (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
  .landing-hero {
    padding: 2rem 0.5rem;
  }
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  .landing-hero {
    padding: 1rem 0.25rem;
  }
  .landing-hero .w-full {
    min-height: 120px;
    padding: 0.5rem 0;
  }
  .landing-hero img {
    max-height: 100px;
  }
  h1 {
    font-size: 1.5rem;
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>