import PortableText from "react-portable-text"

interface Props {
    body: object[];
}

export default function ArticlePortableText({ body }: Props) {
    return <PortableText
        dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
        projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
        content={body}
        serializers={
            {
                h1: ({ children }: any) => {
                    return <h1 className='text-2xl font-bold my-5'>{children}</h1>
                },
                h2: ({ children }: any) => {
                    return <h2 className='text-xl font-bold my-5'>{children}</h2>
                },
                li: ({ children }: any) => {
                    return <li className="ml-4 list-disc">{children}</li>
                },
                link: ({ href, children }: any) => {
                    return <a href={href} className="text-blue-500 hover:underline">
                        {children}
                    </a>
                },
            }
        }
    />
}