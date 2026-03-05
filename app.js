const textInput = document.getElementById("textInput");
const sampleSelect = document.getElementById("sampleSelect");
const sampleMeta = document.getElementById("sampleMeta");
const sampleLink = document.getElementById("sampleLink");
const loadSampleBtn = document.getElementById("loadSampleBtn");
const calcBtn = document.getElementById("calcBtn");
const clearBtn = document.getElementById("clearBtn");
const metricsEl = document.getElementById("metrics");
const modeEl = document.getElementById("mode");
const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");

const realNewsSamples = [
  {
    id: "zh_who_mpox_20240814",
    title: "世卫组织宣布猴痘疫情构成国际关注突发公共卫生事件（中文）",
    source: "WHO News",
    date: "2024-08-14",
    url: "https://www.who.int/news/item/14-08-2024-who-director-general-declares-mpox-outbreak-a-public-health-emergency-of-international-concern",
    text: "2024年8月14日，世界卫生组织总干事宣布，近期猴痘疫情已构成“国际关注的突发公共卫生事件”。相关建议强调加强监测、实验室检测、疫苗策略和跨境协作，以降低传播风险。多国卫生部门随后更新了风险通报与应对计划。"
  },
  {
    id: "zh_starliner_20240606",
    title: "波音“星际客机”完成首次载人试飞并与空间站对接（中文）",
    source: "Boeing News",
    date: "2024-06-06",
    url: "https://www.boeing.com/space/starliner/first-crewed-flight-test/",
    text: "2024年6月6日，波音“星际客机”执行首次载人飞行测试，搭载两名美国宇航员前往国际空间站。任务重点验证飞船在发射、入轨、交会和对接阶段的系统可靠性。NASA和波音表示，将根据本次任务数据评估后续常规载人任务安排。"
  },
  {
    id: "zh_cop28_20231213",
    title: "COP28 达成全球盘点协议并提出能源转型方向（中文）",
    source: "UN Climate Change",
    date: "2023-12-13",
    url: "https://unfccc.int/news/cop28-agreement-signals-beginning-of-the-end-of-the-fossil-fuel-era",
    text: "2023年12月13日，COP28会议达成“阿联酋共识”，各方在全球盘点框架下就减排和能源转型方向形成文本。协议强调加快可再生能源部署、提升能效，并在本十年内推动更有力度的减排行动。多家机构认为，关键在于后续的执行强度和年度进展评估。"
  },
  {
    id: "zh_key_bridge_20240326",
    title: "巴尔的摩大桥被货船撞击后坍塌（中文）",
    source: "AP News",
    date: "2024-03-26",
    url: "https://apnews.com/hub/key-bridge-collapse",
    text: "2024年3月26日，美国巴尔的摩弗朗西斯·斯科特·基大桥在货船撞击后发生坍塌。当地启动搜救和航道清理，港口物流一度受到明显影响。事故调查随后围绕船舶动力、航行状态和桥梁防护条件展开。"
  },
  {
    id: "en_who_mpox_20240814",
    title: "WHO declares mpox outbreak a global health emergency (English)",
    source: "WHO News",
    date: "2024-08-14",
    url: "https://www.who.int/news/item/14-08-2024-who-director-general-declares-mpox-outbreak-a-public-health-emergency-of-international-concern",
    text: "On August 14, 2024, the World Health Organization said the mpox outbreak met the threshold for a Public Health Emergency of International Concern. The agency called for stronger surveillance, testing capacity, and coordinated cross-border response. National health systems then moved to update risk communication and preparedness plans."
  },
  {
    id: "en_starliner_20240606",
    title: "Boeing Starliner completes first crewed test to ISS (English)",
    source: "Boeing News",
    date: "2024-06-06",
    url: "https://www.boeing.com/space/starliner/first-crewed-flight-test/",
    text: "On June 6, 2024, Boeing's CST-100 Starliner flew its first crewed mission to the International Space Station. The test focused on launch performance, orbital operations, rendezvous, and docking reliability. NASA and Boeing said post-flight data would inform the timeline for future operational missions."
  },
  {
    id: "en_cop28_20231213",
    title: "COP28 agreement sets direction for energy transition (English)",
    source: "UN Climate Change",
    date: "2023-12-13",
    url: "https://unfccc.int/news/cop28-agreement-signals-beginning-of-the-end-of-the-fossil-fuel-era",
    text: "On December 13, 2023, negotiators at COP28 adopted the UAE Consensus after the first global stocktake under the Paris framework. The decision emphasized accelerating renewable energy deployment and improving energy efficiency. Analysts said implementation and annual accountability would determine real impact."
  },
  {
    id: "en_key_bridge_20240326",
    title: "Cargo ship strike causes Baltimore bridge collapse (English)",
    source: "AP News",
    date: "2024-03-26",
    url: "https://apnews.com/hub/key-bridge-collapse",
    text: "On March 26, 2024, the Francis Scott Key Bridge in Baltimore collapsed after a cargo ship struck a support. Emergency teams launched search, recovery, and channel-clearing operations while port traffic was disrupted. Investigators later examined vessel conditions, power status, and bridge protection measures."
  }
];

