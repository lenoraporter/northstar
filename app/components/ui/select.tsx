import * as React from 'react';

const Select = ({
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) => {
  return <select {...props}>{children}</select>;
};

const SelectTrigger = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return <div {...props}>{children}</div>;
};

const SelectValue = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span {...props}>{children}</span>;
};

const SelectContent = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return <div {...props}>{children}</div>;
};

const SelectItem = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return <div {...props}>{children}</div>;
};

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
