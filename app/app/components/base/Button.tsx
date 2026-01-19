import {
  ButtonHTMLAttributes,
  FunctionComponent,
  PropsWithChildren,
  Ref,
} from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>;
  className?: string;
}

export const Button: FunctionComponent<PropsWithChildren<Props>> = ({
  children,
  ref,
  className,
  ...props
}) => {
  return (
    <button className={`${className}  `} ref={ref} {...props}>
      {children}
    </button>
  );
};
