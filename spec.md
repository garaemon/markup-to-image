# **markuptoimage 技術仕様書**

**プロジェクト概要:** テキストベースのマークアップ（LaTeX, Mermaid, Markdown/Code）を、スライドに最適な「統一デザインの画像資産」へ変換するシングルページ・ウェブアプリケーション。

## **1\. システムアーキテクチャ**

* **フレームワーク:** [Next.js (App Router)](https://nextjs.org/)  
* **ホスティング:** [Vercel](https://vercel.com/)  
* **レンダリング・パイプライン:** \- クライアント側でリアルタイムプレビューを表示し、エクスポート時に高解像度レンダリングを実行。  
  * 必要に応じて [Vercel OG Image Generation (Satori)](https://github.com/vercel/satori) を使用し、サーバーサイドでのSVG生成をサポート。

## **2\. ユーザーインターフェース (UI) 仕様**

### **2.1 構成レイアウト**

* **ヘッダー:**  
  * ロゴおよびサービス名。  
  * 言語選択タブ（LaTeX, Mermaid, Markdown）。  
  * シェアボタン（現在の状態をURLパラメータとしてコピー）。  
* **メイン（2カラム）:**  
  * **左カラム (エディタ & オプション):**  
    * テキスト入力エリア（シンタックスハイライト付きエディタ推奨）。  
    * **Exampleボタン群:** 各言語ごとに「Basic」「Advanced」「Use Case」等のプリセットをワンクリックで挿入。  
    * **統一フォーマットUI:** 全言語共通のスライダー/トグル（Padding, Corner Radius, Transparency, Theme）。  
  * **右カラム (プレビュー & エクスポート):**  
    * リアルタイム・ライブプレビュー領域。  
    * アクションボタン（Copy as PNG, Copy as SVG, Download PNG, Download SVG）。

## **3\. 機能要件**

### **3.1 対応マークアップと言語エンジン**

1. **LaTeX (数式):**  
   * エンジン: [KaTeX](https://katex.org/)  
   * 理由: 描画速度が極めて速く、スライド作成時のリアルタイムプレビューに最適。  
2. **Mermaid (図解):**  
   * エンジン: [Mermaid.js](https://mermaid.js.org/)  
   * 範囲: Flowchart, Sequence, Gantt, GitGraph 等。  
3. **Markdown / Code (コード・表):**  
   * エンジン: [Shiki](https://shiki.style/)  
   * 特徴: VS Codeと同じテーマエンジンを使用し、スライド上で「本物」のコードハイライトを実現。

### **3.2 統一デザインオプション (Format Options)**

すべての生成画像に対し、以下のプロパティを一貫して適用する。

* **Padding:** 0px 〜 128px（スライド上の余白調整用）。  
* **Corner Radius:** 0px 〜 40px（モダンなカード型デザイン用）。  
* **Background:** 透過 (Transparent) または ソリッドカラー（テーマ連動）。  
* **Theme:** Dark / Light の切り替え、またはプリセット（GitHub, Dracula等）。

### **3.3 エクスポート機能**

* **コピー機能 (Clipboard API):**  
  * **PNG:** navigator.clipboard.write() を使用し、Google Slides等へ直接貼り付け可能なバイナリ形式でコピー。  
  * **SVG:** 文字列（またはデータURI）としてコピー。  
* **ダウンロード機能:**  
  * PNG（高解像度: 300dpi相当）、SVG（ベクターデータ）。

## **4\. データ共有・永続化仕様**

### **4.1 URLパラメータによるステート管理 (Stateless Design)**

データベースを排除し、以下の情報をURLに含める。

* l: 言語 (latex, mermaid, markdown)  
* c: コンテンツ (Base64または [lz-string](https://pieroxy.net/blog/pages/lz-string/index.html) による圧縮済み文字列)  
* p: Padding値  
* r: Corner Radius値  
* t: 透過フラグ (0 or 1\)  
* h: テーマ名

**メリット:** URLそのものが「保存データ」となり、ブックマークやSNS共有、スライド内の編集用リンクとして機能する。

## **5\. 実装に向けたステップ (Next.js / Vercel)**

1. **UI基盤:** [shadcn/ui](https://ui.shadcn.com/) と [Tailwind CSS](https://tailwindcss.com/) を用い、プロフェッショナルな操作感を実現。  
2. **コピー・DL処理:** [html-to-image](https://github.com/bubkoo/html-to-image) もしくは [modern-screenshot](https://www.google.com/search?q=https://github.com/weidongni/modern-screenshot) を活用。  
3. **高画質化:** SVGからPNGへの高品質変換のため、サーバーサイドで [resvg-js](https://github.com/yisibl/resvg-js) を検討。

## **6\. 参考リソース**

* [KaTeX公式ドキュメント](https://katex.org/docs/supported.html)  
* [Mermaid.js構成図ガイド](https://mermaid.js.org/intro/)  
* [Shikiハイライター](https://shiki.style/guide/)  
* [Vercel Satori (HTML-to-SVG)](https://github.com/vercel/satori)