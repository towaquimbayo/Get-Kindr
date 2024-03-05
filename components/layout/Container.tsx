const Container = ({ children, className }: {
    children: React.ReactNode;
    className?: string;
}) => {
  return (
    <div className={`container p-8 mx-auto ${
        className ? className : ''
    }`}>
        {children}
    </div>
  );
};

export default Container;