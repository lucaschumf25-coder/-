# 啵比星球 AR 合照 - 第一版互動原型

這是一個可以直接部署到網站的手機 WebAR 原型。

## 已完成
- 開啟手機相機
- 啵比進場、待機漂浮
- 揮手與愛心互動
- 拖曳移動位置
- 雙指縮放角色
- 3、2、1 拍照倒數
- 合成相機畫面＋啵比＋品牌字樣
- 儲存照片

## 重要說明
目前使用你提供角色圖製作「2D 疊加式 WebAR 原型」，不是具備骨架與空間追蹤的真正 3D 模型。
要升級成 3D 地面偵測、繞到角色側面、真實陰影與完整骨架動畫，需要提供 GLB/FBX/BLEND 模型，或另行製作 3D 模型。

## 上線方式
相機功能必須使用 HTTPS。

### 免費方式 A：GitHub Pages
1. 新增 GitHub Repository
2. 上傳整個資料夾內檔案
3. Settings → Pages → Deploy from branch
4. 取得公開網址

### 免費方式 B：Cloudflare Pages
1. 建立 Pages 專案
2. 上傳資料夾或連接 GitHub
3. 不需要建置指令
4. 取得公開網址

## QR Code
將上線後的 HTTPS 網址貼入任何 QR Code 產生器即可。
本專案內的 `make_qr.html` 可在瀏覽器輸入網址後顯示 QR 產生連結。
