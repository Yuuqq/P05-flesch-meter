# P05 审查记录

对照本文件所在分支的当前树，不是过期工单。行号变了就改行号。

状态只有四种：`已修`、`仍开放`、`接受的启发式`、`其它分支在处理`。

没有 CRITICAL 安全问题。这是本地计算的静态教学页。

## 已修

### 1. 首屏自动载入是空操作 — `已修` — 正确性

`loadSampleBtn` 的监听在 `app.js` 243 行，`loadSampleBtn.click()` 在 265 行，在监听之后。刷新后会载入第一条世卫中文样本并出分。这次点击发生在 `pm-metrics` 监听注册之前，不会误记 `markTaskStart`。

### 2. 一秒钟定时器覆盖用户输入 — `已修` — 正确性

原来的 `#inputText` / `#analyzeBtn` 定时器已删除。刷新后立刻打字，一秒钟后文本还在。

### 3. `aria-label` 盖住按钮文字 — `已修` — 无障碍

`index.html` 53–55 行三个按钮没有 `aria-label`，读屏读到「载入示例并计算 / 计算可读性 / 清空」。

### 4. 规格写成 Flesch-Kincaid — `已修` — 规格

`SPEC.md` 的目标、范围和 FR-1 写的是 Flesch Reading Ease。代码公式是 `206.835 - 1.015*ASL - 84.6*ASW`（`app.js` 130 行）。

### 5. 把 CJK 扩展 A 塞进难字分子 — `已修`（回滚）— 正确性

难字正则回到 `/[龘齉饕鬣]/`（`app.js` 148 行）。汉字分母仍是 `[\u4e00-\u9fff]`（142 行）。扩展 A 不再进分子。

复现：世卫中文样本 87 个汉字、3 句、平均句长 29、难字 0、分数 47.8。回滚前后这组数字一样。扩展 A 不该拿来假装修了这个启发式。

### 6. 英文分数印成 `/ 100` — `已修` — 正确性

英文结果不再加 `/ 100`（`app.js` 219 行）。中文启发式仍然夹在 0–100，所以仍显示 `/ 100`（207 行）。分数低于 0 或高于 100 时，指标列表会说明原始分不封顶（229–231 行）。

复现：

- 世卫英文样本：46 词、3 句、每词音节 1.93、Reading Ease 27.6，界面是「分数: 27.6」，门槛「专业读者更适配」。
- `I am a cat. I am a dog. I am a man.`：Reading Ease 118.2，界面不写 `/ 100`。
- 空字符串内部公式是 206.835。空输入在 192 行被拦住，不会画到界面上。

### 7. 结果区对读屏静音 — `已修` — 无障碍

结果网格在 `index.html` 59 行有 `aria-live="polite"`。空输入写的「请先输入文本」也在这块区域里。

### 8. 英文稿件仍用中文语音 — `已修`（稿件区）— 无障碍

页面外壳保持 `lang="zh-CN"`（`index.html` 2 行），因为界面是中文。检测到英文时，输入框和指标列表设为 `en`（`app.js` 185–188、221 行）。清空后回到 `zh-CN`（261 行）。

### 9. 指标和选项用 `innerHTML` 拼接 — `已修` — 安全

`renderMetrics`（176 行）和示例 `<option>`（91–99 行）改为 `textContent`。当前标题和指标都是固定文案或数字，以前也不是可利用的 XSS；现在用户稿件进不了 HTML。

### 10. Service Worker 后台更新和缓存名 — `已修` — 缓存

- 命中缓存后的再验证放进 `event.waitUntil`，并且 `cache.put` 被返回，worker 不会在写入前被收走（`sw.js` 52–62 行）。
- 缓存名是 `journalism-tool-P05-v3`（7 行）。`activate` 只删除 `journalism-tool-P05-` 前缀下的旧缓存（33–39 行），不再删掉同域其它工具的缓存。
- 预缓存包含本页真正加载的 `../shared/releases/v2.6/loader.js`（16 行），不再预缓存本页没用的 `dark-toggle.js`。
- 文件头不再写「API 走 Network-First」。跨域请求直接不拦截。

安装时如果 `cache.addAll` 失败，仍会退回逐个 `add` 并吞掉错误。核心文件缺失时，Service Worker 可以安装成功但缓存是空的。README 不再把离线写成保证可用。

### 11. QA 盖章「暂无已知严重问题」— `已修` — 记录

`QA.md` 改成已知限制清单，不再全员 Approved。

### 12. 主题色不一致 — `已修`

`manifest.json` 的 `theme_color` 与 `index.html` 6 行的 `#5f46b5` 一致。

## 接受的启发式

这些是 `SPEC.md` 第 7 节写明的简单字符/句子统计，不是本页的回归缺陷。

### 英文音节 — `接受的启发式`

`countSyllables`（`app.js` 106–113 行）按元音团计数，并在词尾 `e` 上减一。

复现：`people` → 1（应为 2），`create` → 1（应为 2），`business` → 3（应为 2），`rhythm` → 1。`rhythm` 不能当反例。

### 分句 — `接受的启发式`

`splitSentences`（115–119 行）按 `/[.!?。！？\n]+/` 切开，不是「只按句点」。

复现：`Mr. Smith went to U.S.A. yesterday.` → `Mr` / `Smith went to U` / `S` / `A` / `yesterday`。缩写会被拆开。

### 四个生僻字 — `接受的启发式`

没有字频表之前，`/[龘齉饕鬣]/` 在随附新闻样本上是 0。世卫中文样本分数 47.8 只来自句长。不要再扩一个新闻里几乎不出现的 Unicode 区段。

### 中文门槛切段复用英文 — `接受的启发式`

`levelByScore`（169–174 行）的 80 / 60 / 40 同时用于自制中文公式。典型新闻句长会落到「大学可读」或「专业读者更适配」。教学卡片已经分开说明两种分数。

## 仍开放

### 单独打开本仓库时 `../shared/` 会 404 — `其它分支在处理` — 中

`index.html` 10 行和 85 行依赖仓库外的 `../shared/`。只在本目录起静态服务时，令牌和 loader 会 404。Flesch 计算不依赖它们。这不是供应链 CRITICAL：线上 `yuuqq.github.io/shared/` 是同一套 Pages。回退见 [PR #1](https://github.com/Yuuqq/P05-flesch-meter/pull/1)。

### 没有自动化测试 — `仍开放` — 低

纯静态页，没有测试框架。改公式时用下面的样本数字手工核对。

### `app.js` 顶层绑定 — `仍开放` — 低

经典脚本，函数在全局。`pm-metrics.js` 自己是 IIFE。和 loader 撞名只是推测。

### 遥测任务名是复制来的 — `仍开放` — 低

`app.js` 278 行调用 `markTaskStart('readability_calc_task')`。`pm-metrics.js` 里的 `DEFAULT_TASK` 仍是 `content_generation_core_task`。记录只留在本机 `localStorage`，最多 500 条，不构成配额或卡顿问题。

## 安全

无密钥、无 cookie、稿件不上传。Service Worker 不缓存跨域请求。同域 `../shared/` 不要再写成供应链 CRITICAL。
