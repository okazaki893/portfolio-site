const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = path.join(__dirname, '..', 'content', 'articles');
const OUTPUT_FILE = path.join(__dirname, '..', 'content', 'articles.json');

// フロントマターをパース
function parseFrontMatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    return {};
  }

  const frontMatter = match[1];
  const meta = {};

  frontMatter.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      // 引用符を除去
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      meta[key] = value;
    }
  });

  return meta;
}

// 記事一覧を生成
function buildArticlesList() {
  // フォルダが存在しない場合は空の配列を出力
  if (!fs.existsSync(ARTICLES_DIR)) {
    fs.mkdirSync(ARTICLES_DIR, { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, '[]');
    console.log('Created empty articles.json');
    return;
  }

  const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.md'));
  const articles = [];

  for (const file of files) {
    const filePath = path.join(ARTICLES_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const meta = parseFrontMatter(content);

    // スラッグはファイル名から.mdを除いたもの
    const slug = file.replace('.md', '');

    articles.push({
      slug,
      title: meta.title || 'Untitled',
      date: meta.date || new Date().toISOString(),
      thumbnail: meta.thumbnail || null,
      summary: meta.summary || ''
    });
  }

  // 日付順でソート（新しい順）
  articles.sort((a, b) => new Date(b.date) - new Date(a.date));

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(articles, null, 2));
  console.log(`Generated articles.json with ${articles.length} articles`);
}

buildArticlesList();