function updateSampleMeta(sample) {
  if (!sample) {
    sampleMeta.textContent = "来源: -";
    sampleLink.style.display = "none";
    return;
  }
  sampleMeta.textContent = `来源: ${sample.source} | 日期: ${sample.date}`;
  sampleLink.href = sample.url;
  sampleLink.style.display = "inline-block";
}

function initSampleOptions() {
  sampleSelect.innerHTML = realNewsSamples
    .map(item => `<option value="${item.id}">${item.title}</option>`)
    .join("");
  updateSampleMeta(realNewsSamples[0]);
}

function getSelectedSample() {
  return realNewsSamples.find(item => item.id === sampleSelect.value) || null;
}

function countSyllables(word) {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  const groups = w.match(/[aeiouy]+/g);
  let count = groups ? groups.length : 1;
  if (w.endsWith("e")) count -= 1;
  return Math.max(1, count);
}

function splitSentences(text) {
  return text
    .split(/[.!?。！？\n]+/)
    .map(s => s.trim())
    .filter(Boolean);
}

function englishReadability(text) {
  const words = text.match(/[a-zA-Z']+/g) || [];
  const sentences = splitSentences(text);
  const syllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
  const wordCount = words.length;
  const sentenceCount = Math.max(1, sentences.length);
  const asl = wordCount / sentenceCount;
  const asw = wordCount ? syllables / wordCount : 0;
  const flesch = 206.835 - 1.015 * asl - 84.6 * asw;
  return {
    wordCount,
    sentenceCount,
    syllables,
    asl,
    asw,
    score: flesch
  };
}

function chineseReadability(text) {
  const chars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const sentences = splitSentences(text);
  const sentenceCount = Math.max(1, sentences.length);
  const avgCharsPerSentence = chars / sentenceCount;
  const difficultChars = (text.match(/[龘齉饕鬣]/g) || []).length;
  const difficultRatio = chars ? difficultChars / chars : 0;

  // 启发式分值，越高越易读。
  const score = Math.max(
    0,
    Math.min(
      100,
      100 - avgCharsPerSentence * 1.8 - difficultRatio * 200
    )
  );

  return {
    charCount: chars,
    sentenceCount,
    avgCharsPerSentence,
    difficultRatio,
    score
  };
}

function levelByScore(score) {
  if (score >= 80) return "小学/初中可读";
  if (score >= 60) return "高中可读";
  if (score >= 40) return "大学可读";
  return "专业读者更适配";
}

function renderMetrics(items) {
  metricsEl.innerHTML = items.map(item => `<li>${item}</li>`).join("");
}

function calculateReadability() {
  const text = textInput.value.trim();
  if (!text) {
    renderMetrics(["请先输入文本"]);
    modeEl.textContent = "模式: -";
    scoreEl.textContent = "分数: -";
    levelEl.textContent = "建议门槛: -";
    return;
  }

  const zhChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const ratio = zhChars / Math.max(1, text.length);

  if (ratio > 0.3) {
    const r = chineseReadability(text);
    modeEl.textContent = "模式: 中文启发式";
    scoreEl.textContent = `分数: ${r.score.toFixed(1)} / 100`;
    levelEl.textContent = `建议门槛: ${levelByScore(r.score)}`;
    renderMetrics([
      `句子数: ${r.sentenceCount}`,
      `汉字数: ${r.charCount}`,
      `平均句长(汉字/句): ${r.avgCharsPerSentence.toFixed(2)}`,
      `生僻字比率: ${(r.difficultRatio * 100).toFixed(2)}%`
    ]);
  } else {
    const r = englishReadability(text);
    modeEl.textContent = "模式: English Flesch Reading Ease";
    scoreEl.textContent = `分数: ${r.score.toFixed(1)} / 100`;
    levelEl.textContent = `建议门槛: ${levelByScore(r.score)}`;
    renderMetrics([
      `Sentences: ${r.sentenceCount}`,
      `Words: ${r.wordCount}`,
      `Syllables: ${r.syllables}`,
      `Average Sentence Length: ${r.asl.toFixed(2)}`,
      `Average Syllables per Word: ${r.asw.toFixed(2)}`
    ]);
  }
}

initSampleOptions();

sampleSelect.addEventListener("change", () => {
  const sample = getSelectedSample();
  updateSampleMeta(sample);
});

loadSampleBtn.addEventListener("click", () => {
  const sample = getSelectedSample();
  if (!sample) return;
  textInput.value = sample.text;
  updateSampleMeta(sample);
  calculateReadability();
});

calcBtn.addEventListener("click", () => {
  calculateReadability();
});

clearBtn.addEventListener("click", () => {
  textInput.value = "";
  renderMetrics([]);
  modeEl.textContent = "模式: -";
  scoreEl.textContent = "分数: -";
  levelEl.textContent = "建议门槛: -";
});

// === PM Metrics Integration ===
(function() {
  try {
    if (!window.pmMetrics) return;
    // Auto mark task start on first meaningful interaction
    let taskStarted = false;
    document.addEventListener('click', function(e) {
      if (taskStarted) return;
      const btn = e.target.closest('button');
      if (btn) {
        taskStarted = true;
        window.pmMetrics.markTaskStart('readability_calc_task');
      }
    }, { once: false });
  } catch (_e) {}
})();
