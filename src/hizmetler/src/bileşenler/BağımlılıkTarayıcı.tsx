// src/components/DependencyScanner.tsx

import { useState, useEffect } from 'react';
import { getPackageJson } from '../services/githubService';

interface DependencyScannerProps {
  owner: string;
  repo: string;
}

// package.json'daki dependencies objesinin tipini tanımlıyoruz
type Dependencies = {
  [key: string]: string;
};

export function DependencyScanner({ owner, repo }: DependencyScannerProps) {
  const [dependencies, setDependencies] = useState<Dependencies | null>(null);
  const [devDependencies, setDevDependencies] = useState<Dependencies | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const pkg = await getPackageJson(owner, repo);
        if (pkg) {
          setDependencies(pkg.dependencies || null);
          setDevDependencies(pkg.devDependencies || null);
        } else {
          setError('Bu depoda package.json dosyası bulunamadı.');
        }
      } catch (e) {
        setError('Bağımlılıklar alınırken bir hata oluştu.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDependencies();
  }, [owner, repo]);

  if (isLoading) return <p>Bağımlılıklar taranıyor...</p>;
  if (error) return <p style={{ color: 'orange' }}>{error}</p>;

  return (
    <div className="dependency-scanner">
      <h3>Bağımlılık Analizi</h3>
      {dependencies && (
        <div>
          <h4>Ana Bağımlılıklar ({Object.keys(dependencies).length})</h4>
          <ul>
            {Object.entries(dependencies).map(([name, version]) => (
              <li key={name}>
                {name}: <code>{version}</code>
                {/* Güvenlik skoru buraya gelecek */}
              </li>
            ))}
          </ul>
        </div>
      )}
      {devDependencies && (
        <div>
          <h4>Geliştirme Bağımlılıkları ({Object.keys(devDependencies).length})</h4>
          <ul>
            {Object.entries(devDependencies).map(([name, version]) => (
              <li key={name}>
                {name}: <code>{version}</code>
                {/* Güvenlik skoru buraya gelecek */}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
