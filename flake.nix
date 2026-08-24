{
  description = "Arkonavt - Local Music Player";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_latest
            yt-dlp
            ffmpeg
            git
          ];

          shellHook = ''
              export LD_LIBRARY_PATH="${
                pkgs.lib.makeLibraryPath [
                  pkgs.glib
                  pkgs.nss
                  pkgs.nspr
                  pkgs.atk
                  pkgs.at-spi2-atk
                  pkgs.at-spi2-core
                  pkgs.cups
                  pkgs.dbus
                  pkgs.gtk3
                  pkgs.pango
                  pkgs.cairo
                  pkgs.alsa-lib
                  pkgs.mesa
                  pkgs.libxkbcommon
                  pkgs.xorg.libX11
                  pkgs.xorg.libXcomposite
                  pkgs.xorg.libXdamage
                  pkgs.xorg.libXext
                  pkgs.xorg.libXfixes
                  pkgs.xorg.libXrandr
                ]
              }:$LD_LIBRARY_PATH"
            echo "Arkonavt dev shell active. Node, yt-dlp, and ffmpeg loaded."
          '';
        };
      }
    );
}
