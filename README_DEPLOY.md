# 老照片修复展示部署说明

这是一个纯静态网站，不需要后端服务。部署时保留这些文件和目录即可：

- `index.html`
- `styles.css`
- `app.js`
- `photoManifest.json`
- `assets/photos/originals/`
- `netlify.toml` 或 `vercel.json`
- `.nojekyll`（GitHub Pages 使用）

## 本地预览

```bash
npm run dev
```

打开：

```text
http://localhost:4173/
```

## Netlify

1. 登录 Netlify。
2. 选择 Add new site -> Deploy manually。
3. 把当前整个文件夹拖进去。
4. Netlify 会读取 `netlify.toml`，直接发布。

## Vercel

1. 把当前文件夹上传到 GitHub 仓库。
2. 在 Vercel 导入这个仓库。
3. Framework Preset 选择 Other。
4. Build Command 留空，Output Directory 填 `.`。
5. 发布即可。

## GitHub Pages

1. 把当前文件夹提交到 GitHub 仓库。
2. 仓库 Settings -> Pages。
3. Source 选择 Deploy from a branch。
4. Branch 选择 `main` 和 `/root`。
5. 保存后等待 Pages 生成公开网址。
