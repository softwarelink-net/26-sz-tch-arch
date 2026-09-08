<template>
  <div class="min-h-screen bg-slate-50 pt-banner">
    <header class="border-b border-slate-200 bg-white">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div>
          <p class="text-xs font-medium uppercase tracking-wider text-cyan-700">江苏政府采购 · 公开标讯</p>
          <h1 class="mt-1 text-lg font-bold text-slate-900">苏州职业技术大学教师成长档案袋系统</h1>
        </div>
        <RouterLink class="btn-primary" to="/login">进入演示系统</RouterLink>
      </div>
    </header>

    <article class="mx-auto max-w-5xl px-6 py-10">
      <div class="card-panel prose prose-slate max-w-none">
        <p class="text-sm text-slate-500">项目编号：JSZC-320500-JZCG-C2026-0220 · 发布日期：2026-09-03 · 预算：69.90 万元</p>
        <h2 class="mt-4 text-2xl font-bold text-slate-900">采购公告</h2>
        <p class="mt-4 leading-7 text-slate-700">
          拟建系统以教师职业全周期教学档案数据为核心底座，通过打通校内人事、教务、科研、学工、师资培训等多业务系统数据，构建统一标准、分级管控、全程可溯的教师档案数据体系；面向人事管理部门、教师个人、双高建设管理部门三类核心用户，打造覆盖档案归集治理、师资动态监测、风险智能预警、业务灵活配置、能力评价诊改、教师发展指引的一体化数字化应用。
        </p>

        <h3 class="mt-8 text-lg font-semibold text-slate-900">技术要点</h3>
        <ul class="mt-3 list-disc space-y-2 pl-5 text-slate-700">
          <li>多源数据集成与档案归集治理</li>
          <li>分级权限管控（ADMIN / HR_MGR / TEACHER / DECIDER）</li>
          <li>数据可视化大屏与双高建设监测</li>
          <li>风险智能预警与能力诊改闭环</li>
        </ul>

        <h3 class="mt-8 text-lg font-semibold text-slate-900">交付周期</h3>
        <p class="mt-3 text-slate-700">合同签订后 45 日内完成系统交付与验收演示。</p>

        <div class="mt-8 flex flex-wrap gap-3">
          <RouterLink class="btn-primary" to="/login">登录演示</RouterLink>
          <a
            class="btn-ghost border border-slate-200"
            href="https://github.com/softwarelink-net/26-sz-tch-arch"
            target="_blank"
            rel="noopener noreferrer"
          >
            查看源码仓库
          </a>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts"></script>
