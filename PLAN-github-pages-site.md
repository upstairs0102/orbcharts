# OrbCharts 官網 + 文件站遷移至 GitHub Pages — 執行計畫

> 狀態：A、B、C 均已在本機完成並驗證（`pnpm --filter site build` 成功產出 82 個靜態頁面），**尚未 commit / push**。

## 背景與目標

把目前放在私有 GitLab repo（`bpcharts/frontend_v4`）的完整版 OrbCharts 官網（含文件站），搬進這個公開的 `orbcharts` repo，改用 GitHub Pages + GitHub Actions 部署，取代現行的 Docker + nginx SSR 部署方式。同時順便清理 repo 內 v3 / v4 資料夾命名的歷史包袱。

參考來源（私有 repo，僅供搬遷時比對，不會被公開）：
`/Users/sdyou/Documents/Programming/GitLab_BluePlanet/bpcharts/frontend_v4`

## 已確認的決策

1. **網址規劃**：GitHub 預設網域（project page，`<user-or-org>.github.io/orbcharts/`），`basePath` 設為 `/orbcharts`。不使用自訂網域 / CNAME。
2. **既有部署**：Docker + nginx（SSR）**整個退役**，之後唯一的部署方式就是 GitHub Pages。`frontend_v4` 裡的 `Dockerfile` 之後可以移除，不用搬過來。
3. **`demo-v4` 資料夾**：保留在 repo 內，但**不再發布到 GitHub Pages**。GitHub Pages 改用搬遷過來的 `frontend_v4`（完整版官網）。
4. **部署自動化**：使用 **GitHub Actions**，採用 GitHub Pages 官方「Deploy from GitHub Actions」流程（`actions/upload-pages-artifact` + `actions/deploy-pages`），**不使用 `gh-pages` branch**。打包產物不會落地在任何 branch 的 commit 歷史裡，push 到指定 branch（暫定 `v4-dev`，之後可能是 `main`）就自動 build + 發布。舊的 v3 `gh-pages` branch 維持原樣即可，不受影響。
5. **文件資料夾獨立**：`frontend_v4/content`（目前是乾淨的純 Markdown + frontmatter，沒有內嵌自訂 JSX 元件）搬出網站原始碼之外，變成 repo 頂層獨立的 `docs/` 資料夾（`docs/zh/`、`docs/en/`），作為文件的 single source of truth。網站原始碼 import 這裡的內容來 render。這樣文件本身也方便直接被其他開發者 / AI agent 讀取，不需要跑得起整個網站。
6. **網站原始碼要 commit**：推翻一開始「原始碼不上版控、只用 .gitignore 排除」的想法 —— 這會讓 GitHub Actions 沒東西可 build，且此 repo 本來就有公開網站原始碼的先例（v3 `demo/`、v4 `demo-v4` 都是公開的），不需要特別隱藏。網站原始碼資料夾（名稱待定）與 `docs/` 一起 commit 到開發 branch。
7. **打包輸出不進 main 的版控歷史**：不新增第三個「打包產物」資料夾去 commit 到任何長期 branch，完全交給 GitHub Actions 產生並發布（見第 4 點）。

## 最終 repo 結構（草案）

```
repo root
├── docs/              # 文件 source of truth（zh/、en/，純 markdown），commit
├── site/              # frontend_v4 搬過來的網站原始碼，import ../docs 內容，commit
├── demo-v4/           # 保留，但不再發布到 GitHub Pages
└── packages-v4/       # library 本身（重新命名見下）
```

## 待執行事項（依序）

### A. 網站搬遷（frontend_v4 → orbcharts repo）— 已完成

- [x] 決定網站原始碼資料夾最終命名：`site`
- [x] 把 `frontend_v4/content/{en,zh}/docs` 搬到 repo 頂層 `docs/{en,zh}`（拿掉多餘的中間 `docs/` 層），`lib/docs.ts` 改成從 `../docs` 讀取
- [x] 搬遷時排除：`docs-ai/`、`scripts/`（全部都是 `probe-*.mjs`/`check-*.mjs`）、`Dockerfile`、`.dockerignore`、`package-lock.json`（改用 pnpm）
- [x] 複查機密資訊：無 secrets/env 檔案殘留
- [x] `next.config.ts`：`output: 'export'`、`basePath: '/orbcharts'`、`images.unoptimized: true`、`metadataBase`/OG 網址改成 `https://bpbase.github.io/orbcharts`（沿用 v3 `gh-pages` 舊站的 og:url 慣例）
- [x] 移除 `proxy.ts`；`lib/i18n/routing.ts` 的 `localePrefix` 改為 `'always'`
- [x] 根目錄 `app/page.tsx`：改用 `<meta http-equiv="refresh">` + 連結，取代 `redirect()`（`redirect()` 是用 throw 中斷 render，static export 下沒有 middleware 兜底，會讓沒執行 JS 的使用者看到空白頁；已實測 `out/index.html` 正確含 `content="0; url=/orbcharts/en"`）
- [x] `app/not-found.tsx` 裡硬寫的 `/v4/en` 連結改用 `NEXT_PUBLIC_BASE_PATH`
- [x] `pnpm --filter site build` 本機驗證成功：82 個靜態頁面（含兩個語系 × 全部 docs），basePath 在 JS/圖片/favicon 都正確帶上 `/orbcharts` 前綴

