export interface MenuItem {
  label: string;
  id: string; // Identificador único para cada ítem
  children?: MenuItem[];
}

export const drawerMenu: MenuItem[] = [
  {
    label: "Auxiliars",
    id: "auxiliars",
    children: [
      {
        label: "Abonaments",
        id: "abonaments",
        children: [
          { label: "Classes d'abonament", id: "classes-abonament" },
          { label: "Cobertures d'abonament", id: "cobertures-abonament" },
        ],
      },
      { label: "CNAE", id: "cnae" },
      {
        label: "Calendaris",
        id: "calendaris",
        children: [{ label: "Festivos", id: "festivos" }],
      },
    ],
  },
  {
    label: "Llistats",
    id: "llistats",
    children: [
      {
        label: "Listas",
        id: "listas",
        children: [{ label: "Arrays", id: "arrays" }],
      },
    ],
  },
];
