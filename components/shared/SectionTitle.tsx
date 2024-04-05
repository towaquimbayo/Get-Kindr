import Container from "../layout/Container";

const SectionTitle = ({ children, align, pretitle, title }: {
    children?: React.ReactNode;
    align?: string;
    pretitle?: string;
    title: string;
}) => {
  return (
    <Container className={`flex w-full flex-col mt-6 ${
        align === "left" ? "" : "items-center justify-center text-center"
    }`}>
        {pretitle && (
            <div className="text-md font-bold tracking-widest text-tertiary brightness-90 uppercase">
                {pretitle}
            </div>
        )}

        {title && (
            <h2 className="max-w-lg mt-3 text-3xl font-display font-bold leading-snug tracking-tight text-secondary lg:leading-tight lg:text-5xl">
                {title}
            </h2>
        )}

        {children && (
            <p className="max-w-2xl py-4 text-lg leading-normal text-secondary opacity-80 lg:text-xl xl:text-xl text-left">
                {children}
            </p>
        )}
    </Container>
  );
}

export default SectionTitle;