**搬遷過程中額外發現並修正的問題**（原規劃沒預期到，屬於把 `site` 放進既有 pnpm workspace 才會冒出來的坑）：
- `site` 原本用 `"@orbcharts/core": "^4.0.0-beta.0"`（打 npm registry）而不是本地 workspace 版本，改成 `"workspace:*"`，才會吃到 repo 裡正在開發的版本，跟 `demo` 的做法一致
- `package.json` 的 `name` 從 `frontend_v4` 改成 `site`；移除已用不到的 `puppeteer-core`（原本只給被排除的 `scripts/` 用）
- `next.config.ts` 的 `turbopack.root` 要指到 **monorepo 根目錄**（`path.join(__dirname, '..')`），不能只指 `site` 自己 —— 因為 `packages/@orbcharts/*` 是透過 pnpm symlink 連進來的，root 沒放寬會建置失敗
- `@next/mdx` 沒有把 `next` 宣告成 peerDependency，導致 pnpm 沒有照各專案（`demo` 用 next 16.1.1、`site` 用 16.2.7）分別解析，`site` build 時型別對到 `demo` 的 next 版本而衝突；已在 `pnpm-workspace.yaml` 用 `packageExtensions` 補上這個宣告修正
- `@types/mdx` 沒有被 pnpm 自動 hoist 進 `site/node_modules`，補成 `site` 自己的 devDependency
- `pnpm-workspace.yaml` 加了 `onlyBuiltDependencies`（`@swc/core`、`sharp` 等），否則這些套件的 native binary postinstall 會被 pnpm 預設擋下來，`next build` 會直接壞掉
- 刪掉了 `site` 自己的 `pnpm-lock.yaml`（workspace 模式只需要 repo 根目錄那份）

### B. GitHub Actions 部署 — 設定檔已建立，尚未實際跑過

- [x] 新增 `.github/workflows/deploy-pages.yml`：checkout → pnpm/node（含 pnpm cache）→ `pnpm install --frozen-lockfile` → `pnpm --filter site... build`（`...` 語法會依 workspace 依賴順序先建 `@orbcharts/core`、`@orbcharts/plugin-basic` 再建 `site`）→ `actions/upload-pages-artifact`（`site/out`）→ `actions/deploy-pages`
- [x] 觸發條件：push 到 `v4-dev`、`main`（限定改到 `site/**`、`docs/**`、`packages/@orbcharts/**`、`pnpm-workspace.yaml`、`pnpm-lock.yaml` 才觸發），另外保留 `workflow_dispatch` 可手動觸發
- [ ] **push 上去後要做**：Repo Settings → Pages → Source 設定為 "GitHub Actions"（repo 層級設定，不會跟著 PR 帶到 upstream，合併進 upstream 後對方也要手動開一次）
- [ ] 第一次 push 後實際觀察 Actions 執行結果，確認部署成功、網站可訪問

### C. 資料夾改名／清理（packages / demo）— 已完成

已驗證：改動前 `packages/`、`demo/`（舊 v3）在 `v4-dev` 與 `main` 上內容完全一致、零差異，此時執行不會有 merge 衝突。

- [x] 刪除舊 `packages/`、`demo/`（v3）
- [x] `packages-v4` → `packages`（用 `git mv`，內容經 diff 確認正確，`packages/orbcharts/package.json` version 為 `4.0.0-beta.0`）
- [x] `demo-v4` → `demo`
- [x] `pnpm-workspace.yaml` workspace glob 更新為 `packages/@orbcharts/*`、`packages/orbcharts`、`demo`、`site`
- [x] `demo/tsconfig.json` 裡的 `../packages-v4/...` path 改成 `../packages/...`
- [x] `demo/package.json` 的 `name` 從 `demo-v4` 改成 `demo`
- [x] `site/lib/examples/data/racing.ts` 裡提到 `demo-v4` 的註解文字改成 `demo`
- [x] `packages/orbcharts/tsconfig.base.json` 檢查過，全是自身相對路徑，不需要改
- [ ] 提醒（非本次動作範圍）：未來若有人復活 `feat-indicator` 或 upstream 的舊 `feat-*` branch 並合併回 `main`，屆時可能對改名後的 `packages/`、`demo/` 產生路徑衝突

## 尚待執行

- [ ] `git status` 檢視完整 diff，確認沒有不該進版控的東西
- [ ] git add + commit（規劃內容分成合理的幾個 commit，例如：docs 搬遷、site 搬遷與 static export 調整、packages/demo 改名、CI workflow）
- [ ] push 到 `origin/v4-dev`
- [ ] 在 fork（`upstairs0102/orbcharts`）的 Settings → Pages 開啟 "GitHub Actions" 來源，觀察第一次自動部署
- [ ] 部署成功後用瀏覽器實際檢查網站（首頁轉址、文件頁、demo 頁、playground 頁），本機只驗證到 build 產物正確，還沒有用真正的瀏覽器跑過 JS 互動
- [ ] 確認無誤後才考慮開 PR 回 upstream main

## 尚待決定 / 待討論事項

（無，已全數確認）
