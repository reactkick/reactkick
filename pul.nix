# flake.nix
{
  description = "A development environment for the ReactKick project";

  # Projenin dış bağımlılıkları (girdileri).
  # Burada sadece Nix'in paket koleksiyonu olan nixpkgs'e ihtiyacımız var.
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  # Projenin çıktıları.
  # Bu fonksiyon, girdileri alır ve projenin sağlayacağı şeyleri (örn. geliştirme ortamı) tanımlar.
  outputs = { self, nixpkgs }:
    let
      # Desteklenen tüm sistemler (x86_64-linux, aarch64-darwin, vb.) için
      # bu konfigürasyonu geçerli kılmak için bir helper.
      forAllSystems = nixpkgs.lib.genAttrs [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];

      # Her sistem için paketleri (pkgs) tanımla.
      pkgsFor = system: import nixpkgs {
        inherit system;
        # Gerekirse burada overlay veya config ekleyebilirsiniz.
        # config = {}; overlays = [];
      };

    in
    {
      # Geliştirme ortamlarını 'devShells' altında tanımlıyoruz.
      # 'nix develop' komutu varsayılan olarak bu shell'i kullanır.
      devShells = forAllSystems (system:
        let
          pkgs = pkgsFor system;
        in
        {
          default = pkgs.mkShell {
            # Shell'e girdiğimizde PATH'e eklenecek paketler.
            packages = [
              pkgs.nodejs_20  # ReactKick için gerekli Node.js (versiyon 20)
              pkgs.git        # Versiyon kontrolü için
            ];

            # Shell'e girildiğinde çalıştırılacak komutlar.
            # Kullanıcıya yol göstermek için çok faydalıdır.
            shellHook = ''
              echo "--- ReactKick Geliştirme Ortamına Hoş Geldiniz! ---"
              echo "Gerekli araçlar (node, npm, git) artık kullanılabilir."
              
              # Eğer node_modules dizini yoksa, kullanıcıya hatırlatma yap.
              if [ ! -d "node_modules" ]; then
                echo ""
                echo "Proje bağımlılıklarını kurmak için 'npm install' komutunu çalıştırın."
                echo "Ardından geliştirme sunucusunu başlatmak için 'npm run dev' kullanabilirsiniz."
              fi
              echo "----------------------------------------------------"
            '';
          };
        });
    };
}
