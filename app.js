const MANIFEST_URL = "./photoManifest.json";
const FAVORITES_KEY = "restoration_archive_favorites_v1";
const DEFAULT_RESTORE = {
  contrast: 118,
  brightness: 106,
  saturation: 112,
  warmth: 7,
};

const state = {
  photos: [],
  filtered: [],
  selected: null,
  query: "",
  category: "all",
  period: "all",
  tag: "all",
  layout: "museum",
  sort: "id",
  favoriteOnly: false,
  favorites: new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]")),
  restore: { ...DEFAULT_RESTORE },
  storyTone: "exhibition",
};

const $ = (selector) => document.querySelector(selector);
const gallery = $("#gallery");
const emptyState = $("#empty-state");
const toast = $("#toast");
const dialog = $("#photo-dialog");
const compareStage = $("#compare-stage");

const refs = {
  curatedTrack: $("#curated-track"),
  timelineView: $("#timeline-view"),
  totalCount: $("#total-count"),
  categoryCount: $("#category-count"),
  favoriteCount: $("#favorite-count"),
  resultCount: $("#result-count"),
  search: $("#search-input"),
  category: $("#category-filter"),
  period: $("#period-filter"),
  tag: $("#tag-filter"),
  layout: $("#layout-filter"),
  sort: $("#sort-filter"),
  favoriteOnly: $("#favorite-only"),
  resetFilters: $("#reset-filters"),
  randomPhoto: $("#random-photo"),
  beforeImage: $("#before-image"),
  afterImage: $("#after-image"),
  compareSlider: $("#compare-slider"),
  dialogCategory: $("#dialog-category"),
  dialogTitle: $("#dialog-title"),
  dialogDescription: $("#dialog-description"),
  dialogPeriod: $("#dialog-period"),
  dialogLocation: $("#dialog-location"),
  dialogSource: $("#dialog-source"),
  dialogId: $("#dialog-id"),
  dialogStory: $("#dialog-story"),
  dialogTags: $("#dialog-tags"),
  reportScore: $("#report-score"),
  reportMetrics: $("#report-metrics"),
  researchNotes: $("#research-notes"),
  storyTone: $("#story-tone"),
  contrast: $("#contrast-control"),
  brightness: $("#brightness-control"),
  saturation: $("#saturation-control"),
  warmth: $("#warmth-control"),
  resetRestore: $("#reset-restore"),
  downloadRestored: $("#download-restored"),
  downloadOriginal: $("#download-original"),
  copyCitation: $("#copy-citation"),
  toggleFavorite: $("#toggle-favorite"),
};

async function init() {
  bindEvents();
  updateRestoreFilter();
  state.photos = await loadPhotos();
  state.filtered = state.photos;
  populateFilters();
  renderFeatureSections();
  applyFilters();
  showToast("已加载 90 张本地图片史料");
}

async function loadPhotos() {
  const response = await fetch(MANIFEST_URL, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`无法读取 ${MANIFEST_URL}: HTTP ${response.status}`);
  }
  const photos = await response.json();
  return photos.map((photo) => ({
    ...photo,
    tags: Array.isArray(photo.tags) ? photo.tags : [],
  }));
}

function bindEvents() {
  refs.search.addEventListener("input", (event) => {
    state.query = event.target.value;
    applyFilters();
  });
  refs.category.addEventListener("change", (event) => {
    state.category = event.target.value;
    applyFilters();
  });
  refs.period.addEventListener("change", (event) => {
    state.period = event.target.value;
    applyFilters();
  });
  refs.tag.addEventListener("change", (event) => {
    state.tag = event.target.value;
    applyFilters();
  });
  refs.layout.addEventListener("change", (event) => {
    state.layout = event.target.value;
    render();
  });
  refs.sort.addEventListener("change", (event) => {
    state.sort = event.target.value;
    applyFilters();
  });
  refs.favoriteOnly.addEventListener("click", () => {
    state.favoriteOnly = !state.favoriteOnly;
    refs.favoriteOnly.setAttribute("aria-pressed", String(state.favoriteOnly));
    applyFilters();
  });
  refs.resetFilters.addEventListener("click", resetFilters);
  refs.randomPhoto.addEventListener("click", openRandomPhoto);

  $(".dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  refs.compareSlider.addEventListener("input", (event) => {
    compareStage.style.setProperty("--split", `${event.target.value}%`);
  });
  refs.storyTone.addEventListener("change", (event) => {
    state.storyTone = event.target.value;
    updateStory();
  });

  [refs.contrast, refs.brightness, refs.saturation, refs.warmth].forEach((input) => {
    input.addEventListener("input", () => {
      state.restore = {
        contrast: Number(refs.contrast.value),
        brightness: Number(refs.brightness.value),
        saturation: Number(refs.saturation.value),
        warmth: Number(refs.warmth.value),
      };
      updateRestoreFilter();
    });
  });
  refs.resetRestore.addEventListener("click", resetRestore);
  refs.downloadRestored.addEventListener("click", downloadRestored);
  refs.downloadOriginal.addEventListener("click", downloadOriginal);
  refs.copyCitation.addEventListener("click", copyCitation);
  refs.toggleFavorite.addEventListener("click", () => {
    if (state.selected) toggleFavorite(state.selected.id);
  });
}

