type CodeProps = {
  children: React.ReactNode;
  className?: string;
};

export function Code({ children, className }: CodeProps) {
  return <code className={className}>{children}</code>;
}
