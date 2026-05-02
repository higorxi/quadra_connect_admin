import { createSystem, defineConfig, defaultConfig } from "@chakra-ui/react"

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        // Paleta baseada no contraste entre esporte e gestão
        brand: {
          50: { value: "#F0FDF4" },   // Fundo suave (quase branco)
          100: { value: "#DCFCE7" },  // Verde muito claro
          500: { value: "#22C55E" },  // Verde Quadra Connect (Principal)
          600: { value: "#16A34A" },  // Verde focado (Hover)
          900: { value: "#064E3B" },  // Verde profundo para textos
        },
        navy: {
          500: { value: "#1E293B" },  // Azul marinho da interface de gestão
          600: { value: "#0F172A" },  // Azul quase preto (Top bar/Sidebar)
        },
        action: {
          500: { value: "#3B82F6" },  // Azul Elétrico (Destaques de links/Tech)
          600: { value: "#2563EB" },
        }
      },
      fonts: {
        body: { value: "'Inter', sans-serif" },
        heading: { value: "'Montserrat', sans-serif" },
      },
    },
    semanticTokens: {
      colors: {
        // Mapeamento semântico para facilitar o uso no código
        primary: {
          value: { base: "{colors.brand.500}", _dark: "{colors.brand.500}" }
        },
        "primary.hover": {
          value: { base: "{colors.brand.600}", _dark: "{colors.brand.600}" }
        },
        secondary: {
          value: { base: "{colors.navy.500}", _dark: "{colors.navy.500}" }
        },
        background: {
          value: { base: "#FFFFFF", _dark: "{colors.navy.600}" }
        }
      }
    },
    recipes: {
      button: {
        variants: {
          visual: {
            primary: {
              bg: "primary",
              color: "secondary",
              borderRadius: "md",
              fontWeight: "bold",
              _hover: { bg: "primary.hover", transform: "translateY(-1px)" },
              transition: "all 0.2s",
            },
            outline: {
              border: "2px solid",
              borderColor: "primary",
              color: "primary",
              bg: "transparent",
              _hover: { bg: "brand.50", color: "brand.600" },
            },
            ghost: {
              color: "action.500",
              _hover: { bg: "action.50", color: "action.600" },
            }
          },
        },
        defaultVariants: {
          visual: "primary",
        },
      },
      input: {
        variants: {
          outline: {
            base: {
              border: "2px solid",
              borderColor: "primary",
              bg: "priamry.50",
              color: "primary",
            },
          },
        },
        defaultVariants: {
          variant: "outline",
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, customConfig)