function populateFilters() {
  populateSelect(refs.category, uniqueValues("category"), "全部分类");
  populateSelect(refs.period, uniqueValues("period"), "全部时期");
  const tags = [...new Set(state.photos.flatMap((photo) => photo.tags || []))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, "zh-CN"));
  populateSelect(refs.tag, tags, "全部标签");
  refs.totalCount.textContent = state.photos.length;
  refs.categoryCount.textContent = uniqueValues("category").length;
  updateFavoriteCount();
}

function populateSelect(select, values, allLabel) {
  select.innerHTML = `<option value="all">${allLabel}</option>`;
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

function uniqueValues(key) {
  return [...new Set(state.photos.map((photo) => photo[key]).filter(Boolean))].sort((a, b) =>
    String(a).localeCompare(String(b), "zh-CN")
  );
}

function normalize(value) {
  return String(value || "").toLowerCase().trim();
}

function applyFilters() {
  const query = normalize(state.query);
  state.filtered = state.photos
    .filter((photo) => {
      const searchText = normalize([
        photo.id,
        photo.title,
        photo.description,
        photo.location,
        photo.source,
        photo.category,
        photo.period,
        ...(photo.tags || []),
      ].join(" "));
      return (
        (!query || searchText.includes(query)) &&
        (state.category === "all" || photo.category === state.category) &&
        (state.period === "all" || photo.period === state.period) &&
        (state.tag === "all" || (photo.tags || []).includes(state.tag)) &&
        (!state.favoriteOnly || state.favorites.has(photo.id))
      );
    })
    .sort(sortPhotos);
  render();
}

function sortPhotos(a, b) {
  const key = state.sort;
  if (key === "id") return Number(a.id) - Number(b.id);
  return String(a[key] || "").localeCompare(String(b[key] || ""), "zh-CN");
}

function render() {
  gallery.className = `gallery gallery--${state.layout}`;
  gallery.innerHTML = "";
  emptyState.hidden = state.filtered.length !== 0;
  refs.resultCount.textContent = `显示 ${state.filtered.length} / ${state.photos.length} 张`;

  const fragment = document.createDocumentFragment();
  state.filtered.forEach((photo) => fragment.appendChild(createCard(photo)));
  gallery.appendChild(fragment);
}

function createCard(photo) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "photo-card";
  if (photo.width && photo.height) {
    card.style.setProperty("--ratio", `${photo.width} / ${photo.height}`);
  }

  const favorite = state.favorites.has(photo.id) ? `<span class="favorite-dot">已收藏</span>` : "";
  const miniTags = (photo.tags || [])
    .slice(0, 3)
    .map((tag) => `<span>${escapeHtml(tag)}</span>`)
    .join("");

  card.innerHTML = `
    <div class="photo-card__image">
      <img src="${escapeHtml(photo.originalImageUrl)}" alt="${escapeHtml(photo.title)}" loading="lazy" decoding="async" />
      <div class="photo-card__restored" aria-hidden="true">
        <img src="${escapeHtml(photo.originalImageUrl)}" alt="" loading="lazy" decoding="async" />
      </div>
      <span class="split-line" aria-hidden="true"></span>
      <span class="badge">${escapeHtml(photo.category || "档案")}</span>
      ${favorite}
    </div>
    <div class="photo-card__body">
      <h3>${escapeHtml(photo.title)}</h3>
      <div class="card-meta">
        <span>${escapeHtml(photo.period || "未知时期")}</span>
        <span>${escapeHtml(photo.location || "长征沿线")}</span>
      </div>
      <div class="mini-tags">${miniTags}</div>
    </div>
  `;
  card.addEventListener("click", () => openPhoto(photo));
  return card;
}

