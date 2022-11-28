export interface OptionProps {
  value?: string;
  key?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
export interface DataDrivenOptionProps extends Omit<OptionProps, 'children'> {
  label?: React.ReactNode;
}

const Option: React.FC<OptionProps> = () => null;

export default Option;
