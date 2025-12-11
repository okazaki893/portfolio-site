# 独自ドメイン公開手順書

## 前提条件
- XServerで `noumenon.jp` ドメインを取得済み
- Cloudflareでアカウント作成済み
- ポートフォリオサイトのファイルが準備済み

---

## ステップ1: XServerにファイルをアップロード

### 1-1. XServerのサーバー情報を確認
1. XServerのサーバーパネルにログイン
2. 「サーバー情報」から以下を確認：
   - サーバーID
   - FTPサーバー名（例：`ftp.noumenon.jp`）
   - FTPユーザー名
   - FTPパスワード

### 1-2. FTPクライアントで接続
推奨ソフト：
- **FileZilla**（無料）
- **WinSCP**（Windows用、無料）
- **Cyberduck**（無料）

接続情報：
- **ホスト名**: `ftp.noumenon.jp`（またはXServerから提供されたFTPサーバー名）
- **ユーザー名**: XServerから提供されたFTPユーザー名
- **パスワード**: XServerから提供されたFTPパスワード
- **ポート**: `21`（通常のFTP）または `21`（FTPSの場合）

### 1-3. ファイルをアップロード
1. FTPクライアントで接続後、`/` または `/public_html/` ディレクトリに移動
2. 以下のファイルをすべてアップロード：
   ```
   index.html
   3danimation.html
   admin.html
   contact.html
   mixing.html
   music.html
   planning.html
   price.html
   price.css
   style2.css
   theme.css
   theme.js
   mosaic.js
   onaga-saisho.jpg
   ```
3. アップロード後、ブラウザで `http://noumenon.jp` にアクセスして動作確認

---

## ステップ2: CloudflareでDNS設定

### 2-1. Cloudflareにドメインを追加
1. Cloudflareダッシュボードにログイン
2. 「サイトを追加」をクリック
3. `noumenon.jp` を入力して「サイトを追加」をクリック
4. プランを選択（無料プランでOK）

### 2-2. DNSレコードの設定
Cloudflareが自動的にDNSレコードを検出しますが、確認・追加が必要な場合：

**Aレコード（必須）**
- **タイプ**: A
- **名前**: `@` または `noumenon.jp`
- **IPv4アドレス**: XServerから提供されたサーバーのIPアドレス
- **プロキシ状態**: 🟠 プロキシ済み（オレンジの雲マーク）

**CNAMEレコード（wwwサブドメイン用）**
- **タイプ**: CNAME
- **名前**: `www`
- **ターゲット**: `noumenon.jp`
- **プロキシ状態**: 🟠 プロキシ済み

### 2-3. ネームサーバーの変更
1. Cloudflareから提供されたネームサーバーを確認（例：`xxx.ns.cloudflare.com`）
2. XServerのドメイン設定で、ネームサーバーをCloudflareのものに変更：
   - XServerパネル → ドメイン設定 → ネームサーバー設定
   - Cloudflareから提供された2つのネームサーバーを設定
3. 変更が反映されるまで24-48時間かかる場合があります（通常は数時間）

---

## ステップ3: SSL/TLS設定（HTTPS化）

### 3-1. CloudflareでSSL/TLSを有効化
1. Cloudflareダッシュボード → `noumenon.jp` → **SSL/TLS**
2. **暗号化モード**を「**フレキシブル**」または「**完全**」に設定
   - **フレキシブル**: Cloudflare ↔ 訪問者間のみ暗号化（推奨：最初はこちら）
   - **完全**: エンドツーエンド暗号化（XServerでSSL証明書が必要）

### 3-2. 常時HTTPSリダイレクト設定
1. Cloudflareダッシュボード → **SSL/TLS** → **エッジ証明書**
2. 「**常にHTTPSを使用**」を有効化

---

## ステップ4: 動作確認

### 4-1. 基本的な確認
1. `http://noumenon.jp` にアクセス → サイトが表示されるか確認
2. `https://noumenon.jp` にアクセス → HTTPSで表示されるか確認
3. `https://www.noumenon.jp` にアクセス → www付きでも表示されるか確認

### 4-2. 各ページの確認
以下のページが正常に表示されるか確認：
- `/index.html`（トップページ）
- `/mixing.html`
- `/3danimation.html`
- `/music.html`
- `/planning.html`
- `/price.html`
- `/contact.html`

### 4-3. リソースの確認
- CSSファイルが正しく読み込まれているか
- JavaScriptファイルが正しく読み込まれているか
- 画像が正しく表示されているか

---

## トラブルシューティング

### 問題1: サイトが表示されない
**原因**: DNS設定が反映されていない
**解決策**:
- DNS設定の反映を待つ（最大48時間）
- `nslookup noumenon.jp` でDNSレコードを確認
- CloudflareのDNS設定を再確認

### 問題2: HTTPSでアクセスできない
**原因**: SSL/TLS設定が正しくない
**解決策**:
- CloudflareのSSL/TLS設定を確認
- 「常にHTTPSを使用」が有効になっているか確認
- 暗号化モードを「フレキシブル」に設定

### 問題3: 画像やCSSが読み込まれない
**原因**: ファイルパスが間違っている、またはファイルがアップロードされていない
**解決策**:
- FTPでファイルが正しくアップロードされているか確認
- ブラウザの開発者ツール（F12）でエラーを確認
- ファイルパスが相対パス（`style2.css`）になっているか確認

### 問題4: 403 Forbiddenエラー
**原因**: ファイルの権限設定が正しくない
**解決策**:
- FTPクライアントでファイルの権限を確認
- 通常、HTMLファイルは `644`、ディレクトリは `755` に設定

---

## 補足情報

### XServerのサーバーIPアドレスの確認方法
1. XServerパネル → サーバー情報
2. 「サーバーIPアドレス」を確認
3. または、XServerのサポートに問い合わせ

### Cloudflareのメリット
- **無料でSSL証明書**を提供
- **CDN機能**でサイトの読み込み速度が向上
- **DDoS保護**が自動で有効
- **キャッシュ機能**でサーバー負荷を軽減

### 今後のメンテナンス
- ファイルを更新する場合は、FTPでアップロードし直す
- Cloudflareのキャッシュをクリアする場合は、Cloudflareダッシュボード → キャッシュ → キャッシュの削除

---

## 完了後のチェックリスト

- [ ] XServerにすべてのファイルをアップロード
- [ ] Cloudflareにドメインを追加
- [ ] DNSレコードを設定
- [ ] ネームサーバーをCloudflareに変更
- [ ] SSL/TLSを有効化
- [ ] `https://noumenon.jp` でサイトが表示される
- [ ] すべてのページが正常に動作する
- [ ] 画像・CSS・JavaScriptが正しく読み込まれる

---

## サポート

問題が解決しない場合は：
1. XServerのサポートに問い合わせ
2. Cloudflareのサポートに問い合わせ
3. ブラウザの開発者ツール（F12）でエラーを確認