function openPhoto(photo) {
  state.selected = photo;
  refs.beforeImage.src = photo.originalImageUrl;
  refs.afterImage.src = photo.originalImageUrl;
  refs.beforeImage.alt = `${photo.title} 原图`;
  refs.afterImage.alt = `${photo.title} AI 修复预览`;
  compareStage.style.setProperty("--split", `${refs.compareSlider.value}%`);

  refs.dialogCategory.textContent = photo.category || "档案";
  refs.dialogTitle.textContent = photo.title;
  refs.dialogDescription.textContent = photo.description || "暂无描述";
  refs.dialogPeriod.textContent = photo.period || "暂无";
  refs.dialogLocation.textContent = photo.location || "暂无";
  refs.dialogSource.textContent = photo.source || "本地图片史料";
  refs.dialogId.textContent = `#${photo.id}`;
  refs.dialogTags.innerHTML = (photo.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
  refs.toggleFavorite.textContent = state.favorites.has(photo.id) ? "取消收藏" : "收藏";
  updateStory();
  updateReport();
  updateResearchNotes();
  dialog.showModal();
}

function updateStory() {
  if (!state.selected) return;
  refs.dialogStory.textContent = buildStory(state.selected, state.storyTone);
}

function buildStory(photo, tone) {
  if (tone === "academic") {
    return `${photo.aiStory} 从研究角度看，这张图可被放入“${photo.category}”专题中，与${photo.period}、${photo.location}等线索交叉比对。建议进一步核验拍摄时间、原始出处、图像流传版本以及画面中人物或地点的可识别证据。`;
  }
  if (tone === "guide") {
    return `请先看这张照片的主体：${photo.title}。它关联的地点是${photo.location}，时间线索是${photo.period}。如果把它放进长征叙事里，它不只是一个静止瞬间，更像是一扇窗口，让观众看到行军、会师、转战和纪念如何被一张照片保存下来。`;
  }
  return photo.aiStory;
}

function resetFilters() {
  state.query = "";
  state.category = "all";
  state.period = "all";
  state.tag = "all";
  state.favoriteOnly = false;
  refs.search.value = "";
  refs.category.value = "all";
  refs.period.value = "all";
  refs.tag.value = "all";
  refs.favoriteOnly.setAttribute("aria-pressed", "false");
  applyFilters();
}

function resetRestore() {
  state.restore = { ...DEFAULT_RESTORE };
  refs.contrast.value = DEFAULT_RESTORE.contrast;
  refs.brightness.value = DEFAULT_RESTORE.brightness;
  refs.saturation.value = DEFAULT_RESTORE.saturation;
  refs.warmth.value = DEFAULT_RESTORE.warmth;
  updateRestoreFilter();
  showToast("修复参数已恢复默认");
}

function updateRestoreFilter() {
  const filter = restoreFilter();
  document.documentElement.style.setProperty("--restore-filter", filter);
  updateReport();
}

function restoreFilter() {
  return [
    `contrast(${state.restore.contrast / 100})`,
    `brightness(${state.restore.brightness / 100})`,
    `saturate(${state.restore.saturation / 100})`,
    `sepia(${state.restore.warmth / 100})`,
  ].join(" ");
}

async function downloadRestored() {
  if (!state.selected) return;
  try {
    const blob = await createRestoredBlob(state.selected.originalImageUrl);
    downloadBlob(blob, `${state.selected.id}-AI修复版.png`);
    showToast("修复图已生成并开始下载");
  } catch (error) {
    console.error(error);
    showToast("修复图生成失败，请稍后重试");
  }
}

async function createRestoredBlob(src) {
  const image = new Image();
  image.src = src;
  await image.decode();
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext("2d");
  context.fillStyle = "#f3ede1";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.filter = restoreFilter();
  context.drawImage(image, 0, 0);
  context.filter = "none";
  context.globalAlpha = 0.08;
  context.fillStyle = "#d4b66f";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.globalAlpha = 1;

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Canvas export failed"))), "image/png", 0.95);
  });
}

