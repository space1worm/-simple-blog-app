import { urlFor } from "../sanity";

import ArticlePortableText from "./ArticlePortableText";

interface Props {
    title: string;
    description: string;
    authorImgRef: string;
    authorName: string;
    createdAt: string;
    body: object[];
}

export default function Article(props: Props) {
    const { title, description, authorImgRef, authorName, createdAt, body } = props;

    return <article className='max-w-3xl mx-auto p-5'>
        <h1 className='text-3xl mt-10 mb-3'>{title}</h1>
        <h2 className='text-xl font-light text-gray-500 mb-2'>{description}</h2>

        <div className='flex items-center space-x-4'>
            <img className='h-10 w-10 rounded-full object-cover' src={urlFor(authorImgRef).url()} alt="Author" />
            <p className='font-extralight text-sm'>
                Blog post by <span className='font-bold text-yellow-400'>{authorName}</span> - Published at {new Date(createdAt).toLocaleString()}
            </p>
        </div>

        <div className='mt-10'>
            {body ? (
                <ArticlePortableText
                    body={body}
                />
            ) : (
                <p>Couldn'get get data</p>
            )}
        </div>
    </article>
}
