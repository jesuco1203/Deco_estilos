export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
};

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: "metal",
    name: "Espejos con marco de metal",
    slug: "Espejos con marco de metal",
  },
  { id: "sin-marco", name: "Espejos sin marco", slug: "Espejos sin marco" },
  { id: "mdf", name: "Espejos con marco MDF", slug: "Espejos con marco MDF" },
  {
    id: "corporativo",
    name: "Espejos corporativos",
    slug: "Espejos corporativos",
  },
  { id: "mamparas", name: "Mamparas", slug: "Mamparas" },
  {
    id: "estructuras",
    name: "Estructuras decorativas",
    slug: "Estructuras decorativas",
  },
];
