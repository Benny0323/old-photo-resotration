# 老照片 AI 修复与彩色化展示平台

南京大学 × 东南大学老照片 AI 修复联合项目展示网站。项目面向历史影像保护、数字人文展陈和智能图像修复，收录 90 张长征相关老照片，提供原图浏览、修复对比、黑白转彩色预览、AI 故事解读、重点照片策展、时间轴叙事和修复图下载等功能。

## 项目特色

- 90 张本地历史照片在线展示
- 原图与 AI 彩色修复效果对比
- 支持拖动滑杆查看修复前后差异
- 支持搜索、分类、时期、标签筛选
- 支持博物馆网格、紧凑墙面、瀑布流、对比墙排版
- 支持收藏、随机档案、复制引用、下载图片
- 自动生成每张照片的展陈式 AI 故事解读
- 提供重点照片策展模式和时间轴叙事模式
- 适配 GitHub Pages、Netlify、Vercel 等静态部署平台

## 技术说明

当前版本是纯静态前端项目，主要由以下文件组成：

```text
index.html              页面结构
styles.css              页面样式
app.js                  交互逻辑
photoManifest.json      90 张照片的目录数据
assets/photos/originals 本地图片资源
README_DEPLOY.md        部署说明
```

当前的修复和彩色化效果在前端完成，使用 CSS 与 Canvas 做实时预览和下载生成。它适合课程展示、项目汇报和网页演示。

如果后续要接入真正的深度学习模型，建议增加后端接口：

```text
前端网页 -> 后端 /api/restore -> AI 修复模型或第三方 API -> 返回修复图
```

注意：不要把付费 API Key 直接写进 `app.js`，否则部署到公网后会暴露密钥。

## 本地运行

进入项目目录：

```bash
cd /Users/bennychan/Desktop/研究生-东南大学/老照片修复前端界面如何排版90张图片
```

启动本地静态服务：

```bash
npm run dev
```

浏览器打开：

```text
http://localhost:4173/
```

检查脚本语法：

```bash
npm run check
```

## GitHub Pages 部署

1. 在 GitHub 新建仓库，例如 `old-photo-resotration`。
2. 把本项目文件上传到仓库根目录。
3. 进入仓库 `Settings -> Pages`。
4. `Source` 选择 `Deploy from a branch`。
5. `Branch` 选择 `main`，目录选择 `/root`。
6. 保存后等待 GitHub Pages 构建完成。

部署完成后访问：

```text
https://你的用户名.github.io/仓库名/
```

更多部署细节见 [README_DEPLOY.md](./README_DEPLOY.md)。

## 自定义域名

如果使用 GitHub Pages 自定义域名，需要：

1. 在仓库根目录保留 `CNAME` 文件。
2. `CNAME` 文件里只写你的域名，例如：

```text
restoration.com
```

3. 到域名服务商后台配置 DNS。
4. 回到 GitHub Pages 设置里填写 Custom domain。
5. 等待 DNS 生效后启用 HTTPS。

提示：`restoration.com` 这类短域名通常已经被别人注册，必须先确认你拥有这个域名。

## 后续可升级方向

- 接入真实 AI 修复模型，生成高质量修复图
- 增加 `assets/photos/restored/` 保存真实修复结果
- 增加后台批量处理脚本，一次性修复 90 张图片
- 增加图片来源校对、史料引用格式和审核状态
- 增加中英文双语展陈模式
- 增加移动端分享海报和专题导览页

## 版权说明

Copyright © 2026 南京大学 × 东南大学老照片修复项目组. All rights reserved.

本项目中的历史图片请根据原始来源、授权范围和课程展示要求使用。正式公开发布前，建议继续核验每张图片的出处、版权和引用格式。