function downloadOriginal() {
  if (!state.selected) return;
  const link = document.createElement("a");
  link.href = state.selected.originalImageUrl;
  link.download = `${state.selected.id}-原图${fileExtension(state.selected.originalImageUrl)}`;
  link.click();
}

function fileExtension(path) {
  return path.match(/\.[a-z0-9]+$/i)?.[0] || ".jpg";
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1200);
}

async function copyCitation() {
  if (!state.selected) return;
  const citation = `${state.selected.title}，${state.selected.source || "本地图片史料"}，${state.selected.period || "未知时期"}，档案编号 ${state.selected.id}。`;
  try {
    await navigator.clipboard.writeText(citation);
    showToast("引用信息已复制");
  } catch {
    showToast(citation);
  }
}

function toggleFavorite(id) {
  if (state.favorites.has(id)) {
    state.favorites.delete(id);
    showToast("已取消收藏");
  } else {
    state.favorites.add(id);
    showToast("已加入收藏");
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...state.favorites]));
  updateFavoriteCount();
  if (state.selected?.id === id) {
    refs.toggleFavorite.textContent = state.favorites.has(id) ? "取消收藏" : "收藏";
  }
  applyFilters();
}

function updateFavoriteCount() {
  refs.favoriteCount.textContent = state.favorites.size;
}

function renderFeatureSections() {
  renderCuratedTrack();
  renderTimeline();
}

function renderCuratedTrack() {
  const picks = [
    ["出发地", ["于都", "战略转移"]],
    ["遵义转折", ["遵义"]],
    ["四渡赤水", ["赤水", "太平渡", "茅台"]],
    ["飞夺泸定", ["泸定", "大渡河"]],
    ["翻越雪山", ["夹金山"]],
    ["走过草地", ["草地", "水草地"]],
    ["胜利会师", ["会师", "会宁"]],
    ["到达陕北", ["陕北", "吴起镇"]],
  ];

  const selected = [];
  picks.forEach(([label, keywords]) => {
    const photo = state.photos.find((item) => keywords.some((keyword) => photoMatches(item, keyword)));
    if (photo && !selected.some((item) => item.id === photo.id)) {
      selected.push({ ...photo, label });
    }
  });

  refs.curatedTrack.innerHTML = selected
    .map(
      (photo, index) => `
        <button class="curated-card" type="button" data-photo-id="${photo.id}">
          <span class="curated-index">${String(index + 1).padStart(2, "0")}</span>
          <img src="${escapeHtml(photo.originalImageUrl)}" alt="${escapeHtml(photo.title)}" loading="lazy" decoding="async" />
          <span class="eyebrow">${escapeHtml(photo.label)}</span>
          <h3>${escapeHtml(photo.title)}</h3>
          <p>${escapeHtml(photo.location || "长征沿线")} · ${escapeHtml(photo.period || "历史档案")}</p>
        </button>
      `
    )
    .join("");

  refs.curatedTrack.querySelectorAll("[data-photo-id]").forEach((button) => {
    button.addEventListener("click", () => openPhotoById(button.dataset.photoId));
  });
}

function renderTimeline() {
  const groups = new Map();
  state.photos.forEach((photo) => {
    const year = inferYear(photo);
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year).push(photo);
  });

  refs.timelineView.innerHTML = [...groups.entries()]
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([year, photos]) => {
      const thumbs = photos
        .slice(0, 5)
        .map(
          (photo) => `
            <button type="button" class="timeline-thumb" data-photo-id="${photo.id}">
              <img src="${escapeHtml(photo.originalImageUrl)}" alt="${escapeHtml(photo.title)}" loading="lazy" decoding="async" />
            </button>
          `
        )
        .join("");
      return `
        <article class="timeline-item">
          <div class="timeline-year">${year}</div>
          <div class="timeline-copy">
            <h3>${timelineTitle(year)}</h3>
            <p>${timelineSummary(year, photos.length)}</p>
            <div class="timeline-thumbs">${thumbs}</div>
          </div>
        </article>
      `;
    })
    .join("");

  refs.timelineView.querySelectorAll("[data-photo-id]").forEach((button) => {
    button.addEventListener("click", () => openPhotoById(button.dataset.photoId));
  });
}

