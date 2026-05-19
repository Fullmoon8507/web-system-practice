# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ToDoリストアプリ。Angular（v21）製のシングルページアプリケーション。Vercelで自動デプロイ、`main`へのpushで反映される。

- **本番URL**: https://web-system-practice.vercel.app/
- **Angularソース**: `todo-angular/`

## Commands

すべてのコマンドは `todo-angular/` ディレクトリで実行する。

```bash
cd todo-angular

# 依存関係インストール
npm install

# 開発サーバー起動（http://localhost:4200）
npm start

# プロダクションビルド
npm run build

# テスト実行（全件）
npm test

# テスト実行（1ファイル指定）
npx ng test --include="src/app/app.spec.ts" --watch=false

# フォーマットチェック
npx prettier --check "src/**/*.{ts,html,css}"

# フォーマット自動修正
npx prettier --write "src/**/*.{ts,html,css}"
```

## Architecture

`App`コンポーネント（`src/app/app.ts`）が唯一のコンポーネント。ルーティングなし。

状態管理はAngular Signalsで行う：
- `todos` — タスク一覧（`localStorage` と同期）
- `filter` — 表示フィルター（`'all' | 'active' | 'done'`）
- `visible` / `remaining` / `total` — `computed()` で派生

データは `localStorage`（キー: `todos-v1`）に永続化。

## Git ワークフロー

- `main` への直接pushは禁止。必ずフィーチャーブランチ → PRを経由すること。
- Vercelはマージ時に自動ビルド・デプロイするため、ビルド済みファイルをコミットしない。

## Code Style

- Prettierの設定は `todo-angular/.prettierrc`（`printWidth: 100`、`singleQuote: true`）
- コミット前に `prettier --write` を実行すること
