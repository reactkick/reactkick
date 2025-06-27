// src/services/githubService.ts

import { Octokit } from "octokit";

// ... (mevcut kodlar burada kalacak)
export const octokit = new Octokit({ auth: import.meta.env.VITE_GITHUB_TOKEN });

// YENİ FONKSİYONU EKLEYELİM
export async function getPackageJson(owner: string, repo: string): Promise<any> {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: 'package.json',
    });

    // GitHub API, dosya içeriğini base64 formatında kodlanmış olarak döndürür.
    // 'content' alanının varlığını ve tipini kontrol etmemiz gerekiyor.
    if ('content' in data) {
      const content = Buffer.from(data.content, 'base64').toString('utf-8');
      return JSON.parse(content);
    } else {
      throw new Error("package.json içeriği alınamadı veya dosya bir dizin.");
    }

  } catch (error) {
    console.error("package.json alınırken hata:", error);
    // Eğer dosya bulunamazsa (404), null dönelim ki uygulamamız çökmesin.
    if (error.status === 404) {
      return null;
    }
    throw error; // Diğer hataları tekrar fırlat
  }
}
