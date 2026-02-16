// Define props
interface Props {
    main: string;
    sub?: string;
}

export default function PageHeading({ main, sub }: Props) {
    return (
        <div className="w-full text-center px-4 sm:px-6 lg:px-0 mb-4 md:mb-8 space-y-2">
            <h1 className="text-black text-2xl md:text-4xl font-normal leading-tight">
                {main}
            </h1>
            {sub && (
                <p className="text-black text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
                    {sub}
                </p>
            )}
        </div>
    );
}