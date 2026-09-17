{
  description = "Arkonavt - Local Music Player";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs =
    { self, nixpkgs }:
    let
      for-all-systems = nixpkgs.lib.genAttrs [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
    in
    {
      devShells = for-all-systems (
        system:
        let
          pkgs = import nixpkgs { inherit system; };

          mk-scripter =
            command-name: file-path:
            let
              interpreter =
                let
                  ext =
                    let
                      match = builtins.match ".*\\.([^.]+)$" file-path;
                    in
                    if match != null then builtins.head match else throw "couldn't determine ext";
                in
                {
                  "sh" = "${pkgs.bash}/bin/bash";
                  "elv" = "${pkgs.elvish}/bin/elvish";
                  "py" = "${pkgs.python3}/bin/python3";
                  "js" = "${pkgs.nodejs}/bin/node";
                  "nu" = "${pkgs.nushell}/bin/nu";
                }
                .${ext} or (throw "unsupported .${ext}");
            in
            pkgs.writeShellScriptBin command-name ''
              ROOT_DIR=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
              exec ${interpreter} "$ROOT_DIR/${file-path}" "$@"
            '';
        in
        {
          default = pkgs.mkShell {
            packages = with pkgs; [
              odin
              ols
              gdb
              lldb

              yt-dlp

              nasm
              clang
              gnumake

              git

              elvish

              # scripts
              (mk-scripter "run-main" "scripts/run-main.elv")
            ];

            shellHook = ''
              echo "hii"
            '';
          };
        }
      );
    };
}
