export type Recipe = {
  id: string;
  name: string;
  description: string;
  cookTime: number;
  servings: number;
  difficulty: '簡単' | '普通' | '本格';
  ingredients: string[];
  steps: string[];
  tips: string;
};

export const recipes: Recipe[] = [];