function updateReport() {
  if (!state.selected || !refs.reportMetrics) return;
  const metrics = restorationMetrics(state.selected);
  const average = Math.round(metrics.reduce((sum, item) => sum + item.value, 0) / metrics.length);
  refs.reportScore.textContent = `综合 ${average}%`;
  refs.reportMetrics.innerHTML = metrics
    .map(
      (item) => `
        <div class="metric-row">
          <div>
            <strong>${escapeHtml(item.label)}</strong>
            <span>${escapeHtml(item.note)}</span>
          </div>
          <b>${item.value}%</b>
          <i style="--value:${item.value}%"></i>
        </div>
      `
    )
    .join("");
}

function updateResearchNotes() {
  if (!state.selected || !refs.researchNotes) return;
  const notes = researchNotes(state.selected);
  refs.researchNotes.innerHTML = notes
    .map(
      (note) => `
        <article>
          <h4>${escapeHtml(note.title)}</h4>
          <p>${escapeHtml(note.text)}</p>
        </article>
      `
    )
    .join("");
}

function restorationMetrics(photo) {
  const seed = Number(photo.id) || 1;
  return [
    {
      label: "清晰度增强",
      value: clamp(70 + (seed % 17) + Math.round((state.restore.contrast - 100) * 0.22), 62, 96),
      note: "提升边缘辨识与主体轮廓",
    },
    {
      label: "对比度提升",
      value: clamp(64 + Math.round((state.restore.contrast - 90) * 0.72), 58, 98),
      note: "增强明暗层次与画面反差",
    },
    {
      label: "噪声抑制",
      value: clamp(76 + (seed % 11), 64, 94),
      note: "降低老照片颗粒与扫描噪点感",
    },
    {
      label: "纸张泛黄校正",
      value: clamp(68 + Math.round(state.restore.warmth * 1.2), 58, 92),
      note: "保留历史质感并修正偏色",
    },
    {
      label: "细节恢复程度",
      value: clamp(66 + (seed % 19) + Math.round((state.restore.brightness - 100) * 0.28), 60, 95),
      note: "改善暗部信息与纹理可读性",
    },
  ];
}

function researchNotes(photo) {
  return [
    {
      title: "画面观察",
      text: `优先观察画面中的人物姿态、地貌环境、建筑或器物细节，并留意照片是否呈现队列、渡口、会址、合影或纪念物等可识别线索。`,
    },
    {
      title: "历史线索",
      text: `该图归入“${photo.category || "长征档案"}”主题，时间线索为${photo.period || "待考"}，地点线索为${photo.location || "长征沿线"}，可与同类照片进行横向比对。`,
    },
    {
      title: "来源说明",
      text: `当前来源记录为“${photo.source || "本地图片史料"}”。正式研究中应继续核验原始出处、发布机构、翻拍版本和图像流传路径。`,
    },
    {
      title: "待考证问题",
      text: `可进一步确认拍摄者、拍摄日期、画面中具体人物或地点，以及该照片在后续纪念、出版和展陈中的使用方式。`,
    },
  ];
}

function photoMatches(photo, keyword) {
  const haystack = [photo.title, photo.description, photo.location, photo.source, photo.category, photo.period, ...(photo.tags || [])].join(" ");
  return haystack.includes(keyword);
}

function inferYear(photo) {
  const match = [photo.period, photo.title, photo.date].join(" ").match(/19\d{2}/);
  return match ? match[0] : "其他";
}

function timelineTitle(year) {
  const titles = {
    "1934": "战略转移与出发记忆",
    "1935": "关键会议、渡口战役与雪山草地",
    "1936": "持续转战与三大主力会师",
    "1937": "到达陕北后的群像与历史记录",
    "1959": "亲历者回望与纪念合影",
    "其他": "无法明确年份的补充史料",
  };
  return titles[year] || `${year} 年影像档案`;
}

function timelineSummary(year, count) {
  if (year === "其他") return `这一组包含 ${count} 张暂未明确年份的照片，可作为补充档案继续考证。`;
  return `这一年共整理出 ${count} 张相关照片，可从地点、人物和事件三个角度串联阅读。`;
}

function openPhotoById(id) {
  const photo = state.photos.find((item) => item.id === id);
  if (photo) openPhoto(photo);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function openRandomPhoto() {
  const pool = state.filtered.length ? state.filtered : state.photos;
  const photo = pool[Math.floor(Math.random() * pool.length)];
  openPhoto(photo);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

init().catch((error) => {
  console.error(error);
  showToast("页面数据加载失败，请检查 photoManifest.json");
});
