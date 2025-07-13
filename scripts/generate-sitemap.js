#!/usr/bin/env node
/**
 * サイトマップ生成スクリプト
 * 全てのHTMLファイルを検索してXMLサイトマップを生成
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const baseUrl = 'https://stamp-e20f2.web.app';

// 除外するファイル・ディレクトリ
const excludePaths = [
  'admin',
  'test',
  'tests',
  'node_modules',
  'tools',
  'scripts',
  'content',
  'templates',
  'archive',
  'docs',
  'public',
  'stamp-next'
];

// 除外するファイル名パターン
const excludeFiles = [
  'mobile-test.html',
  'test-backup.html',
  'test-login.html',
  'simple-search.html',
  'simple-cart.html'
];

/**
 * HTMLファイルを再帰的に検索
 */
function findHtmlFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // 除外ディレクトリをスキップ
      if (!excludePaths.some(exclude => item.startsWith(exclude))) {
        findHtmlFiles(fullPath, files);
      }
    } else if (item.endsWith('.html')) {
      // 除外ファイルをスキップ
      if (!excludeFiles.includes(item)) {
        const relativePath = path.relative(rootDir, fullPath);
        files.push(relativePath);
      }
    }
  }
  
  return files;
}

/**
 * HTMLファイルから情報を取得
 */
function getPageInfo(filePath) {
  try {
    const content = fs.readFileSync(path.join(rootDir, filePath), 'utf8');
    
    // タイトルを抽出
    const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';
    
    // メタディスクリプションを抽出
    const descMatch = content.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    const description = descMatch ? descMatch[1].trim() : '';
    
    // ファイルの更新日時を取得
    const stats = fs.statSync(path.join(rootDir, filePath));
    const lastmod = stats.mtime.toISOString().split('T')[0];
    
    return { title, description, lastmod };
  } catch (error) {
    console.warn(`Warning: Could not read ${filePath}:`, error.message);
    return { title: '', description: '', lastmod: new Date().toISOString().split('T')[0] };
  }
}

/**
 * 優先度を決定
 */
function getPriority(filePath) {
  if (filePath === 'index.html') return '1.0';
  if (filePath.includes('category') || filePath.includes('product')) return '0.8';
  if (filePath.includes('about') || filePath.includes('contact')) return '0.7';
  return '0.5';
}

/**
 * 更新頻度を決定
 */
function getChangeFreq(filePath) {
  if (filePath === 'index.html') return 'daily';
  if (filePath.includes('category') || filePath.includes('product')) return 'weekly';
  return 'monthly';
}

/**
 * サイトマップXMLを生成
 */
function generateSitemap() {
  const htmlFiles = findHtmlFiles(rootDir);
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
  xml += '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n';
  xml += '        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n\n';
  
  for (const file of htmlFiles) {
    const url = file === 'index.html' ? baseUrl : `${baseUrl}/${file.replace(/\\/g, '/')}`;
    const info = getPageInfo(file);
    const priority = getPriority(file);
    const changefreq = getChangeFreq(file);
    
    xml += '  <url>\n';
    xml += `    <loc>${url}</loc>\n`;
    xml += `    <lastmod>${info.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${changefreq}</changefreq>\n`;
    xml += `    <priority>${priority}</priority>\n`;
    xml += '  </url>\n\n';
  }
  
  xml += '</urlset>';
  
  // サイトマップファイルを保存
  fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), xml);
  console.log(`✅ サイトマップが生成されました: ${htmlFiles.length}個のページ`);
  
  // 統計情報を表示
  console.log('\n📊 生成統計:');
  htmlFiles.forEach(file => {
    const info = getPageInfo(file);
    console.log(`   ${file} - ${info.title || 'タイトルなし'}`);
  });
}

// メイン実行
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    generateSitemap();
  } catch (error) {
    console.error('❌ サイトマップ生成エラー:', error);
    process.exit(1);
  }
}