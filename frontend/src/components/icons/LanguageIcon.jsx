import { Code2 } from "lucide-react";

import {
  SiC,
  SiClojure,
  SiCplusplus,
  SiCrystal,
  SiCss,
  SiDart,
  SiDocker,
  SiElixir,
  SiErlang,
  SiFsharp,
  SiGnubash,
  SiGo,
  SiGraphql,
  SiHaskell,
  SiHtml5,
  SiJavascript,
  SiJson,
  SiJupyter,
  SiKotlin,
  SiLua,
  SiMarkdown,
  SiMysql,
  SiNim,
  SiOcaml,
  SiOpenjdk,
  SiPerl,
  SiPhp,
  SiPostgresql,
  SiPython,
  SiR,
  SiReact,
  SiRedis,
  SiRuby,
  SiRust,
  SiScala,
  SiSharp,
  SiSolidity,
  SiSqlite,
  SiSvelte,
  SiSwift,
  SiTerraform,
  SiTypescript,
  SiVuedotjs,
  SiWebassembly,
  SiYaml,
  SiZig,
} from "react-icons/si";

const LANGUAGE_MAP = {
  JavaScript: {
    Icon: SiJavascript,
    background: "#F7DF1E",
    iconColor: "#323330",
  },

  TypeScript: {
    Icon: SiTypescript,
    background: "#3178C6",
    iconColor: "#ffffff",
  },

  Python: {
    Icon: SiPython,
    background: "#3776AB",
    iconColor: "#ffffff",
  },

  Java: {
    Icon: SiOpenjdk,
    background: "#ED8B00",
    iconColor: "#ffffff",
  },

  Go: {
    Icon: SiGo,
    background: "#00ADD8",
    iconColor: "#ffffff",
  },

  Rust: {
    Icon: SiRust,
    background: "#DEA584",
    iconColor: "#1a1a1a",
  },

  Kotlin: {
    Icon: SiKotlin,
    background: "#7F52FF",
    iconColor: "#ffffff",
  },

  "C++": {
    Icon: SiCplusplus,
    background: "#00599C",
    iconColor: "#ffffff",
  },

  C: {
    Icon: SiC,
    background: "#A8B9CC",
    iconColor: "#1a1a1a",
  },

  "C#": {
    Icon: SiSharp,
    background: "#512BD4",
    iconColor: "#ffffff",
  },

  Ruby: {
    Icon: SiRuby,
    background: "#CC342D",
    iconColor: "#ffffff",
  },

  PHP: {
    Icon: SiPhp,
    background: "#777BB4",
    iconColor: "#ffffff",
  },

  Swift: {
    Icon: SiSwift,
    background: "#F05138",
    iconColor: "#ffffff",
  },

  Dart: {
    Icon: SiDart,
    background: "#0175C2",
    iconColor: "#ffffff",
  },

  Shell: {
    Icon: SiGnubash,
    background: "#4EAA25",
    iconColor: "#ffffff",
  },

  HTML: {
    Icon: SiHtml5,
    background: "#E34F26",
    iconColor: "#ffffff",
  },

  CSS: {
    Icon: SiCss,
    background: "#1572B6",
    iconColor: "#ffffff",
  },

  Vue: {
    Icon: SiVuedotjs,
    background: "#42B883",
    iconColor: "#ffffff",
  },

  Scala: {
    Icon: SiScala,
    background: "#DC322F",
    iconColor: "#ffffff",
  },

  "Jupyter Notebook": {
    Icon: SiJupyter,
    background: "#F37626",
    iconColor: "#ffffff",
  },

  JSX: {
    Icon: SiReact,
    background: "#61DAFB",
    iconColor: "#1a1a1a",
  },

  TSX: {
    Icon: SiReact,
    background: "#61DAFB",
    iconColor: "#1a1a1a",
  },

  Svelte: {
    Icon: SiSvelte,
    background: "#FF3E00",
    iconColor: "#ffffff",
  },

  Elixir: {
    Icon: SiElixir,
    background: "#4B275F",
    iconColor: "#ffffff",
  },

  Erlang: {
    Icon: SiErlang,
    background: "#A90533",
    iconColor: "#ffffff",
  },

  Haskell: {
    Icon: SiHaskell,
    background: "#5D4F85",
    iconColor: "#ffffff",
  },

  Lua: {
    Icon: SiLua,
    background: "#2C2D72",
    iconColor: "#ffffff",
  },

  Perl: {
    Icon: SiPerl,
    background: "#39457E",
    iconColor: "#ffffff",
  },

  R: {
    Icon: SiR,
    background: "#276DC3",
    iconColor: "#ffffff",
  },

  Clojure: {
    Icon: SiClojure,
    background: "#5881D8",
    iconColor: "#ffffff",
  },

  Crystal: {
    Icon: SiCrystal,
    background: "#000000",
    iconColor: "#ffffff",
  },

  "F#": {
    Icon: SiFsharp,
    background: "#378BBA",
    iconColor: "#ffffff",
  },

  OCaml: {
    Icon: SiOcaml,
    background: "#EC6813",
    iconColor: "#ffffff",
  },

  Nim: {
    Icon: SiNim,
    background: "#FFE953",
    iconColor: "#1a1a1a",
  },

  Zig: {
    Icon: SiZig,
    background: "#F7A41D",
    iconColor: "#1a1a1a",
  },

  Solidity: {
    Icon: SiSolidity,
    background: "#363636",
    iconColor: "#ffffff",
  },

  WebAssembly: {
    Icon: SiWebassembly,
    background: "#654FF0",
    iconColor: "#ffffff",
  },

  Dockerfile: {
    Icon: SiDocker,
    background: "#2496ED",
    iconColor: "#ffffff",
  },

  Markdown: {
    Icon: SiMarkdown,
    background: "#64748b",
    iconColor: "#ffffff",
  },

  JSON: {
    Icon: SiJson,
    background: "#292929",
    iconColor: "#ffffff",
  },

  YAML: {
    Icon: SiYaml,
    background: "#CB171E",
    iconColor: "#ffffff",
  },

  GraphQL: {
    Icon: SiGraphql,
    background: "#E10098",
    iconColor: "#ffffff",
  },

  Terraform: {
    Icon: SiTerraform,
    background: "#844FBA",
    iconColor: "#ffffff",
  },

  PostgreSQL: {
    Icon: SiPostgresql,
    background: "#4169E1",
    iconColor: "#ffffff",
  },

  MySQL: {
    Icon: SiMysql,
    background: "#4479A1",
    iconColor: "#ffffff",
  },

  SQLite: {
    Icon: SiSqlite,
    background: "#003B57",
    iconColor: "#ffffff",
  },

  Redis: {
    Icon: SiRedis,
    background: "#DC382D",
    iconColor: "#ffffff",
  },

  PowerShell: {
    Icon: SiGnubash,
    background: "#5391FE",
    iconColor: "#ffffff",
  },
};

const FALLBACK = {
  Icon: Code2,
  background: "#64748b",
  iconColor: "#ffffff",
};

function getLanguageConfig(language) {
  if (!language) {
    return FALLBACK;
  }

  return LANGUAGE_MAP[language] || FALLBACK;
}

function LanguageIcon({
  language,
  size = "md",
  className = "",
}) {
  const { Icon, background, iconColor } =
    getLanguageConfig(language);

  const isFallback =
    !language || !LANGUAGE_MAP[language];

  const sizes = {
    sm: {
      box: 24,
      icon: 14,
    },
    md: {
      box: 32,
      icon: 16,
    },
    lg: {
      box: 40,
      icon: 20,
    },
  };

  const currentSize = sizes[size] || sizes.md;

  return (
    <div
      className={`language-icon ${className}`}
      style={{
        width: currentSize.box,
        height: currentSize.box,
        backgroundColor: background,
      }}
    >
      <Icon
        size={currentSize.icon}
        color={iconColor}
        aria-hidden="true"
      />
    </div>
  );
}

function getLanguageLabel(language) {
  return language || "Unknown";
}

export default LanguageIcon;

export {
  LanguageIcon,
  getLanguageLabel,
};