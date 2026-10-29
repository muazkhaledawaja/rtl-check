export type Issue = {
  file: string;
  line: number;
  column: number;
  ruleId: string;
  message: string;
  found: string;
  fix: string;
};

export type Rule = {
  id: string;
  run(ctx: { file: string; content: string }): Issue[];
};
