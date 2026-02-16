"use client";

interface Props {
    title: string;
    subtitle?: string;
}

export default function QuestionHeading({ title, subtitle }: Props) {
    return (
        <div className="text-center space-y-0 md:space-y-2">
            <h2 className="text-xl md:text-3xl font-medium">{title}</h2>
            {subtitle && <span className="text-sm md:text-base">{subtitle}</span>}
        </div>
    );
}