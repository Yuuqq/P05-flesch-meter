# P05 QA

## Environment

- **Date**: 2026-10-15
- **Checked against**: 本分支当前 `app.js` / `index.html` / `sw.js`
- **Score check**: Node 复现 `countSyllables`、`splitSentences`、`englishReadability`、`chineseReadability`

## 本轮核对

- 自动载入在按钮监听之后（`app.js` 243 行监听，265 行 `click()`）
- 已删除会在 1 秒后点击第一个按钮的定时器
- 三个操作按钮没有 `aria-label`（`index.html` 53–55 行）
- 结果区有 `aria-live="polite"`（59 行）
- 英文分数不再带 `/ 100`
- 难字正则只有 `龘齉饕鬣`，不含 CJK 扩展 A

### 样本结果

- 世卫中文样本：87 汉字，3 句，难字 0，分数 47.8
- 世卫英文样本：46 词，3 句，Reading Ease 27.6
- `I am a cat. I am a dog. I am a man.`：Reading Ease 118.2，界面不写 `/ 100`

## Known limits

这些限制还在。不要再写成「暂无已知严重问题」。

- **音节和分句是启发式。** `people` 算 1 个音节；`Mr. Smith went to U.S.A. yesterday.` 会被切成 5 段。
- **中文难字只认四个示例字。** 随附新闻样本的难字数是 0，分数几乎只看句长。
- **中文门槛切段复用 80 / 60 / 40。** 普通新闻句长经常落到「大学可读」。
- **只在本目录起服务时，`../shared/` 会 404。** 计算还能跑。回退在 PR #1。
- **没有自动化测试。**

## Sign-Off

- **本轮**: 不盖章 Approved。上面的限制是已知行为，不是漏测。
