<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 px-4 pt-banner">
    <div class="w-full max-w-md">
      <div class="mb-8 text-center text-white">
        <h1 class="text-2xl font-bold tracking-wide">教师成长档案袋系统</h1>
        <p class="mt-2 text-sm text-slate-300">苏州职业技术大学 · 演示环境</p>
      </div>
      <div class="rounded-2xl border border-white/10 bg-white/95 p-8 shadow-2xl backdrop-blur">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
