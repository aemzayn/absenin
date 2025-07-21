type NumberBodyTemplateProps = {
  rowIndex: number;
};

export function NumberBodyTemplate({ rowIndex }: NumberBodyTemplateProps) {
  return rowIndex + 1;
}
