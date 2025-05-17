import * as React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <span ref={ref} className={className} {...props}>
        {children}
      </span>
    );
  }
);
Badge.displayName = 'Badge';

export { Badge };
